import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { tavilyManager } from "@/lib/tavily-manager";
import puppeteer from "puppeteer";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Initialize Tavily Manager (same as main fact checker)
const tavilyClient = tavilyManager;

interface NewsAnalysis {
  title: string;
  content: string;
  url: string;
  author?: string;
  publishedDate?: string;
  domain: string;
}
type Data = {
  title?: string;
  error?: string;
};

async function puppeteerScrapper(
  url: string
): Promise<NewsAnalysis | null> {
  console.log("[PuppeteerScrapper] Function entered.");
  console.log(`[PuppeteerScrapper] Attempting to scrape URL: ${url}`);
  let browser: any = null;

  try {
    if (!url) {
      console.error("[PuppeteerScrapper] URL is undefined or null.");
      return null;
    }

    // Validate URL format (more flexible for long URLs)
    try {
      new URL(url);
    } catch (error) {
      console.error(`[PuppeteerScrapper] Invalid URL format: ${url}`, error);
      return null;
    }

    console.log("[PuppeteerScrapper] Launching browser...");
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("[PuppeteerScrapper] Browser launched.");

    const page = await browser.newPage();
    console.log(`[PuppeteerScrapper] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Increased timeout to 60 seconds
    console.log(`[PuppeteerScrapper] Navigation to ${url} complete.`);

    const newsAnalysis = await page.evaluate(() => {
      const extractText = (el: Element | null) =>
        el ? el.textContent?.trim() : null;
      const extractAttribute = (el: Element | null, attr: string) =>
        el ? el.getAttribute(attr) : null;

      let title =
        document.querySelector("h1")?.textContent?.trim() ||
        document
          .querySelector('meta[property="og:title"]')
          ?.getAttribute("content") ||
        document
          .querySelector('meta[name="twitter:title"]')
          ?.getAttribute("content") ||
        document.title;
      console.log(`[PuppeteerScrapper] Scraped title: ${title}`);

      let content = "";
      const paragraphs = Array.from(document.querySelectorAll("p"));
      content = paragraphs
        .map((p) => p.textContent?.trim())
        .filter(Boolean)
        .join("\n");
      console.log(
        `[PuppeteerScrapper] Scraped content length: ${content.length}`
      );

      // Fallback for content if paragraphs are not enough
      if (content.length < 200) {
        // Arbitrary threshold to check if content is too short
        const articleBody =
          document.querySelector("article") ||
          document.querySelector("main") ||
          document.body;
        content = articleBody?.textContent?.trim() || "";
        // Clean up content by removing excessive newlines and spaces
        content = content
          .replace(/\n\s*\n/g, "\n")
          .replace(/\s{2,}/g, " ")
          .trim();
        console.log(
          `[PuppeteerScrapper] Fallback content length: ${content.length}`
        );
      }

      let author =
        extractAttribute(
          document.querySelector('meta[name="author"]'),
          "content"
        ) ||
        extractAttribute(
          document.querySelector('meta[property="article:author"]'),
          "content"
        ) ||
        extractText(document.querySelector(".byline")) ||
        extractText(document.querySelector(".author")) ||
        extractText(document.querySelector('[itemprop="author"]'));
      console.log(`[PuppeteerScrapper] Scraped author: ${author}`);

      let publishedDate =
        extractAttribute(
          document.querySelector('meta[property="article:published_time"]'),
          "content"
        ) ||
        extractAttribute(
          document.querySelector('meta[name="pubdate"]'),
          "content"
        ) ||
        extractAttribute(
          document.querySelector('meta[name="publishdate"]'),
          "content"
        ) ||
        extractAttribute(
          document.querySelector('meta[itemprop="datePublished"]'),
          "content"
        ) ||
        extractText(document.querySelector("time")) ||
        extractText(document.querySelector(".date"));
      console.log(
        `[PuppeteerScrapper] Scraped publishedDate: ${publishedDate}`
      );

      const domain = window.location.hostname;
      console.log(`[PuppeteerScrapper] Scraped domain: ${domain}`);

      return { title, content, author, publishedDate, domain };
    });

    console.log("[PuppeteerScrapper] Scraped data:", newsAnalysis);
    return newsAnalysis;
  } catch (error) {
    console.error(`[PuppeteerScrapper] Error scraping ${url}:`, error);
    return null;
  } finally {
    if (browser) {
      console.log("[PuppeteerScrapper] Closing browser...");
      await browser.close();
      console.log("[PuppeteerScrapper] Browser closed.");
    }
  }
}

async function fetchNewsContent(url: string): Promise<NewsAnalysis | null> {
  try {
    console.log("Fetching news content for:", url);

    // First try with Puppeteer as primary method
    console.log("Trying Puppeteer web scraping as primary method...");
    try {
      const puppeteerResult = await puppeteerScrapper(url);
      if (puppeteerResult) {
        console.log("Successfully scraped with Puppeteer");
        return puppeteerResult;
      }
    } catch (puppeteerError) {
      console.log("Puppeteer primary method failed:", puppeteerError);
    }

    // If Puppeteer fails, try with multiple user agents as fallback
    console.log("Trying fetch with multiple user agents as fallback...");

    // Try multiple user agents and approaches to bypass 403 errors
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/121.0",
    ];

    let response: Response | null = null;
    let lastError: any = null;

    // Try with different user agents
    for (const userAgent of userAgents) {
      try {
        response = await fetch(url, {
          headers: {
            "User-Agent": userAgent,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US,en;q=0.9,bn;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Cache-Control": "max-age=0",
            DNT: "1",
            "Sec-CH-UA":
              '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            "Sec-CH-UA-Mobile": "?0",
            "Sec-CH-UA-Platform": '"Windows"',
          },
          // Add timeout
          signal: AbortSignal.timeout(20000), // 20 seconds timeout
        });

        if (response.ok) {
          break; // Success, exit the loop
        } else {
          console.log(
            `HTTP error ${response.status} with User-Agent: ${userAgent.substring(0, 50)}...`
          );
          lastError = new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.log(
          `Fetch failed with User-Agent: ${userAgent.substring(0, 50)}...`,
          error
        );
        lastError = error;
        continue;
      }
    }

    if (!response || !response.ok) {
      console.log(`All fetch attempts failed. Last error:`, lastError);

      // If both Puppeteer and fetch fail, try Tavily as a last resort
      console.log("Trying Tavily web scraping as last resort...");
      try {
        const tavilyResponse = await tavilyClient.search(url, {
          max_results: 1,
          include_domains: [],
          exclude_domains: [],
          search_depth: "advanced",
        });

        if (tavilyResponse.results && tavilyResponse.results.length > 0) {
          const result = tavilyResponse.results[0];
          const urlObj = new URL(url);

          return {
            title: result.title || "No title found",
            content: result.content || "No content available",
            url: url,
            author: "",
            publishedDate: "",
            domain: urlObj.hostname,
          };
        }
      } catch (tavilyError) {
        console.log("Tavily fallback also failed:", tavilyError);
      }

      return null;
    }

    const html = await response.text();

    // Simple HTML parsing without browser automation
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "No title found";

    // Extract main content using regex patterns
    const contentPatterns = [
      /<article[^>]*>([\s\S]*?)<\/article>/i,
      /<main[^>]*>([\s\S]*?)<\/main>/i,
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      /<div[^>]*class="[^"]*article[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    ];

    let content = "";
    for (const pattern of contentPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        content = match[1];
        break;
      }
    }

    // If no specific content found, extract from body
    if (!content) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      content = bodyMatch ? bodyMatch[1] : html;
    }

    // Clean HTML tags and extract text
    const textContent = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 5000); // Limit content length

    // Extract author
    const authorPatterns = [
      /<meta[^>]*name="author"[^>]*content="([^"]+)"/i,
      /<span[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/span>/i,
      /<div[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/div>/i,
    ];

    let author = "";
    for (const pattern of authorPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        author = match[1].trim();
        break;
      }
    }

    // Extract published date
    const datePatterns = [
      /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i,
      /<time[^>]*datetime="([^"]+)"/i,
      /<meta[^>]*name="pubdate"[^>]*content="([^"]+)"/i,
    ];

    let publishedDate = "";
    for (const pattern of datePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        publishedDate = match[1].trim();
        break;
      }
    }

    // Extract domain
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    return {
      title,
      content: textContent,
      url,
      author,
      publishedDate,
      domain,
    };
  } catch (error) {
    console.error("Error fetching news content:", error);
    return null;
  }
}

// Helper function to create model-specific prompts (same as main fact checker)
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

**CRITICAL TEMPORAL CONTEXT:**
Current Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (October 27, 2025)
- We are currently in October 2025
- Any event in August 2025, September 2025, or October 2025 is RECENT PAST or CURRENT
- Do NOT refer to any 2025 events as "future" - they are PAST or PRESENT
- Only events beyond October 2025 are in the future

You are an experienced journalist and fact-checker. Create a detailed, human-friendly, and comprehensive report to verify the following claim:

**Main Claim:** ${query}

**Your Task:**
1. Collect information from available sources
2. Verify the credibility of each source
3. Find consistency in the information
4. Make a clear decision
5. never use any social media resource as a reference (facebook, twitter, instagram, etc.)

**Report Structure:**

# Claim
[Write the main claim clearly]

# Verdict
[Write clearly: সত্য/মিথ্যা/ভ্রান্ত তথ্য/অযাচাইকৃত - Choose ONE and explain briefly]

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
- **CRITICAL - Current Date Context:** Today's date is ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. This is NOT the future - this is the CURRENT date. Any dates in 2025 or earlier are in the PAST or PRESENT. Do NOT say any event in 2025 is "in the future" - we are currently in 2025.
- **TEMPORAL LANGUAGE RESTRICTION:** NEVER use phrases like "ভবিষ্যতের খবর" (future news), "ভবিষ্যত সম্পর্কে" (about future), "এটি ভবিষ্যতের" (this is future), or any variation suggesting 2025 events are in the future. August 2025, September 2025, October 2025 are all PAST or PRESENT, not future, you don't have to mention about any date incompatibality of any news.
- **VERDICT CLARITY:** In the Verdict section, clearly state ONE of: "সত্য" (True), "মিথ্যা" (False), "ভ্রান্ত তথ্য" (Misleading), or "অযাচাইকৃত" (Unverified). Be explicit and unambiguous.

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

  return basePrompt;
}

// Helper function to generate AI report with three-tier fallback: Gemini → GROQ → DeepSeek (same as main fact checker)
async function generateAIReport(query: string, crawledContent: any[], maxRetries: number = 3): Promise<string> {
  // Step 1: Try Gemini first (gemini-2.5-flash)
  console.log('🤖 Trying Gemini (gemini-2.5-flash) first...')
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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
    
    const { Groq } = await import('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
    
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
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    // Validate URL with more flexible pattern for long URLs
    try {
      new URL(url);
      console.log(`✅ URL validation passed. Length: ${url.length}`);
    } catch (error) {
      console.error(`❌ URL validation failed. URL: ${url.substring(0, 100)}... Length: ${url.length}`, error);
      return NextResponse.json(
        { error: "Invalid URL format. Please provide a valid news article URL." },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    console.log("Starting news verification v2 for:", url);

    // Step 1: Fetch news content
    console.log("Step 1: Fetching news content...");
    const newsContent = await fetchNewsContent(url);

    if (!newsContent || !newsContent.content) {
      return NextResponse.json(
        {
          error:
            "Failed to fetch news content. The website might be blocking requests, have anti-bot protection, or the URL might be invalid. Please try with a different news website or check if the URL is accessible.",
          details:
            "This could be due to: 1) Website blocking automated requests, 2) Invalid or broken URL, 3) Network connectivity issues, 4) Website requiring JavaScript to load content",
        },
        {
          status: 500,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    // Step 2: Search for additional sources using Tavily (same as main fact checker)
    console.log("Step 2: Searching for additional sources...");
    
    // Create search query from news content
    const searchQuery = `${newsContent.title} ${newsContent.content.substring(0, 200)}`;
    
    // Search within Bangladeshi news sites first
    const bangladeshiNewsSites = [
      'https://www.prothomalo.com',
      'https://www.bd-pratidin.com', 
      'https://www.jugantor.com',
      'https://www.kalerkantho.com',
      'https://www.samakal.com',
      'https://www.thedailystar.net',
      'https://www.bdnews24.com',
      'https://www.dhakatribune.com'
    ];

    let searchResults: any = { results: [] };
    let hasBengaliSources = false;
    let hasEnglishSources = false;

    // Step 1: Search within Bangladeshi news sites for Bengali content
    try {
      const bangladeshiResults = await tavilyClient.search(searchQuery, {
        sites: bangladeshiNewsSites,
        max_results: 11,
        search_depth: "advanced"
      });
      
      if (bangladeshiResults.results && bangladeshiResults.results.length > 0) {
        searchResults.results = bangladeshiResults.results;
        hasBengaliSources = true;
        console.log(`✅ Found ${bangladeshiResults.results.length} Bengali sources`);
      }
    } catch (error) {
      console.error('Failed to search Bangladeshi sites:', error);
    }

    // Step 2: If insufficient Bengali sources, search for English sources
    if (!hasBengaliSources || searchResults.results.length < 3) {
      try {
        console.log('🔍 Searching for English sources...');
        const englishResults = await tavilyClient.search(searchQuery, {
          max_results: 11,
          search_depth: "advanced",
          include_domains: [
            'reuters.com', 'bbc.com', 'cnn.com', 'ap.org', 'factcheck.org',
            'snopes.com', 'politifact.com', 'who.int', 'un.org', 'worldbank.org'
          ]
        });
        
        if (englishResults.results && englishResults.results.length > 0) {
          // If we have Bengali sources, append English sources
          if (hasBengaliSources) {
            searchResults.results = [...searchResults.results, ...englishResults.results.slice(0, 5)];
          } else {
            searchResults.results = englishResults.results;
          }
          hasEnglishSources = true;
          console.log(`✅ Found ${englishResults.results.length} English sources`);
        }
      } catch (error) {
        console.error('Failed to search English sources:', error);
      }
    }

    // Step 3: If still no results, try general search
    if (!searchResults.results || searchResults.results.length === 0) {
      try {
        console.log('🔍 Trying general search...');
        const generalResults = await tavilyClient.search(searchQuery, {
          max_results: 11,
          search_depth: "advanced"
        });
        
        if (generalResults.results) {
          searchResults.results = generalResults.results;
          console.log(`✅ Found ${generalResults.results.length} general sources`);
        }
      } catch (error) {
        console.error('Failed to search general web:', error);
      }
    }

    // Step 3: Prepare crawled content (same format as main fact checker)
    const crawledContent = searchResults.results?.slice(0, 11).map((result: any, index: number) => ({
      title: result.title,
      url: result.url,
      content: (result as any).content || (result as any).snippet || 'Content not available',
      isEnglish: !hasBengaliSources || (hasEnglishSources && index >= searchResults.results.length - 3)
    })) || [];

    // Add the original news content as the first source
    crawledContent.unshift({
      title: newsContent.title,
      url: newsContent.url,
      content: newsContent.content,
      isEnglish: false // Assume Bengali news
    });

    // Step 4: Generate comprehensive report using the same method as main fact checker
    console.log("Step 4: Generating comprehensive report...");
    const report = await generateAIReport(newsContent.title, crawledContent);
    
    // Add fallback content if AI failed
    const finalReport = report === 'AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।' 
      ? `
## দাবি
${newsContent.title}

## সিদ্ধান্ত
অযাচাইকৃত

## বিস্তারিত বিশ্লেষণ

**প্রাথমিক তথ্য সংগ্রহ:**
আমরা এই নিউজ আর্টিকেলটি যাচাই করার জন্য ${crawledContent.length} টি উৎস পর্যালোচনা করেছি। আমাদের গবেষণায় নিম্নলিখিত উৎসসমূহ অন্তর্ভুক্ত ছিল:

${crawledContent.map((item: any, index: number) => `- ${item.title} (${item.isEnglish ? 'ইংরেজি উৎস' : 'বাংলা উৎস'})`).join('\n')}

**তথ্যের বিশ্লেষণ:**
তবে দুর্ভাগ্যবশত, AI সিস্টেমে সাময়িক সমস্যার কারণে আমরা এই উৎসসমূহ থেকে প্রাপ্ত তথ্যের বিস্তারিত বিশ্লেষণ করতে পারছি না।

**যুক্তি ও প্রমাণ:**
বর্তমানে আমরা যে তথ্যগুলি সংগ্রহ করতে পেরেছি, সেগুলি যথেষ্ট নয় এই নিউজ আর্টিকেলের সত্যতা যাচাই করার জন্য।

## সতর্কতা ও সীমাবদ্ধতা
- AI সিস্টেমে সাময়িক সমস্যা রয়েছে
- আরও গবেষণার প্রয়োজন
- এই নিউজ আর্টিকেলটি আরও যাচাই করা প্রয়োজন

## উপসংহার
এই নিউজ আর্টিকেল সম্পর্কে এখনই কোন সিদ্ধান্তে পৌঁছানো সম্ভব নয়। আমরা পাঠকদের পরামর্শ দিচ্ছি যে তারা এই বিষয়ে আরও তথ্য সংগ্রহ করুন এবং বিশ্বাসযোগ্য উৎস থেকে যাচাই করে নিন।

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
      `
      : report;

    // Determine verdict from report content (improved logic)
    const getVerdictFromReport = (reportText: string): 'true' | 'false' | 'misleading' | 'unverified' => {
      const lowerText = reportText.toLowerCase();
      
      // Look for explicit verdict statements first
      if (lowerText.includes('# সিদ্ধান্ত') || lowerText.includes('# verdict')) {
        const verdictSection = lowerText.split('# সিদ্ধান্ত')[1]?.split('#')[0] || 
                              lowerText.split('# verdict')[1]?.split('#')[0] || '';
        
        if (verdictSection.includes('সত্য') || verdictSection.includes('true') || 
            verdictSection.includes('সঠিক') || verdictSection.includes('correct')) {
          return 'true';
        } else if (verdictSection.includes('মিথ্যা') || verdictSection.includes('false') || 
                   verdictSection.includes('ভুল') || verdictSection.includes('incorrect')) {
          return 'false';
        } else if (verdictSection.includes('ভ্রান্ত') || verdictSection.includes('misleading') || 
                   verdictSection.includes('প্ররোচক') || verdictSection.includes('deceptive')) {
          return 'misleading';
        }
      }
      
      // Look for conclusion statements
      if (lowerText.includes('# উপসংহার') || lowerText.includes('# conclusion')) {
        const conclusionSection = lowerText.split('# উপসংহার')[1]?.split('#')[0] || 
                                 lowerText.split('# conclusion')[1]?.split('#')[0] || '';
        
        if (conclusionSection.includes('সত্য') || conclusionSection.includes('true') || 
            conclusionSection.includes('সঠিক') || conclusionSection.includes('correct')) {
          return 'true';
        } else if (conclusionSection.includes('মিথ্যা') || conclusionSection.includes('false') || 
                   conclusionSection.includes('ভুল') || conclusionSection.includes('incorrect')) {
          return 'false';
        } else if (conclusionSection.includes('ভ্রান্ত') || conclusionSection.includes('misleading') || 
                   conclusionSection.includes('প্ররোচক') || conclusionSection.includes('deceptive')) {
          return 'misleading';
        }
      }
      
      // Fallback to general text analysis
      if (lowerText.includes('সত্য') || lowerText.includes('true') || 
          lowerText.includes('সঠিক') || lowerText.includes('correct')) {
        return 'true';
      } else if (lowerText.includes('মিথ্যা') || lowerText.includes('false') || 
                 lowerText.includes('ভুল') || lowerText.includes('incorrect') ||
                 lowerText.includes('অসত্য') || lowerText.includes('untrue')) {
        return 'false';
      } else if (lowerText.includes('ভ্রান্ত') || lowerText.includes('misleading') || 
                 lowerText.includes('প্ররোচক') || lowerText.includes('deceptive') ||
                 lowerText.includes('ভুল তথ্য') || lowerText.includes('false information')) {
        return 'misleading';
      } else {
        return 'unverified';
      }
    };
    
    const verdict = getVerdictFromReport(finalReport);

    console.log("News verification v2 completed successfully");

    return NextResponse.json(
      {
        success: true,
        verdict: verdict,
        confidence: 85, // Default confidence
        claim: newsContent.title,
        report: finalReport,
        sources: crawledContent.map((item: any, index: number) => ({
          id: index + 1,
          title: item.title,
          url: item.url,
          snippet: item.content.substring(0, 200) + '...',
          language: item.isEnglish ? 'English' : 'Bengali'
        })),
        originalUrl: url,
        scrapedTitle: newsContent.title,
        scrapedDomain: newsContent.domain,
        sourceInfo: {
          hasBengaliSources,
          hasEnglishSources,
          totalSources: crawledContent.length
        },
        generatedAt: new Date().toISOString()
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("News verification v2 error:", error);
    return NextResponse.json(
      {
        error:
          "News verification failed. Please try again with a different URL.",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}
