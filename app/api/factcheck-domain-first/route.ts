import { NextRequest, NextResponse } from 'next/server'
import { tavily } from '@tavily/core'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'
import { findRelatedArticles } from '@/lib/data'
import { ALLOWED_SITES, normalizeUrl, extractDomain, isAllowedSite } from '@/lib/utils'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" })
const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

interface SearchResult {
  url: string
  domain: string
  title: string
  published: string | null
  author: string | null
  relevance_score: number
  excerpt: string
  source: string
}

interface FactCheckResponse {
  status: 'success' | 'partial' | 'no_results'
  used_tavily: boolean
  selected_urls: SearchResult[]
  notes: string[]
  claim: string
  report: string
  relatedArticles?: {
    id: string
    title: string
    slug: string
    summary: string
    verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'debunk'
    publishedAt: string
    author: string
    tags: string[]
    thumbnail?: string
  }[]
  searchStats: {
    totalSitesSearched: number
    totalResultsFound: number
    allowedSitesResults: number
    tavilyResults: number
  }
  generatedAt: string
}

// Helper function to fetch HTML with timeout
async function fetchHTML(url: string, timeoutMs: number = 10000): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Khoj-FactChecker/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }
    
    return await response.text()
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// Helper function to extract main content from HTML
function extractMainContent(html: string, url: string): {
  title: string
  published: string | null
  author: string | null
  text: string
} {
  try {
    // Simple content extraction using regex and basic parsing
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ''
    
    // Extract published date from various meta tags
    const publishedMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i) ||
                          html.match(/<time[^>]*datetime="([^"]+)"/i) ||
                          html.match(/<meta[^>]*name="date"[^>]*content="([^"]+)"/i)
    const published = publishedMatch ? publishedMatch[1] : null
    
    // Extract author
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]+)"/i) ||
                       html.match(/<meta[^>]*property="article:author"[^>]*content="([^"]+)"/i)
    const author = authorMatch ? authorMatch[1] : null
    
    // Extract main text content (simplified approach)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (!bodyMatch) return { title, published, author, text: '' }
    
    let bodyContent = bodyMatch[1]
    
    // Remove scripts and styles
    bodyContent = bodyContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    bodyContent = bodyContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    
    // Extract text from paragraphs, headings, and divs
    const textElements = bodyContent.match(/<(p|h[1-6]|div)[^>]*>([^<]+)<\/\1>/gi) || []
    const text = textElements
      .map(el => el.replace(/<[^>]*>/g, '').trim())
      .filter(text => text.length > 20) // Filter out very short texts
      .slice(0, 20) // Limit to first 20 elements
      .join(' ')
    
    return { title, published, author, text }
  } catch (error) {
    return { title: '', published: null, author: null, text: '' }
  }
}

// Helper function to calculate relevance score
function calculateRelevanceScore(content: { title: string; text: string }, query: string): number {
  const queryLower = query.toLowerCase()
  const titleLower = content.title.toLowerCase()
  const textLower = content.text.toLowerCase()
  
  let score = 0
  
  // Title matches get higher weight
  if (titleLower.includes(queryLower)) score += 0.4
  if (textLower.includes(queryLower)) score += 0.3
  
  // Keyword matching
  const keywords = queryLower.split(/\s+/).filter(k => k.length > 2)
  keywords.forEach(keyword => {
    if (titleLower.includes(keyword)) score += 0.1
    if (textLower.includes(keyword)) score += 0.05
  })
  
  return Math.min(1, score)
}

// Helper function to find search candidates from a domain
async function findSearchCandidates(domain: string, query: string): Promise<string[]> {
  const candidates = new Set<string>()
  const encodedQuery = encodeURIComponent(query)
  
  // Common search patterns
  const searchPatterns = [
    `https://${domain}/search?q=${encodedQuery}`,
    `https://${domain}/?s=${encodedQuery}`,
    `https://${domain}/find?q=${encodedQuery}`,
    `https://${domain}/search?query=${encodedQuery}`,
    `https://${domain}/?search=${encodedQuery}`,
    `https://${domain}/feed`,
    `https://${domain}/rss`,
    `https://${domain}/sitemap.xml`,
    `https://${domain}/news`,
    `https://${domain}/blog`,
    `https://${domain}/articles`
  ]
  
  for (const pattern of searchPatterns) {
    try {
      const html = await fetchHTML(pattern, 5000)
      
      // Extract links from the page
      const linkMatches = html.match(/href="([^"]+)"/gi) || []
      linkMatches.forEach(match => {
        const href = match.replace(/href="([^"]+)"/i, '$1')
        if (href && !href.startsWith('http')) {
          const fullUrl = href.startsWith('/') ? `https://${domain}${href}` : `https://${domain}/${href}`
          candidates.add(fullUrl)
        }
      })
      
      // Extract from RSS/XML
      const itemMatches = html.match(/<loc>([^<]+)<\/loc>/gi) || []
      itemMatches.forEach(match => {
        const url = match.replace(/<loc>([^<]+)<\/loc>/i, '$1')
        candidates.add(url)
      })
      
    } catch (error) {
      // Continue with next pattern
    }
  }
  
  return Array.from(candidates).slice(0, 50) // Limit to 50 candidates
}

// Main function to gather results from allowed sites
async function gatherFromAllowedSites(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = []
  const processedUrls = new Set<string>()
  
  console.log(`🔍 Searching ${ALLOWED_SITES.length} allowed sites for: "${query}"`)
  
  // Process sites in batches to avoid overwhelming
  const batchSize = 5
  for (let i = 0; i < ALLOWED_SITES.length; i += batchSize) {
    const batch = ALLOWED_SITES.slice(i, i + batchSize)
    
    await Promise.all(batch.map(async (domain) => {
      try {
        const candidates = await findSearchCandidates(domain, query)
        
        for (const url of candidates) {
          if (processedUrls.has(url)) continue
          processedUrls.add(url)
          
          try {
            const html = await fetchHTML(url, 8000)
            const content = extractMainContent(html, url)
            const score = calculateRelevanceScore(content, query)
            
            if (score >= 0.3) { // Minimum relevance threshold
              results.push({
                url: normalizeUrl(url),
                domain: extractDomain(url),
                title: content.title || 'No title',
                published: content.published,
                author: content.author,
                relevance_score: score,
                excerpt: content.text.substring(0, 200) + '...',
                source: 'allowed_sites'
              })
            }
          } catch (error) {
            // Skip this URL and continue
          }
        }
      } catch (error) {
        console.error(`Error processing domain ${domain}:`, error)
      }
    }))
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Sort by relevance score and return top results
  return results
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 15)
}

// Fallback function using Tavily API with English sources
async function tavilyFallback(query: string): Promise<SearchResult[]> {
  try {
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY })
    
    // First try to find Bengali sources
    let results: any = { results: [] }
    
    try {
      const bangladeshiResults = await client.search(query, {
        sites: [
          'https://www.prothomalo.com',
          'https://www.bd-pratidin.com', 
          'https://www.jugantor.com',
          'https://www.kalerkantho.com',
          'https://www.samakal.com',
          'https://www.thedailystar.net',
          'https://www.bdnews24.com',
          'https://www.dhakatribune.com'
        ],
        max_results: 5,
        search_depth: "advanced"
      })
      
      if (bangladeshiResults.results && bangladeshiResults.results.length > 0) {
        results.results = bangladeshiResults.results
        console.log(`✅ Found ${bangladeshiResults.results.length} Bengali sources in Tavily fallback`)
      }
    } catch (error) {
      console.error('Failed to search Bengali sources in Tavily fallback:', error)
    }
    
    // If insufficient Bengali sources, search for English sources
    if (!results.results || results.results.length < 3) {
      try {
        console.log('🔍 Searching for English sources in Tavily fallback...')
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
          if (results.results && results.results.length > 0) {
            results.results = [...results.results, ...englishResults.results.slice(0, 3)]
          } else {
            results.results = englishResults.results
          }
          console.log(`✅ Found ${englishResults.results.length} English sources in Tavily fallback`)
        }
      } catch (error) {
        console.error('Failed to search English sources in Tavily fallback:', error)
      }
    }
    
    // If still no results, try general search
    if (!results.results || results.results.length === 0) {
      try {
        console.log('🔍 Trying general search in Tavily fallback...')
        const generalResults = await client.search(query, {
          max_results: 8,
          search_depth: "advanced"
        })
        
        if (generalResults.results) {
          results.results = generalResults.results
          console.log(`✅ Found ${generalResults.results.length} general sources in Tavily fallback`)
        }
      } catch (error) {
        console.error('Failed to search general web in Tavily fallback:', error)
      }
    }
    
    return (results.results || []).map((result: any) => ({
      url: result.url,
      domain: extractDomain(result.url),
      title: result.title || 'No title',
      published: result.published_date || null,
      author: null,
      relevance_score: result.score || 0.5,
      excerpt: (result.snippet || result.content || '').substring(0, 200) + '...',
      source: 'tavily_fallback'
    }))
  } catch (error) {
    console.error('Tavily fallback error:', error)
    return []
  }
}

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

    console.log(`🚀 Starting domain-first fact check for: "${query}"`)

    // Step 1: Search in ALLOWED_SITES first
    const allowedSitesResults = await gatherFromAllowedSites(query)
    console.log(`✅ Found ${allowedSitesResults.length} results from allowed sites`)

    let finalResults = allowedSitesResults
    let usedTavily = false
    let status: 'success' | 'partial' | 'no_results' = 'success'
    const notes: string[] = []

    // Step 2: Check if we need fallback
    if (allowedSitesResults.length < 3 || allowedSitesResults.every(r => r.relevance_score < 0.5)) {
      console.log('⚠️ Insufficient results from allowed sites, using Tavily fallback')
      const tavilyResults = await tavilyFallback(query)
      finalResults = [...allowedSitesResults, ...tavilyResults]
      usedTavily = true
      notes.push('Tavily API was used as fallback due to insufficient results from allowed sites')
      
      if (finalResults.length === 0) {
        status = 'no_results'
      } else if (finalResults.length < 5) {
        status = 'partial'
      }
    }

    // Sort final results by relevance
    // Sort final results by relevance
    finalResults.sort((a, b) => b.relevance_score - a.relevance_score)
    const topResults = finalResults.slice(0, 12)
    
    // Add language information to results
    const topResultsWithLanguage = topResults.map((result, index) => ({
      ...result,
      language: result.source === 'tavily_fallback' ? 'English' : 'Bengali'
    }))

    console.log(`📊 Final results: ${topResultsWithLanguage.length} sources (${usedTavily ? 'with Tavily' : 'allowed sites only'})`)

         // Step 3: Generate report with Gemini AI
     const contentForAI = `
**ফ্যাক্ট চেকিং অনুরোধ:**
দাবি: ${query}

**উপলব্ধ উৎসসমূহ (${topResultsWithLanguage.length}টি):**
${topResultsWithLanguage.map((result, index) => `
**উৎস ${index + 1}** (${result.source === 'allowed_sites' ? 'নির্দিষ্ট সাইট' : 'Tavily API'}):
শিরোনাম: ${result.title}
ডোমেইন: ${result.domain}
URL: ${result.url}
ভাষা: ${result.language}
প্রাসঙ্গিকতা স্কোর: ${result.relevance_score.toFixed(2)}
প্রকাশের তারিখ: ${result.published || 'অজানা'}
লেখক: ${result.author || 'অজানা'}
সংক্ষিপ্ত বিবরণ: ${result.excerpt}
`).join('\n')}

**নির্দেশনা:**
আপনি একজন অভিজ্ঞ ফ্যাক্ট চেকার। উপরের দাবিটি যাচাই করে একটি বিস্তারিত রিপোর্ট তৈরি করুন।

**রিপোর্টের কাঠামো:**
১. **দাবি:** [মূল দাবিটি এখানে লিখুন]
২. **সিদ্ধান্ত:** [সত্য/মিথ্যা/ভ্রান্তিমূলক/অযাচাইকৃত] - আত্মবিশ্বাসের মাত্রা সহ
৩. **বিস্তারিত বিশ্লেষণ:** 
   - দাবির বিভিন্ন দিক বিশ্লেষণ করুন
   - প্রতিটি উৎসের গুরুত্ব মূল্যায়ন করুন
   - বিরোধী তথ্য থাকলে তুলে ধরুন
৪. **প্রমাণের মূল্যায়ন:**
   - প্রতিটি উৎসের নির্ভরযোগ্যতা মূল্যায়ন করুন
   - প্রাথমিক উৎস বনাম মাধ্যমিক উৎসের পার্থক্য করুন
৫. **সতর্কতা:** [যদি থাকে]
৬. **উপসংহার:** [সারসংক্ষেপ]

**বিশেষ নির্দেশনা:**
- সবকিছু বাংলায় লিখুন
- স্পষ্ট যুক্তি প্রদান করুন
- সংখ্যাযুক্ত রেফারেন্স ব্যবহার করুন [১], [২], [৩] ইত্যাদি
- উদ্দেশ্যমূলক এবং প্রমাণ-ভিত্তিক হোন
- **মহত্বপূর্ণ:** যদি ইংরেজি উৎস থেকে তথ্য ব্যবহার করা হয়, তাহলে সেটা বাংলায় অনুবাদ করে লিখুন
- প্রতিটি দাবির জন্য বিস্তারিত বিশ্লেষণ দিন
- আত্মবিশ্বাসের মাত্রা (০-১০০%) উল্লেখ করুন
- যদি Tavily API ব্যবহার করা হয়ে থাকে, তাহলে সেটা স্পষ্টভাবে উল্লেখ করুন
- **মহত্বপূর্ণ:** আপনি নিজে থেকে "উৎসের তালিকা" বা "উৎসসমূহ" সেকশন তৈরি করবেন না। শুধু উপরে দেওয়া উৎসসমূহ ব্যবহার করে রিপোর্ট লিখুন।
- রিপোর্টের শেষে আলাদা উৎস তালিকা দেবার প্রয়োজন নেই।
`

        const report = await generateAIReport(contentForAI)
    
    // Find related articles from our database
    const relatedArticles = findRelatedArticles(query, 3)
    
    // Add fallback content if AI failed
    const finalReport = report === 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।' 
      ? `
**দাবি:** ${query}

**সিদ্ধান্ত:** অযাচাইকৃত

**বিস্তারিত বিশ্লেষণ:** 
এই দাবিটি যাচাই করার জন্য আমরা ${topResultsWithLanguage.length} টি উৎস পর্যালোচনা করেছি। 
তবে AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।

**উপসংহার:** এই দাবিটি আরও যাচাই করা প্রয়োজন।

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
${usedTavily ? '\n\n**নোট:** এই রিপোর্টে Tavily API ব্যবহার করা হয়েছে।' : ''}
      `
      : report

    const response: FactCheckResponse = {
      status,
      used_tavily: usedTavily,
      selected_urls: topResultsWithLanguage,
      notes,
      claim: query,
      report: finalReport,
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
      searchStats: {
        totalSitesSearched: ALLOWED_SITES.length,
        totalResultsFound: finalResults.length,
        allowedSitesResults: allowedSitesResults.length,
        tavilyResults: usedTavily ? finalResults.length - allowedSitesResults.length : 0
      },
      generatedAt: new Date().toISOString()
    }

    console.log('✅ Domain-first fact check completed successfully')
    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Fact check error:', error)
    return NextResponse.json(
      { error: 'Failed to generate fact-checking report' },
      { status: 500 }
    )
  }
}
