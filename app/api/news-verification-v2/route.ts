import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { tavily } from '@tavily/core'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY_NEWS })

interface NewsAnalysis {
  title: string
  content: string
  url: string
  author?: string
  publishedDate?: string
  domain: string
}

async function fetchNewsContent(url: string): Promise<NewsAnalysis | null> {
  try {
    console.log('Fetching news content for:', url)
    
    // Try multiple user agents and approaches to bypass 403 errors
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0'
    ]
    
    let response: Response | null = null
    let lastError: any = null
    
    // Try with different user agents
    for (const userAgent of userAgents) {
      try {
        response = await fetch(url, {
          headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Sec-CH-UA': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-CH-UA-Mobile': '?0',
            'Sec-CH-UA-Platform': '"Windows"'
          },
          // Add timeout
          signal: AbortSignal.timeout(20000) // 20 seconds timeout
        })
        
        if (response.ok) {
          break // Success, exit the loop
        } else {
          console.log(`HTTP error ${response.status} with User-Agent: ${userAgent.substring(0, 50)}...`)
          lastError = new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        console.log(`Fetch failed with User-Agent: ${userAgent.substring(0, 50)}...`, error)
        lastError = error
        continue
      }
    }
    
    if (!response || !response.ok) {
      console.log(`All attempts failed. Last error:`, lastError)
      
      // Fallback: Try using Tavily's web scraping capability
      console.log('Trying Tavily web scraping as fallback...')
      try {
        const tavilyResponse = await tavilyClient.search(url, {
          max_results: 1,
          include_domains: [],
          exclude_domains: [],
          search_depth: "advanced"
        })
        
        if (tavilyResponse.results && tavilyResponse.results.length > 0) {
          const result = tavilyResponse.results[0]
          const urlObj = new URL(url)
          
          return {
            title: result.title || 'No title found',
            content: result.content || 'No content available',
            url: url,
            author: '',
            publishedDate: '',
            domain: urlObj.hostname
          }
        }
      } catch (tavilyError) {
        console.log('Tavily fallback also failed:', tavilyError)
      }
      
      return null
    }

    const html = await response.text()
    
    // Simple HTML parsing without browser automation
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : 'No title found'
    
    // Extract main content using regex patterns
    const contentPatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    ]
    
    let content = ''
    for (const pattern of contentPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        content = match[1]
        break
      }
    }
    
    // If no specific content found, extract from body
    if (!content) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      content = bodyMatch ? bodyMatch[1] : html
    }
    
    // Clean HTML tags and extract text
    const textContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 5000) // Limit content length
    
    // Extract author
    const authorPatterns = [
      /<meta[^>]*name="author"[^>]*content="([^"]+)"/i,
      /<span[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<div[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/div>/i
    ]
    
    let author = ''
    for (const pattern of authorPatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        author = match[1].trim()
        break
      }
    }
    
    // Extract published date
    const datePatterns = [
      /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i,
      /<time[^>]*datetime="([^"]+)"/i,
      /<meta[^>]*name="pubdate"[^>]*content="([^"]+)"/i
    ]
    
    let publishedDate = ''
    for (const pattern of datePatterns) {
      const match = html.match(pattern)
      if (match && match[1]) {
        publishedDate = match[1].trim()
        break
      }
    }
    
    // Extract domain
    const urlObj = new URL(url)
    const domain = urlObj.hostname
    
    return {
      title,
      content: textContent,
      url,
      author,
      publishedDate,
      domain
    }
    
  } catch (error) {
    console.error('Error fetching news content:', error)
    return null
  }
}

async function analyzeWithGemini(newsContent: NewsAnalysis): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" })
    
    const prompt = `
আপনি একজন অভিজ্ঞ সাংবাদিক এবং ফ্যাক্ট চেকার। নিম্নলিখিত নিউজ আর্টিকেলটি বিশ্লেষণ করে একটি বিস্তারিত রিপোর্ট তৈরি করুন:

**নিউজ আর্টিকেল:**
- শিরোনাম: ${newsContent.title}
- ডোমেইন: ${newsContent.domain}
- লেখক: ${newsContent.author || 'অজানা'}
- প্রকাশের তারিখ: ${newsContent.publishedDate || 'অজানা'}
- বিষয়বস্তু: ${newsContent.content}

**আপনার কাজ:**
1. নিউজ আর্টিকেলের মূল দাবি চিহ্নিত করুন
2. দাবির সত্যতা যাচাই করার জন্য প্রয়োজনীয় অনুসন্ধান বিষয় নির্ধারণ করুন
3. একটি প্রাথমিক বিশ্লেষণ প্রদান করুন

**মহানুভবতা:** কেবলমাত্র নিচের JSON ফরম্যাটে উত্তর দিন। অন্য কোনো টেক্সট বা ব্যাখ্যা দেবেন না।

{
  "claim": "মূল দাবি (সংক্ষিপ্ত)",
  "searchQueries": ["অনুসন্ধান বিষয় 1", "অনুসন্ধান বিষয় 2", "অনুসন্ধান বিষয় 3"],
  "analysis": "বিস্তারিত বিশ্লেষণ (বাংলায়)",
  "confidence": 85
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response with better error handling
    try {
      // Clean the response text first
      let cleanedText = text.trim()
      
      // Remove markdown code blocks more aggressively
      cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
      cleanedText = cleanedText.replace(/^```json$/gm, '').replace(/^```$/gm, '')
      
      // Find JSON object - look for the first complete JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*?\}(?=\s*$|\s*\{)/)
      if (!jsonMatch) {
        // Try alternative approach - find everything between first { and last }
        const firstBrace = cleanedText.indexOf('{')
        const lastBrace = cleanedText.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
        } else {
          throw new Error('No JSON object found in response')
        }
      } else {
        cleanedText = jsonMatch[0]
      }
      
      // Clean up any remaining issues
      cleanedText = cleanedText.trim()
      
      // Try to parse directly without additional escaping
      const parsed = JSON.parse(cleanedText)
      
      // Validate required fields
      if (!parsed.claim || !parsed.searchQueries || !parsed.analysis) {
        throw new Error('Missing required fields in response')
      }
      
      return parsed
      
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw response:', text)
      
      // Return a fallback response
      return {
        claim: "বিশ্লেষণ ব্যর্থ হয়েছে",
        searchQueries: ["নিউজ আর্টিকেল", "বাংলাদেশ", "খবর"],
        analysis: "দুঃখিত, এই নিউজ আর্টিকেলটি বিশ্লেষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        confidence: 0
      }
    }
    
  } catch (error) {
    console.error('Gemini analysis error:', error)
    throw error
  }
}

async function searchWithTavily(searchQueries: string[]): Promise<any[]> {
  try {
    const results = []
    
    for (const query of searchQueries.slice(0, 3)) {
      try {
        const response = await tavilyClient.search(query, {
          max_results: 5,
          include_domains: [],
          exclude_domains: []
        })
        
        results.push(...response.results)
      } catch (error) {
        console.error(`Tavily search failed for query: ${query}`, error)
      }
    }
    
    return results
    
  } catch (error) {
    console.error('Tavily search error:', error)
    return []
  }
}

async function generateFinalReport(newsContent: NewsAnalysis, analysis: any, searchResults: any[]): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" })
    
    const sourcesText = searchResults.map((source, index) => 
      `${index + 1}. ${source.title} - ${source.url}`
    ).join('\n')
    
    const prompt = `
আপনি একজন অভিজ্ঞ ফ্যাক্ট চেকার। নিম্নলিখিত তথ্যের ভিত্তিতে একটি চূড়ান্ত ফ্যাক্ট চেক রিপোর্ট তৈরি করুন:

**মূল নিউজ আর্টিকেল:**
- শিরোনাম: ${newsContent.title}
- ডোমেইন: ${newsContent.domain}
- বিষয়বস্তু: ${newsContent.content}

**প্রাথমিক বিশ্লেষণ:**
${analysis.analysis}

**অনুসন্ধান ফলাফল:**
${sourcesText}

**মহানুভবতা:** কেবলমাত্র নিচের JSON ফরম্যাটে উত্তর দিন। অন্য কোনো টেক্সট বা ব্যাখ্যা দেবেন না।

{
  "verdict": "true|false|misleading",
  "confidence": 85,
  "claim": "মূল দাবি",
  "report": "বিস্তারিত রিপোর্ট (বাংলায়, উৎস সহ)",
  "sources": [
    {
      "id": 1,
      "title": "উৎসের শিরোনাম",
      "url": "উৎসের URL",
      "snippet": "সংক্ষিপ্ত বিবরণ"
    }
  ]
}
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Parse JSON response with better error handling
    try {
      // Clean the response text first
      let cleanedText = text.trim()
      
      // Remove markdown code blocks more aggressively
      cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/g, '')
      cleanedText = cleanedText.replace(/^```json$/gm, '').replace(/^```$/gm, '')
      
      // Find JSON object - look for the first complete JSON object
      const jsonMatch = cleanedText.match(/\{[\s\S]*?\}(?=\s*$|\s*\{)/)
      if (!jsonMatch) {
        // Try alternative approach - find everything between first { and last }
        const firstBrace = cleanedText.indexOf('{')
        const lastBrace = cleanedText.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleanedText = cleanedText.substring(firstBrace, lastBrace + 1)
        } else {
          throw new Error('No JSON object found in final report')
        }
      } else {
        cleanedText = jsonMatch[0]
      }
      
      // Clean up any remaining issues
      cleanedText = cleanedText.trim()
      
      // Try to parse directly without additional escaping
      const parsed = JSON.parse(cleanedText)
      
      // Validate required fields
      if (!parsed.verdict || !parsed.report) {
        throw new Error('Missing required fields in final report')
      }
      
      return parsed
      
    } catch (parseError) {
      console.error('Final report JSON parsing error:', parseError)
      console.error('Raw response:', text)
      
      // Return a fallback response
      return {
        verdict: "misleading",
        confidence: 0,
        claim: "বিশ্লেষণ ব্যর্থ হয়েছে",
        report: "দুঃখিত, এই নিউজ আর্টিকেলের চূড়ান্ত রিপোর্ট তৈরি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
        sources: []
      }
    }
    
  } catch (error) {
    console.error('Final report generation error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }
    
    // Validate URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { 
        status: 400,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }
    
    console.log('Starting news verification v2 for:', url)
    
    // Step 1: Fetch news content
    console.log('Step 1: Fetching news content...')
    const newsContent = await fetchNewsContent(url)
    
    if (!newsContent || !newsContent.content) {
      return NextResponse.json({ 
        error: 'Failed to fetch news content. The website might be blocking requests, have anti-bot protection, or the URL might be invalid. Please try with a different news website or check if the URL is accessible.',
        details: 'This could be due to: 1) Website blocking automated requests, 2) Invalid or broken URL, 3) Network connectivity issues, 4) Website requiring JavaScript to load content'
      }, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }
    
    // Step 2: Analyze with Gemini
    console.log('Step 2: Analyzing with Gemini...')
    const analysis = await analyzeWithGemini(newsContent)
    
    // Step 3: Search with Tavily
    console.log('Step 3: Searching with Tavily...')
    const searchResults = await searchWithTavily(analysis.searchQueries)
    
    // Step 4: Generate final report
    console.log('Step 4: Generating final report...')
    const finalReport = await generateFinalReport(newsContent, analysis, searchResults)
    
    console.log('News verification v2 completed successfully')
    
    return NextResponse.json({
      success: true,
      ...finalReport,
      originalUrl: url,
      scrapedTitle: newsContent.title,
      scrapedDomain: newsContent.domain
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
    
  } catch (error) {
    console.error('News verification v2 error:', error)
    return NextResponse.json({ 
      error: 'News verification failed. Please try again with a different URL.' 
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })
  }
}