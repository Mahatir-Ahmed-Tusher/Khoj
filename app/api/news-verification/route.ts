import { NextRequest, NextResponse } from 'next/server'
import { chromium, firefox, webkit } from 'playwright'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { tavily } from '@tavily/core'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Initialize Tavily
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY_NEWS })

interface ScrapedContent {
  title: string
  content: string
  url: string
  publishedDate?: string
  author?: string
  images?: string[]
}

async function scrapeWithBrowser(url: string, browserType: any): Promise<ScrapedContent | null> {
  const browser = await browserType.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    const page = await context.newPage()
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    
    // Wait for content to load
    await page.waitForTimeout(2000)
    
    // Extract content
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, nav, header, footer, aside')
      scripts.forEach(el => el.remove())
      
      // Get title
      const title = document.querySelector('h1')?.textContent || 
                   document.querySelector('title')?.textContent || 
                   'No title found'
      
      // Get main content
      const mainContent = document.querySelector('main') || 
                         document.querySelector('article') || 
                         document.querySelector('.content') ||
                         document.querySelector('.post-content') ||
                         document.body
      
      // Extract text content
      const textContent = mainContent?.textContent || ''
      
      // Clean up text
      const cleanedText = textContent
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
      
      // Get images
      const images = Array.from(document.querySelectorAll('img'))
        .map(img => img.src)
        .filter(src => src.startsWith('http'))
      
      // Get author
      const author = document.querySelector('[rel="author"]')?.textContent ||
                    document.querySelector('.author')?.textContent ||
                    document.querySelector('.byline')?.textContent ||
                    ''
      
      // Get published date
      const publishedDate = document.querySelector('time')?.getAttribute('datetime') ||
                           document.querySelector('.date')?.textContent ||
                           document.querySelector('.published')?.textContent ||
                           ''
      
      return {
        title: title.trim(),
        content: cleanedText.substring(0, 5000), // Limit content length
        images: images.slice(0, 5), // Limit images
        author: author.trim(),
        publishedDate: publishedDate.trim()
      }
    })
    
    return {
      ...content,
      url
    }
    
  } catch (error) {
    console.error(`Scraping failed with ${browserType.name}:`, error)
    return null
  } finally {
    await browser.close()
  }
}

async function scrapeNewsArticle(url: string): Promise<ScrapedContent | null> {
  const browsers = [chromium, firefox, webkit]
  
  for (const browserType of browsers) {
    try {
      const result = await scrapeWithBrowser(url, browserType)
      if (result && result.content.length > 100) {
        console.log(`Successfully scraped with ${browserType.name}`)
        return result
      }
    } catch (error) {
      console.log(`Failed with ${browserType.name}, trying next...`)
    }
  }
  
  throw new Error('All browsers failed to scrape the content')
}

async function analyzeWithGemini(scrapedContent: ScrapedContent): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const prompt = `
আপনি একজন অভিজ্ঞ ফ্যাক্ট-চেকার। নিচের নিউজ আর্টিকেলটি বিশ্লেষণ করুন এবং এর সত্যতা যাচাই করার জন্য প্রয়োজনীয় সার্চ কোয়েরি তৈরি করুন।

নিউজ আর্টিকেল:
শিরোনাম: ${scrapedContent.title}
বিষয়বস্তু: ${scrapedContent.content.substring(0, 2000)}
লিংক: ${scrapedContent.url}

দয়া করে নিচের ফরম্যাটে উত্তর দিন:
{
  "analysis": "নিউজটির বিষয়বস্তু সম্পর্কে আপনার প্রাথমিক বিশ্লেষণ",
  "searchQueries": [
    "প্রথম সার্চ কোয়েরি",
    "দ্বিতীয় সার্চ কোয়েরি",
    "তৃতীয় সার্চ কোয়েরি"
  ],
  "keyPoints": [
    "প্রধান দাবি ১",
    "প্রধান দাবি ২",
    "প্রধান দাবি ৩"
  ]
}
`
  
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini analysis response length:', text.length)
    console.log('Gemini analysis response preview:', text.substring(0, 500))
    
    // Parse JSON response with robust strategy
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      console.log('JSON match found in analysis, length:', jsonMatch[0].length)
      
      // Clean the response text
      let cleanedText = jsonMatch[0]
        // Remove comments
        .replace(/\/\/.*$/gm, '') 
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix common JSON issues
        .replace(/\s+/g, ' ')
        .trim()
      
      console.log('Cleaned analysis text length:', cleanedText.length)
      console.log('Cleaned analysis text preview:', cleanedText.substring(0, 300))
      
      // Try multiple parsing strategies
      let parsedAnalysis = null
      
      // Strategy 1: Direct parse
      try {
        parsedAnalysis = JSON.parse(cleanedText)
        console.log('Successfully parsed analysis JSON with direct method')
      } catch (error: any) {
        console.log('Direct parse failed for analysis:', error.message)
        console.log('Trying alternative methods for analysis...')
        
        // Strategy 2: Try to fix common issues and parse again
        try {
          let fixedText = cleanedText
            // Fix unescaped quotes in strings
            .replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":')
            // Fix broken quotes
            .replace(/"([^"]*?)\s*"([^"]*?)":/g, '"$1$2":')
            // Remove any remaining problematic characters
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          
          parsedAnalysis = JSON.parse(fixedText)
          console.log('Successfully parsed analysis JSON with fixed method')
        } catch (error2: any) {
          console.log('Fixed parse also failed for analysis:', error2.message)
          console.log('Trying manual reconstruction for analysis...')
          
          // Strategy 3: Manual reconstruction as last resort
          try {
            // Extract key information using regex
            const analysisMatch = cleanedText.match(/"analysis":\s*"([^"]*)"/)
            const searchQueriesMatch = cleanedText.match(/"searchQueries":\s*\[([\s\S]*?)\]/)
            const keyPointsMatch = cleanedText.match(/"keyPoints":\s*\[([\s\S]*?)\]/)
            
            // Extract search queries
            let searchQueries: string[] = []
            if (searchQueriesMatch) {
              const queryMatches = searchQueriesMatch[1].match(/"([^"]*)"/g)
              if (queryMatches) {
                searchQueries = queryMatches.map(q => q.replace(/"/g, ''))
              }
            }
            
            // Extract key points
            let keyPoints: string[] = []
            if (keyPointsMatch) {
              const pointMatches = keyPointsMatch[1].match(/"([^"]*)"/g)
              if (pointMatches) {
                keyPoints = pointMatches.map(p => p.replace(/"/g, ''))
              }
            }
            
            // Create reconstructed object
            parsedAnalysis = {
              analysis: analysisMatch ? analysisMatch[1] : "নিউজটি বিশ্লেষণ করা হয়েছে।",
              searchQueries: searchQueries.length > 0 ? searchQueries : [
                scrapedContent.title,
                `${scrapedContent.title} সত্যতা যাচাই`,
                `${scrapedContent.title} ফ্যাক্ট চেক`
              ],
              keyPoints: keyPoints.length > 0 ? keyPoints : [
                "নিউজের মূল দাবি",
                "তথ্যের সত্যতা",
                "উৎসের নির্ভরযোগ্যতা"
              ]
            }
            
            console.log('Successfully reconstructed analysis JSON manually')
          } catch (error3) {
            console.error('All analysis parsing strategies failed:', error3)
            throw new Error('Failed to parse Gemini analysis response as JSON')
          }
        }
      }
      
      return parsedAnalysis
    }
    
    throw new Error('No JSON found in Gemini analysis response')
  } catch (error) {
    console.error('Gemini analysis failed:', error)
    throw error
  }
}

async function searchWithTavily(queries: string[]): Promise<any[]> {
  const results = []
  
  for (const query of queries) {
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
}

async function generateFinalReport(scrapedContent: ScrapedContent, analysis: any, searchResults: any[]): Promise<any> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  
  const prompt = `
আপনি একজন অভিজ্ঞ ফ্যাক্ট-চেকার। নিচের তথ্যগুলো বিশ্লেষণ করে একটি পেশাদার ফ্যাক্ট-চেকিং রিপোর্ট তৈরি করুন।

মূল নিউজ:
শিরোনাম: ${scrapedContent.title}
বিষয়বস্তু: ${scrapedContent.content.substring(0, 1500)}
লিংক: ${scrapedContent.url}

প্রাথমিক বিশ্লেষণ: ${analysis.analysis}

প্রধান দাবিসমূহ: ${analysis.keyPoints.join(', ')}

ফ্যাক্ট-চেকিং উৎসসমূহ:
${searchResults.map((result, index) => `
[${index + 1}] ${result.title}
লিংক: ${result.url}
সারসংক্ষেপ: ${result.content}
প্রকাশনার তারিখ: ${result.published_date || 'অজানা'}
ডোমেইন: ${result.url ? new URL(result.url).hostname : 'অজানা'}
`).join('\n')}

নিচের নির্দেশনা অনুসরণ করে একটি পেশাদার ফ্যাক্ট-চেকিং রিপোর্ট তৈরি করুন:

1. প্রতিটি দাবি আলাদাভাবে বিশ্লেষণ করুন
2. প্রতিটি উৎসকে [1], [2], [3] এভাবে cite করুন
3. প্রতিটি দাবির জন্য স্পষ্টভাবে বলুন কোন উৎসে কি বলা হয়েছে
4. প্রতিটি উৎসের মতামত আমাদের মূল নিউজের পক্ষে নাকি বিপক্ষে তা স্পষ্ট করুন
5. উৎসের নির্ভরযোগ্যতা মূল্যায়ন করুন
6. সামগ্রিক সিদ্ধান্তে পৌঁছান

বিশেষ নির্দেশনা:
- প্রতিটি দাবির জন্য আলাদা অনুচ্ছেদ তৈরি করুন
- প্রতিটি উৎসের মতামতের জন্য স্পষ্ট citation দিন
- উৎসের নির্ভরযোগ্যতা সম্পর্কে মন্তব্য করুন
- কোন উৎসে কি বলা হয়েছে তার স্পষ্ট উল্লেখ করুন

নিচের ফরম্যাটে কেবলমাত্র JSON উত্তর দিন। কোনো কমেন্ট বা অতিরিক্ত টেক্সট যোগ করবেন না। URLs সম্পূর্ণ এবং সঠিকভাবে quoted থাকতে হবে। প্রতিটি string value সম্পূর্ণভাবে quoted থাকতে হবে:

{
  "verdict": "true",
  "confidence": 85,
  "claim": "খবরের মূল দাবি",
  "report": "বিস্তারিত বিশ্লেষণ রিপোর্ট যেখানে প্রতিটি দাবি আলাদাভাবে বিশ্লেষণ করা হয়েছে, কোন উৎসে কি বলা হয়েছে তার স্পষ্ট উল্লেখ আছে, এবং উৎসসমূহ [1], [2], [3] এভাবে cite করা হয়েছে। প্রতিটি দাবির জন্য আলাদা অনুচ্ছেদ এবং উৎসের মতামতের স্পষ্ট বিশ্লেষণ থাকবে।",
  "sources": [
    {
      "id": 1,
      "title": "উৎসের শিরোনাম",
      "url": "উৎসের লিংক",
      "snippet": "সংক্ষিপ্ত বিবরণ",
      "domain": "উৎসের ডোমেইন",
      "publishedDate": "প্রকাশনার তারিখ",
      "reliability": "উৎসের নির্ভরযোগ্যতা মূল্যায়ন"
    }
  ],
  "sourceInfo": {
    "hasBengaliSources": true,
    "hasEnglishSources": false,
    "totalSources": 1
  }
}
`
  
  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Raw Gemini response length:', text.length)
    console.log('Raw Gemini response preview:', text.substring(0, 1000))
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      console.log('JSON match found, length:', jsonMatch[0].length)
      
      // More robust JSON cleaning
      let cleanedText = jsonMatch[0]
        // Remove comments
        .replace(/\/\/.*$/gm, '') 
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix common JSON issues
        .replace(/\s+/g, ' ')
        .trim()
      
      console.log('Cleaned text length:', cleanedText.length)
      console.log('Cleaned text preview:', cleanedText.substring(0, 500))
      
      // Try multiple parsing strategies
      let parsedReport = null
      
      // Strategy 1: Direct parse
      try {
        parsedReport = JSON.parse(cleanedText)
        console.log('Successfully parsed JSON with direct method')
      } catch (error: any) {
        console.log('Direct parse failed:', error.message)
        console.log('Trying alternative methods...')
        
        // Strategy 2: Try to fix common issues and parse again
        try {
          let fixedText = cleanedText
            // Fix unescaped quotes in strings
            .replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":')
            // Fix malformed URLs
            .replace(/"url":\s*"([^"]*?)\s*"/g, '"url": "$1"')
            // Fix broken quotes
            .replace(/"([^"]*?)\s*"([^"]*?)":/g, '"$1$2":')
            // Remove any remaining problematic characters
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          
          parsedReport = JSON.parse(fixedText)
          console.log('Successfully parsed JSON with fixed method')
        } catch (error2: any) {
          console.log('Fixed parse also failed:', error2.message)
          console.log('Trying manual reconstruction...')
          
          // Strategy 3: Manual reconstruction as last resort
          try {
            // Extract key information using regex
            const verdictMatch = cleanedText.match(/"verdict":\s*"([^"]*)"/)
            const confidenceMatch = cleanedText.match(/"confidence":\s*(\d+)/)
            const claimMatch = cleanedText.match(/"claim":\s*"([^"]*)"/)
            const reportMatch = cleanedText.match(/"report":\s*"([^"]*)"/)
            
            // Extract sources using a more flexible approach
            const sourcesMatch = cleanedText.match(/"sources":\s*\[([\s\S]*?)\]/)
            let sources: any[] = []
            
            if (sourcesMatch) {
              // Try to extract individual source objects
              const sourceMatches = sourcesMatch[1].match(/\{[^}]*\}/g)
              if (sourceMatches) {
                sources = sourceMatches.map((source, index) => {
                  const titleMatch = source.match(/"title":\s*"([^"]*)"/)
                  const urlMatch = source.match(/"url":\s*"([^"]*)"/)
                  const snippetMatch = source.match(/"snippet":\s*"([^"]*)"/)
                  const domainMatch = source.match(/"domain":\s*"([^"]*)"/)
                  const publishedDateMatch = source.match(/"publishedDate":\s*"([^"]*)"/)
                  const reliabilityMatch = source.match(/"reliability":\s*"([^"]*)"/)
        
        return {
                    id: index + 1,
                    title: titleMatch ? titleMatch[1] : `উৎস ${index + 1}`,
                    url: urlMatch ? urlMatch[1] : "#",
                    snippet: snippetMatch ? snippetMatch[1] : "সংক্ষিপ্ত বিবরণ",
                    domain: domainMatch ? domainMatch[1] : "অজানা",
                    publishedDate: publishedDateMatch ? publishedDateMatch[1] : "অজানা",
                    reliability: reliabilityMatch ? reliabilityMatch[1] : "মূল্যায়ন করা হয়নি"
                  }
                })
              }
            }
            
            // Create reconstructed object
            parsedReport = {
              verdict: verdictMatch ? verdictMatch[1] : "misleading",
              confidence: confidenceMatch ? parseInt(confidenceMatch[1]) : 50,
              claim: claimMatch ? claimMatch[1] : scrapedContent.title,
              report: reportMatch ? reportMatch[1] : "এই নিউজটি যাচাই করা হয়েছে।",
              sources: sources.length > 0 ? sources : searchResults.slice(0, 3).map((result, index) => ({
              id: index + 1,
                title: result.title || `উৎস ${index + 1}`,
              url: result.url || "#",
                snippet: result.content || "সংক্ষিপ্ত বিবরণ",
                domain: result.url ? new URL(result.url).hostname : "অজানা",
                publishedDate: result.published_date || "অজানা",
                reliability: "মূল্যায়ন করা হয়নি"
            })),
            sourceInfo: {
              hasBengaliSources: true,
              hasEnglishSources: true,
                totalSources: sources.length || searchResults.length
              }
            }
            
            console.log('Successfully reconstructed JSON manually')
          } catch (error3) {
            console.error('All parsing strategies failed:', error3)
          throw new Error('Failed to parse Gemini response as JSON')
        }
        }
      }
      
      // Add source IDs to sources array if not already present
      const sourcesWithIds = parsedReport.sources ? parsedReport.sources.map((source: any, index: number) => ({
        ...source,
        id: source.id || index + 1,
        domain: source.domain || (source.url ? new URL(source.url).hostname : "অজানা"),
        publishedDate: source.publishedDate || "অজানা",
        reliability: source.reliability || "মূল্যায়ন করা হয়নি"
      })) : []
      
      return {
        ...parsedReport,
        sources: sourcesWithIds,
        generatedAt: new Date().toISOString()
      }
    }
    
    throw new Error('No JSON found in Gemini response')
  } catch (error) {
    console.error('Final report generation failed:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  // This API is deprecated - redirect to v2
  return NextResponse.json({ 
    error: 'This API is deprecated. Please use /api/news-verification-v2 instead.',
    redirect: '/api/news-verification-v2'
  }, { status: 410 })
}
