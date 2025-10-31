import { NextRequest, NextResponse } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'
import { PRIORITY_SITES } from '@/lib/utils'
import { findRelatedArticles } from '@/lib/data'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// Helper function to create model-specific prompts
function createModelSpecificPrompt(query: string, crawledContent: any[], modelType: 'gemini' | 'openai' | 'deepseek') {
  const baseContent = `
Claim to fact-check: ${query}

Sources found:
${crawledContent.map((item: any, index: number) => `
Source ${index + 1}: ${item.title}
URL: ${item.url}
Language: ${item.isEnglish ? 'English' : 'Bengali'}
Content: ${item.content.substring(0, 1000)}...
`).join('\n')}
`;

  // Base prompt in English for all models
  const basePrompt = `${baseContent}

You are an experienced journalist and fact-checker. Create a detailed, human-friendly, and comprehensive report to verify the following claim:

**Main Claim:** ${query}

**Your Task:**
1. Collect information from available sources
2. Verify the credibility of each source
3. Find consistency in the information
4. Make a clear decision

**Report Structure:**

# Claim
[Write the main claim clearly]

# Verdict
[True/False/Misleading/Unverified - write clearly]

# Detailed Analysis
Include the following topics in this section:

## প্রাথমিক তথ্য সংগ্রহ (Primary Information Collection)
- What sources we reviewed
- What information we found from each source
- How credible the sources are

## তথ্যের বিশ্লেষণ (Information Analysis)
- How consistent the found information is with each other
- Which information is credible and why
- Which information is questionable and why

## যুক্তি ও প্রমাণ (Logic and Evidence)
- Explain step by step the logic for reaching the conclusion
- Provide evidence behind each argument
- Use numbered references [1], [2], [3], etc.

## পটভূমি ও ইতিহাস (Context and History)
- If relevant, explain the history or context behind the event
- Explain why this is important

# সতর্কতা ও সীমাবদ্ধতা (Warnings and Limitations)
- If any information is unclear or limited
- If more research is needed
- If there are questions about source credibility

# উপসংহার (Conclusion)
- Summary of main decision
- Why this decision was reached
- What it means for common people

**Important Instructions:**
- Write everything in simple, clear, and human-friendly Bengali
- Explain complex topics simply
- Provide logic at each step
- Be objective and evidence-based
- If using information from English sources, translate and write in Bengali
- Write so readers can easily understand
- Explain complex topics through Q&A or examples
- **CRITICAL:** Do NOT create "Source List" or "Sources" section yourself. Only use the sources provided above.
- No need to provide separate source list at the end of the report.
- **Markdown Formatting:** Use only # and ##. Do NOT use ### or ####.
- **Detailed Writing:** Write at least 3-4 paragraphs in each section.
- **Examples and Analysis:** Provide detailed examples and analysis for each point.

**STRICT SOURCE RESTRICTION - SOCIAL MEDIA:**
- **NEVER use social media links (Facebook, Twitter/X, Instagram, YouTube, TikTok, LinkedIn, Reddit, Telegram, WhatsApp, etc.) as fact-checking sources for verifying information accuracy.**
- Social media links are NOT acceptable as authoritative sources for fact-checking verification.
- Social media can ONLY be referenced for contextual purposes (e.g., "This claim was widely shared on social media") or to mention related discussions, but NEVER as a source to verify facts or determine the truthfulness of information.
- If a source is from social media, it should be completely excluded from the fact-checking analysis and verdict determination.
- Only use credible news sources, official websites, research papers, government sources, and verified fact-checking organizations for fact verification.

Write the report as if an experienced journalist is writing for their readers - simple, clear, and trustworthy.
**MOST IMPORTANT: This report MUST be detailed and comprehensive. Do NOT write concisely or briefly.**`;

  if (modelType === 'deepseek') {
    return `${basePrompt}

**CRITICAL INSTRUCTION FOR DEEPSEEK:**
You MUST write an EXTENSIVE, DETAILED, and COMPREHENSIVE report. Do NOT be concise or brief. Write as if you are a senior investigative journalist writing for a major newspaper. Your report should be AT LEAST 1500-2000 words.

**Additional DeepSeek Instructions:**
- You MUST write a **detailed and comprehensive report**
- Do NOT write concisely or briefly
- Write at least 1500-2000 words
- Explain each topic in detail
- Fill with examples and analysis
- Write so readers get the complete picture`;
  }

  // Add Groq/OpenAI-specific constraints to avoid table outputs
  if (modelType === 'openai') {
    return `${basePrompt}

**STRICT FORMAT RULES (for GROQ/OpenAI):**
- Do NOT generate tables in any form (no Markdown tables, no HTML tables)
- Do NOT use the pipe character '|' to format columns
- Write ONLY paragraphs and, where necessary, simple bullet lists
- Keep headings to only # and ## as specified above
`
  }

  return basePrompt;
}

// Helper function to generate AI report with three-tier fallback: Gemini → GROQ → DeepSeek
async function generateAIReport(query: string, crawledContent: any[], maxRetries: number = 3): Promise<string> {
  // Step 1: Try Gemini first (gemini-2.5-flash)
  console.log('🤖 Trying Gemini (gemini-2.5-flash) first...')
  
  const geminiPrompt = createModelSpecificPrompt(query, crawledContent, 'gemini')
  
  // Try Gemini model with retries
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🤖 Generating AI report with gemini-2.5-flash (attempt ${attempt}/${maxRetries})...`)
      const result = await model.generateContent(geminiPrompt)
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
          console.log('❌ Max retries reached for rate limit, trying GROQ...')
          break
        }
      }
      
      // For other errors, try GROQ
      break
    }
  }

  // Step 2: Fallback to GROQ (GPT-OSS-120B)
  console.log('🔄 Gemini (gemini-2.5-flash) failed, falling back to GROQ...')
  
  try {
    console.log('🤖 Trying GROQ (openai/gpt-oss-120b)...')
    
    const groqPrompt = createModelSpecificPrompt(query, crawledContent, 'openai')
    
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": groqPrompt
        }
      ],
      "model": "openai/gpt-oss-120b",
      "temperature": 1,
      "max_tokens": 8192,
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

  // Step 3: Final fallback to DeepSeek
  try {
    console.log('🔄 GROQ failed, trying DeepSeek (deepseek-r1-0528:free) as final fallback...')
    
    const deepseekPrompt = createModelSpecificPrompt(query, crawledContent, 'deepseek')
    
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
            "content": deepseekPrompt
          }
        ],
        "max_tokens": 6000,
        "temperature": 0.7,
        "top_p": 0.9,
        "frequency_penalty": 0.1,
        "presence_penalty": 0.1
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
  
  // Return fallback report if all attempts fail
  return 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।'
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }



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
      const bangladeshiResults = await tavilyManager.search(query, {
        sites: bangladeshiNewsSites,
        max_results: 15,
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
        const englishResults = await tavilyManager.search(query, {
          max_results: 15,
          search_depth: "advanced",
          include_domains: [
            'reuters.com', 'bbc.com', 'cnn.com', 'ap.org', 'factcheck.org',
            'snopes.com', 'politifact.com', 'who.int', 'un.org', 'worldbank.org'
          ]
        })
        
        if (englishResults.results && englishResults.results.length > 0) {
          // If we have Bengali sources, append English sources (limit to total of 15)
          if (hasBengaliSources) {
            const remainingSlots = 15 - searchResults.results.length
            if (remainingSlots > 0) {
              searchResults.results = [...searchResults.results, ...englishResults.results.slice(0, remainingSlots)]
            }
          } else {
            searchResults.results = englishResults.results.slice(0, 15)
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
        const generalResults = await tavilyManager.search(query, {
          max_results: 15,
          search_depth: "advanced"
        })
        
        if (generalResults.results) {
          searchResults.results = generalResults.results.slice(0, 15)
          console.log(`✅ Found ${generalResults.results.length} general sources`)
        }
      } catch (error) {
        console.error('Failed to search general web:', error)
      }
    }

    // Use search results directly without crawling for faster response (limit to 15 most relevant)
    // Filter out social media sources - they should not be used for fact-checking verification
    const filteredResults = searchResults.results?.filter((result: any) => {
      const url = (result.url || '').toLowerCase()
      const socialMediaDomains = ['facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'youtube.com', 
                                   'tiktok.com', 'linkedin.com', 'reddit.com', 'telegram.org', 'whatsapp.com',
                                   'messenger.com', 'pinterest.com', 'snapchat.com', 'viber.com']
      return !socialMediaDomains.some(domain => url.includes(domain))
    }) || []
    
    const crawledContent = filteredResults.slice(0, 15).map((result: any, index: number) => ({
      title: result.title,
      url: result.url,
      content: (result as any).content || (result as any).snippet || 'Content not available',
      isEnglish: !hasBengaliSources || (hasEnglishSources && index >= filteredResults.length - (hasEnglishSources ? 3 : 0))
    })) || []

    // Generate fact-checking report with model-specific prompts
    const report = await generateAIReport(query, crawledContent)
    
    // Find related articles from our database
    const relatedArticles = findRelatedArticles(query, 3)
    
    // Add fallback content if AI failed
    const finalReport = report === 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।' 
      ? `
## দাবি
${query}

## সিদ্ধান্ত
অযাচাইকৃত

## বিস্তারিত বিশ্লেষণ

**প্রাথমিক তথ্য সংগ্রহ:**
আমরা এই দাবিটি যাচাই করার জন্য ${crawledContent.length} টি উৎস পর্যালোচনা করেছি। আমাদের গবেষণায় নিম্নলিখিত উৎসসমূহ অন্তর্ভুক্ত ছিল:

${crawledContent.map((item: any, index: number) => `- ${item.title} (${item.isEnglish ? 'ইংরেজি উৎস' : 'বাংলা উৎস'})`).join('\n')}

**তথ্যের বিশ্লেষণ:**
তবে দুর্ভাগ্যবশত, AI সিস্টেমে সাময়িক সমস্যার কারণে আমরা এই উৎসসমূহ থেকে প্রাপ্ত তথ্যের বিস্তারিত বিশ্লেষণ করতে পারছি না।

**যুক্তি ও প্রমাণ:**
বর্তমানে আমরা যে তথ্যগুলি সংগ্রহ করতে পেরেছি, সেগুলি যথেষ্ট নয় এই দাবির সত্যতা যাচাই করার জন্য।

## সতর্কতা ও সীমাবদ্ধতা
- AI সিস্টেমে সাময়িক সমস্যা রয়েছে
- আরও গবেষণার প্রয়োজন
- এই দাবিটি আরও যাচাই করা প্রয়োজন

## উপসংহার
এই দাবিটি সম্পর্কে এখনই কোন সিদ্ধান্তে পৌঁছানো সম্ভব নয়। আমরা পাঠকদের পরামর্শ দিচ্ছি যে তারা এই বিষয়ে আরও তথ্য সংগ্রহ করুন এবং বিশ্বাসযোগ্য উৎস থেকে যাচাই করে নিন।

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
      `
      : report

    // Determine verdict from report content
    const getVerdictFromReport = (reportText: string): 'true' | 'false' | 'misleading' | 'unverified' => {
      const lowerText = reportText.toLowerCase()
      if (lowerText.includes('সত্য') || lowerText.includes('true')) {
        return 'true'
      } else if (lowerText.includes('মিথ্যা') || lowerText.includes('false')) {
        return 'false'
      } else if (lowerText.includes('ভ্রান্ত') || lowerText.includes('misleading')) {
        return 'misleading'
      } else {
        return 'unverified'
      }
    }
    
    const verdict = getVerdictFromReport(finalReport)

    return NextResponse.json({
      claim: query,
      report: finalReport,
      verdict: verdict,
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
