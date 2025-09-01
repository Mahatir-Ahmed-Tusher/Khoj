# Node.js Implementation Example

এই সিস্টেমটি Node.js দিয়ে বাস্তবায়ন করার জন্য নিম্নলিখিত কোড ব্যবহার করুন:

## package.json Dependencies

```json
{
  "dependencies": {
    "node-fetch": "^3.3.2",
    "cheerio": "^1.0.0-rc.12",
    "jsdom": "^23.0.1",
    "p-queue": "^7.4.1",
    "playwright": "^1.40.0"
  }
}
```

## Main Implementation

```javascript
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
import PQueue from 'p-queue'

// ALLOWED_SITES configuration
const ALLOWED_SITES = [
  // Bengali Fact-Checking Websites (HIGHEST PRIORITY)
  "rumorscanner.com",
  "fact-watch.org", 
  "boombangladesh.com",
  "factcheck.afp.com",
  "bssnews.net",
  "jachai.org",
  "bdfactcheck.com",
  "dismislab.com",
  "bangla.altnews.in",
  "bangla.factcrescendo.com",
  "bangla.vishvasnews.com",
  
  // Bangladeshi Mainstream News Sites
  "prothomalo.com",
  "bd-pratidin.com",
  "jugantor.com",
  "kalerkantho.com",
  "samakal.com",
  "thedailystar.net",
  "bdnews24.com",
  "dhakatribune.com",
  "thefinancialexpress.com.bd",
  "newagebd.net",
  "daily-sun.com",
  "theindependentbd.com",
  "bangladeshpost.net",
  "observerbd.com",
  "banglanews24.com",
  "banglatribune.com",
  "dhakapost.com",
  "risingbd.com",
  "barta24.com",
  "dhakatimes24.com",
  "somoynews.tv",
  "jamuna.tv",
  "independent24.com",
  "channel24bd.tv",
  "dbcnews.tv",
  "ntvbd.com",
  "rtvonline.com",
  "mzamin.com",
  "sangbad.net.bd",
  "jaijaidinbd.com",
  "bhorerkagoj.com",
  "dailyinqilab.com",
  "nayadiganta.com",
  "dainikazadi.net",
  "purbokone.net",
  "sylhetexpress.com",
  "khulnatimes.com",
  "amaderbarisal.com",
  "rajshahinews24.com",
  
  // International Sources
  "snopes.com",
  "politifact.com",
  "factcheck.org",
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "fullfact.org",
  "washingtonpost.com",
  "bellingcat.com",
  "euvsdisinfo.eu",
  
  // Science & Health
  "healthfeedback.org",
  "sciencefeedback.co",
  "nasa.gov",
  "skepticalinquirer.org",
  "quackwatch.org",
  "sciencebee.com.bd",
  "bijnan-o-bijnani.co.in",
  "bigganblog.org",
  "boomlive.in",
  "thequint.com",
  "altnews.in",
  "vishvasnews.com",
  "newschecker.in",
  "cdc.gov",
  "who.int",
  "mayo.edu",
  "sciencenews.org",
  "livescience.com",
  "nationalgeographic.com",
  "theconversation.com",
  "factmyth.com",
  "leadstories.com",
  "checkyourfact.com"
]

// Helper functions
const normalizeUrl = (url) => {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.origin + urlObj.pathname.replace(/\/+$/, '')
  } catch {
    return url
  }
}

const extractDomain = (url) => {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname
  } catch {
    return url
  }
}

const isAllowedSite = (url) => {
  const domain = extractDomain(url)
  return ALLOWED_SITES.some(site => domain.includes(site))
}

// Fetch HTML with timeout
async function fetchHTML(url, timeoutMs = 10000) {
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

// Extract main content from HTML
function extractMainContent(html, url) {
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

// Calculate relevance score
function calculateRelevanceScore(content, query) {
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

// Find search candidates from a domain
async function findSearchCandidates(domain, query) {
  const candidates = new Set()
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
async function gatherFromAllowedSites(query) {
  const results = []
  const processedUrls = new Set()
  
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

// Fallback function using Tavily API
async function tavilyFallback(query) {
  try {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) return []
    
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { 
        "content-type": "application/json", 
        "authorization": `Bearer ${apiKey}` 
      },
      body: JSON.stringify({ 
        query, 
        search_depth: "advanced", 
        max_results: 10 
      })
    })
    
    if (!response.ok) return []
    
    const data = await response.json()
    
    // Map to our schema
    return (data.results || []).map(r => ({
      url: r.url,
      domain: extractDomain(r.url),
      title: r.title || 'No title',
      published: r.published_date || null,
      author: null,
      relevance_score: r.score || 0.5,
      excerpt: (r.snippet || r.content || '').substring(0, 200) + '...',
      source: 'tavily_fallback'
    }))
  } catch (error) {
    console.error('Tavily fallback error:', error)
    return []
  }
}

// Main fact checking function
async function performFactCheck(query) {
  console.log(`🚀 Starting domain-first fact check for: "${query}"`)

  // Step 1: Search in ALLOWED_SITES first
  const allowedSitesResults = await gatherFromAllowedSites(query)
  console.log(`✅ Found ${allowedSitesResults.length} results from allowed sites`)

  let finalResults = allowedSitesResults
  let usedTavily = false
  let status = 'success'
  const notes = []

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
  finalResults.sort((a, b) => b.relevance_score - a.relevance_score)
  const topResults = finalResults.slice(0, 12)

  console.log(`📊 Final results: ${topResults.length} sources (${usedTavily ? 'with Tavily' : 'allowed sites only'})`)

  // Step 3: Generate report with AI (example prompt)
  const aiPrompt = `
**ফ্যাক্ট চেকিং অনুরোধ:**
দাবি: ${query}

**উপলব্ধ উৎসসমূহ (${topResults.length}টি):**
${topResults.map((result, index) => `
**উৎস ${index + 1}** (${result.source === 'allowed_sites' ? 'নির্দিষ্ট সাইট' : 'Tavily API'}):
শিরোনাম: ${result.title}
ডোমেইন: ${result.domain}
URL: ${result.url}
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
- ইংরেজি উৎস থেকে তথ্য বাংলায় অনুবাদ করুন
- প্রতিটি দাবির জন্য বিস্তারিত বিশ্লেষণ দিন
- আত্মবিশ্বাসের মাত্রা (০-১০০%) উল্লেখ করুন
- যদি Tavily API ব্যবহার করা হয়ে থাকে, তাহলে সেটা স্পষ্টভাবে উল্লেখ করুন
- **মহত্বপূর্ণ:** আপনি নিজে থেকে "উৎসের তালিকা" বা "উৎসসমূহ" সেকশন তৈরি করবেন না। শুধু উপরে দেওয়া উৎসসমূহ ব্যবহার করে রিপোর্ট লিখুন।
- রিপোর্টের শেষে আলাদা উৎস তালিকা দেবার প্রয়োজন নেই।
`

  return {
    status,
    used_tavily: usedTavily,
    selected_urls: topResults,
    notes,
    claim: query,
    ai_prompt: aiPrompt, // AI prompt for external processing
    searchStats: {
      totalSitesSearched: ALLOWED_SITES.length,
      totalResultsFound: finalResults.length,
      allowedSitesResults: allowedSitesResults.length,
      tavilyResults: usedTavily ? finalResults.length - allowedSitesResults.length : 0
    },
    generatedAt: new Date().toISOString()
  }
}

// Usage example
async function main() {
  const query = "বাংলাদেশে করোনা ভাইরাসের নতুন ভ্যারিয়েন্ট"
  
  try {
    const result = await performFactCheck(query)
    console.log('Fact check result:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error:', error)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { performFactCheck, ALLOWED_SITES }
