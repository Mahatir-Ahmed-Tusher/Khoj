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
    
    // Use fetch instead of browser automation for better Vercel compatibility
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // Add timeout
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    })

    if (!response.ok) {
      console.log(`HTTP error: ${response.status}`)
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
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

**প্রদান করুন (JSON ফরম্যাটে):**
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
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse Gemini response')
    
  } catch (error) {
    console.error('Gemini analysis error:', error)
    throw error
  }
}

async function searchWithTavily(searchQueries: string[]): Promise<any[]> {
  try {
    const searchPromises = searchQueries.slice(0, 3).map(async (query) => {
      const searchResult = await tavilyClient.search({
        query: query,
        search_depth: "basic",
        max_results: 5,
        include_answer: false,
        include_raw_content: false,
        include_images: false
      })
      
      return {
        query,
        results: searchResult.results || []
      }
    })
    
    const searchResults = await Promise.all(searchPromises)
    return searchResults.flatMap(sr => sr.results)
    
  } catch (error) {
    console.error('Tavily search error:', error)
    return []
  }
}

async function generateFinalReport(newsContent: NewsAnalysis, analysis: any, searchResults: any[]): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
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

**প্রদান করুন (JSON ফরম্যাটে):**
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
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse final report')
    
  } catch (error) {
    console.error('Final report generation error:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }
    
    // Validate URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }
    
    console.log('Starting news verification v2 for:', url)
    
    // Step 1: Fetch news content
    console.log('Step 1: Fetching news content...')
    const newsContent = await fetchNewsContent(url)
    
    if (!newsContent || !newsContent.content) {
      return NextResponse.json({ 
        error: 'Failed to fetch news content. The website might be blocking requests or the URL might be invalid.' 
      }, { status: 500 })
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
    })
    
  } catch (error) {
    console.error('News verification v2 error:', error)
    return NextResponse.json({ 
      error: 'News verification failed. Please try again with a different URL.' 
    }, { status: 500 })
  }
}
