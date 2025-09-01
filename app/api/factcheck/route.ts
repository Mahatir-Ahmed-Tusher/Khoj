import { NextRequest, NextResponse } from 'next/server'
import { tavily } from '@tavily/core'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'
import { PRIORITY_SITES } from '@/lib/utils'
import { findRelatedArticles } from '@/lib/data'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// Helper function to generate AI report with three-tier fallback: DeepSeek → Gemini → GROQ
async function generateAIReport(contentForAI: string, maxRetries: number = 3): Promise<string> {
  // Step 1: Try DeepSeek (deepseek-r1-0528:free) first (primary)
  try {
    console.log('🤖 Trying DeepSeek (deepseek-r1-0528:free)...')
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://khoj-factchecker.vercel.app",
        "X-Title": "Khoj Fact Checker",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
          {
            "role": "user",
            "content": contentForAI
          }
        ],
        "max_tokens": 4000,
        "temperature": 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;
      if (generatedText) {
        console.log('✅ DeepSeek report generated successfully');
        return generatedText;
      }
    } else {
      console.log(`❌ DeepSeek failed with status: ${response.status}`);
    }
  } catch (deepseekError) {
    console.error('❌ DeepSeek error:', deepseekError);
  }

  // Step 2: Fallback to Gemini with retry logic
  console.log('🔄 DeepSeek failed, falling back to Gemini...');
  
  // Try main Gemini model first
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Generating AI report with gemini-1.5-pro (attempt ${attempt}/${maxRetries})...`)
      const result = await model.generateContent(contentForAI)
      const response = await result.response
      return response.text()
    } catch (geminiError: any) {
      console.error(`❌ Gemini AI error (attempt ${attempt}):`, geminiError)
      
      // Check if it's a rate limit error
      if (geminiError.message && geminiError.message.includes('429')) {
        if (attempt < maxRetries) {
          // Calculate delay with exponential backoff (6s, 12s, 24s)
          const delay = Math.min(6000 * Math.pow(2, attempt - 1), 30000)
          console.log(`⏳ Rate limited. Waiting ${delay/1000}s before retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          continue
        } else {
          console.log('❌ Max retries reached for rate limit, trying fallback model...')
          break
        }
      }
      
      // For other errors, try fallback model
      break
    }
  }
  
  // Try Gemini fallback model
  try {
    console.log('🔄 Trying fallback model (gemini-1.5-flash)...')
    const result = await fallbackModel.generateContent(contentForAI)
    const response = await result.response
    return response.text()
  } catch (fallbackError) {
    console.error('❌ Fallback model also failed:', fallbackError)
  }

  // Step 3: Try GROQ (GPT-OSS-20B) as final fallback
  try {
    console.log('🔄 Gemini failed, trying GROQ (openai/gpt-oss-20b)...')
    
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": contentForAI
        }
      ],
      "model": "openai/gpt-oss-20b",
      "temperature": 0.3,
      "max_tokens": 4000,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;
    if (generatedText) {
      console.log('✅ GROQ report generated successfully');
      return generatedText;
    }
  } catch (groqError) {
    console.error('❌ GROQ error:', groqError);
  }
  
  // Return fallback report if all attempts fail
  return 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।'
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Initialize Tavily client with environment API key
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY })

    // Step 1: Search within Bangladeshi news sites for current information
    const bangladeshiNewsSites = [
      'https://www.prothomalo.com',
      'https://www.bd-pratidin.com', 
      'https://www.jugantor.com',
      'https://www.kalerkantho.com',
      'https://www.samakal.com',
      'https://www.thedailystar.net',
      'https://www.bdnews24.com',
      'https://www.dhakatribune.com'
    ]

    let searchResults: any = { results: [] }
    let hasBengaliSources = false
    let hasEnglishSources = false

    // Step 1: Search within Bangladeshi news sites for Bengali content
    try {
      const bangladeshiResults = await client.search(query, {
        sites: bangladeshiNewsSites,
        max_results: 8,
        search_depth: "advanced"
      })
      
      if (bangladeshiResults.results && bangladeshiResults.results.length > 0) {
        searchResults.results = bangladeshiResults.results
        hasBengaliSources = true
        console.log(`✅ Found ${bangladeshiResults.results.length} Bengali sources`)
      }
    } catch (error) {
      console.error('Failed to search Bangladeshi sites:', error)
    }

    // Step 2: If insufficient Bengali sources, search for English sources
    if (!hasBengaliSources || searchResults.results.length < 3) {
      try {
        console.log('🔍 Searching for English sources...')
        const englishResults = await client.search(query, {
          max_results: 8,
          search_depth: "advanced",
          include_domains: [
            'reuters.com', 'bbc.com', 'cnn.com', 'ap.org', 'factcheck.org',
            'snopes.com', 'politifact.com', 'who.int', 'un.org', 'worldbank.org'
          ]
        })
        
        if (englishResults.results && englishResults.results.length > 0) {
          // If we have Bengali sources, append English sources
          if (hasBengaliSources) {
            searchResults.results = [...searchResults.results, ...englishResults.results.slice(0, 3)]
          } else {
            searchResults.results = englishResults.results
          }
          hasEnglishSources = true
          console.log(`✅ Found ${englishResults.results.length} English sources`)
        }
      } catch (error) {
        console.error('Failed to search English sources:', error)
      }
    }

    // Step 3: If still no results, try general search
    if (!searchResults.results || searchResults.results.length === 0) {
      try {
        console.log('🔍 Trying general search...')
        const generalResults = await client.search(query, {
          max_results: 8,
          search_depth: "advanced"
        })
        
        if (generalResults.results) {
          searchResults.results = generalResults.results
          console.log(`✅ Found ${generalResults.results.length} general sources`)
        }
      } catch (error) {
        console.error('Failed to search general web:', error)
      }
    }

    // Use search results directly without crawling for faster response
    const crawledContent = searchResults.results?.slice(0, 5).map((result: any, index: number) => ({
      title: result.title,
      url: result.url,
      content: (result as any).content || (result as any).snippet || 'Content not available',
      isEnglish: !hasBengaliSources || (hasEnglishSources && index >= searchResults.results.length - 3)
    })) || []

    // Prepare content for AI with enhanced instructions for mixed sources
    const contentForAI = `
Claim to fact-check: ${query}

Sources found:
${crawledContent.map((item: any, index: number) => `
Source ${index + 1}: ${item.title}
URL: ${item.url}
Language: ${item.isEnglish ? 'English' : 'Bengali'}
Content: ${item.content.substring(0, 1000)}...
`).join('\n')}

Please provide a comprehensive fact-checking report in Bengali with the following structure:

1. দাবি: [মূল দাবিটি এখানে লিখুন]
2. সিদ্ধান্ত: [সত্য/মিথ্যা/ভ্রান্তিমূলক/অযাচাইকৃত]
3. বিস্তারিত বিশ্লেষণ: [বাংলায় বিস্তারিত ব্যাখ্যা, ধাপে ধাপে যুক্তি সহ]
4. প্রমাণ: [উপলব্ধ প্রমাণের বিশ্লেষণ]
5. সতর্কতা: [যদি থাকে]
6. উপসংহার: [সারসংক্ষেপ]

নিম্নলিখিত বিষয়গুলি নিশ্চিত করুন:
- সবকিছু বাংলায় লিখুন
- স্পষ্ট যুক্তি প্রদান করুন
- ব্যাখ্যায় সংখ্যাযুক্ত রেফারেন্স ব্যবহার করুন [১], [২], [৩] ইত্যাদি
- উদ্দেশ্যমূলক এবং প্রমাণ-ভিত্তিক হোন
- **মহত্বপূর্ণ:** যদি ইংরেজি উৎস থেকে তথ্য ব্যবহার করা হয়, তাহলে সেটা বাংলায় অনুবাদ করে লিখুন
- প্রতিটি দাবির জন্য বিস্তারিত বিশ্লেষণ দিন
- **মহত্বপূর্ণ:** আপনি নিজে থেকে "উৎসের তালিকা" বা "উৎসসমূহ" সেকশন তৈরি করবেন না। শুধু উপরে দেওয়া উৎসসমূহ ব্যবহার করে রিপোর্ট লিখুন।
- রিপোর্টের শেষে আলাদা উৎস তালিকা দেবার প্রয়োজন নেই।
`

    // Generate fact-checking report with Gemini AI
    const report = await generateAIReport(contentForAI)
    
    // Find related articles from our database
    const relatedArticles = findRelatedArticles(query, 3)
    
    // Add fallback content if AI failed
    const finalReport = report === 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।' 
      ? `
দাবি: ${query}

সিদ্ধান্ত: অযাচাইকৃত

বিস্তারিত বিশ্লেষণ: 
এই দাবিটি যাচাই করার জন্য আমরা ${crawledContent.length} টি উৎস পর্যালোচনা করেছি। 
তবে AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।

উপসংহার: এই দাবিটি আরও যাচাই করা প্রয়োজন।

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
      `
      : report

    return NextResponse.json({
      claim: query,
      report: finalReport,
      sources: crawledContent.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        url: item.url,
        snippet: item.content.substring(0, 200) + '...',
        language: item.isEnglish ? 'English' : 'Bengali'
      })),
      relatedArticles: relatedArticles.map(article => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        verdict: article.verdict,
        publishedAt: article.publishedAt,
        author: article.author,
        tags: article.tags,
        thumbnail: article.thumbnail
      })),
      sourceInfo: {
        hasBengaliSources,
        hasEnglishSources,
        totalSources: crawledContent.length
      },
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Fact check error:', error)
    return NextResponse.json(
      { error: 'Failed to generate fact-checking report' },
      { status: 500 }
    )
  }
}
