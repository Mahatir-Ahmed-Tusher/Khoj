import { NextRequest, NextResponse } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Groq } from 'groq-sdk'
import { PRIORITY_SITES } from '@/lib/utils'
import { findRelatedArticles } from '@/lib/data'
import { getSourceTiers, filterSocialMedia, isSocialMediaUrl } from '@/lib/source-tiers'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

// Helper function to create model-specific prompts
function createModelSpecificPrompt(query: string, crawledContent: any[], socialMediaSources: any[], modelType: 'gemini' | 'openai' | 'deepseek') {
  const baseContent = `
Claim to fact-check: ${query}

Verified Sources found (DO NOT use social media sources for verification):
${crawledContent.map((item: any, index: number) => `
Source ${index + 1}: ${item.title}
URL: ${item.url}
Language: ${item.isEnglish ? 'English' : 'Bengali'}
Content: ${item.content.substring(0, 1000)}...
`).join('\n')}
${socialMediaSources.length > 0 ? `
Social Media Sources found (DO NOT use these for verification, only mention them):
${socialMediaSources.map((item: any, index: number) => `
Social Media Source ${index + 1}: ${item.title}
URL: ${item.url}
`).join('\n')}
**IMPORTANT:** When mentioning these social media sources in the report, use their source numbers: ${socialMediaSources.map((item: any, index: number) => index + 1).join(', ')}
` : ''}
`;

  // Base prompt in English for all models
  const basePrompt = `${baseContent}

You are an experienced journalist and fact-checker working for an internationally recognized fact-checking organization. Create a detailed, human-friendly, and comprehensive report following the standard fact-checking process.

**Main Claim:** ${query}

**You MUST follow the standard fact-checking process:**

## Step 1: Claim Identification
- Clearly identify what specific claim is being verified
- Explain the context and scope of the claim
- State what exactly is being fact-checked (prevent confusion)

## Step 2: Gathering Evidence (Source Collection)
- You have collected evidence from ${crawledContent.length} sources
- Present ALL evidence found both FOR and AGAINST the claim
- Explain what evidence was collected from each source
- Note that the person/organization making the claim was considered (if applicable)
- Use numbered source references [1], [2], [3], etc. throughout

## Step 3: Finding the Latest and Most Reliable Data
- Among the collected evidence, identify the LATEST and MOST RELIABLE data
- Pay attention to the credibility and past record of data-supplying institutions
- Avoid or flag data from controversial institutions
- Explain why certain sources are more reliable than others
- Note any outdated or potentially erroneous data

## Step 4: Writing the Report

**Report Structure:**

# দাবি (Claim)
[Write the main claim clearly and unambiguously. Explain its impact and visibility. State what is being verified.]

# সিদ্ধান্ত (Verdict)
[True/False/Misleading/Unverified - write clearly and prominently]

# বিস্তারিত বিশ্লেষণ (Detailed Analysis)

## প্রমাণ সংগ্রহ (Evidence Collection)
- State: "এই দাবিটি যাচাই করতে আমরা খোঁজ-এর কোয়েরি পার্সিং প্রক্রিয়া চালিয়ে মোট ${crawledContent.length}টি নির্ভরযোগ্য ও সবচেয়ে প্রাসঙ্গিক উৎস পর্যালোচনা করেছি।"
- Detail what sources were reviewed (at least ${crawledContent.length} sources)
- Explain what information was found from each source
- Describe the credibility of each source
- Present evidence FOR the claim
- Present evidence AGAINST the claim
- Explain the process of collecting evidence

## সর্বশেষ ও নির্ভরযোগ্য তথ্য (Latest and Most Reliable Data)
- Identify which data is the most recent and reliable
- Explain why certain sources are more credible
- Highlight any discrepancies between sources
- Note the credibility of institutions providing data
- Flag any data from controversial or unreliable sources

## তথ্যের বিশ্লেষণ (Information Analysis)
- Analyze how consistent the found information is with each other
- Explain which information is credible and why
- Identify which information is questionable and why
- Cross-reference evidence from multiple sources

## যুক্তি ও প্রমাণ (Logic and Evidence)
- Explain step by step the logic for reaching the conclusion
- Provide evidence behind each argument
- Use numbered source references [1], [2], [3], etc. consistently
- Show the reasoning process clearly

## পটভূমি ও ইতিহাস (Context and History)
- If relevant, explain the history or context behind the event/claim
- Explain why this fact-check is important
- Provide background information

# সতর্কতা ও সীমাবদ্ধতা (Warnings and Limitations)
- Note if any information is unclear or limited
- Indicate if more research is needed
- Address any questions about source credibility
- Acknowledge any limitations in the fact-checking process

# উপসংহার (Conclusion)
- Summarize the main decision clearly
- Explain why this decision was reached
- Explain what it means for common people
- Restate the verdict prominently

**Important Instructions:**
- Write everything in simple, clear, and human-friendly Bengali
- Explain complex topics simply
- Provide logic at each step following the fact-checking process
- Be objective and evidence-based
- If using information from English sources, translate and write in Bengali
- Write so readers can easily understand
- Explain complex topics through Q&A or examples
- **CRITICAL:** You must use ALL provided sources (${crawledContent.length} sources). Reference them with [1], [2], [3], etc.
- **CRITICAL:** Do NOT create a separate "Source List" or "Sources" section. Sources are already referenced in the report.
- **Markdown Formatting:** Use only # and ##. Do NOT use ### or ####.
- **Detailed Writing:** Write at least 4-5 paragraphs in each major section. The report should be comprehensive and thorough.
- **Examples and Analysis:** Provide detailed examples and analysis for each point.
- **Minimum Sources:** You have ${crawledContent.length} sources. Use them all effectively in your analysis.
- **Evidence Presentation:** Present both supporting and opposing evidence fairly before reaching a conclusion.

**STRICT SOURCE RESTRICTION - SOCIAL MEDIA:**
- **NEVER use social media links (Facebook, Twitter/X, Instagram, YouTube, TikTok, LinkedIn, Reddit, Telegram, WhatsApp, etc.) as fact-checking sources for verifying information accuracy.**
- Social media links are NOT acceptable as authoritative sources for fact-checking verification.
- **IMPORTANT:** If social media sources were found (listed above), you MUST mention them in the report using this exact format:
  "ব্যবহারকারীর এই দাবিটি আমরা এই সামাজিক মাধ্যমগুলোতেও লক্ষ্য করেছি [source number], [source number]"
  Use the actual source numbers from the social media sources list above (they are numbered 1, 2, 3, etc.).
  ${socialMediaSources.length > 0 ? `Example: "ব্যবহারকারীর এই দাবিটি আমরা এই সামাজিক মাধ্যমগুলোতেও লক্ষ্য করেছি ${socialMediaSources.map((item: any, index: number) => `[${index + 1}]`).join(', ')}"` : ''}
- However, these social media sources MUST NOT be counted as verified resources or used to determine the verdict.
- Social media sources should ONLY be mentioned to acknowledge that the claim exists on social media, but they cannot be used for fact verification.
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
async function generateAIReport(query: string, crawledContent: any[], socialMediaSources: any[], maxRetries: number = 3): Promise<string> {
  // Step 1: Try Gemini first (gemini-2.5-flash)
  console.log('🤖 Trying Gemini (gemini-2.5-flash) first...')
  
  const geminiPrompt = createModelSpecificPrompt(query, crawledContent, socialMediaSources, 'gemini')
  
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
    
    const groqPrompt = createModelSpecificPrompt(query, crawledContent, socialMediaSources, 'openai')
    
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
    
    const deepseekPrompt = createModelSpecificPrompt(query, crawledContent, socialMediaSources, 'deepseek')
    
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

/**
 * Calculate relevance score for a search result against the query
 */
function calculateRelevanceScore(result: any, query: string): number {
  const queryLower = query.toLowerCase()
  const titleLower = (result.title || '').toLowerCase()
  const contentLower = (result.content || result.snippet || '').toLowerCase()
  const urlLower = (result.url || '').toLowerCase()
  
  let score = 0
  
  // Extract meaningful keywords from query (remove common words)
  const stopWords = ['এবং', 'অথবা', 'কিন্তু', 'যে', 'এই', 'একটি', 'এক', 'হয়', 'থাকে', 'আছে', 'করেছে', 'করেছেন', 'হবে', 'হবে', 'the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but', 'that', 'this', 'these', 'those']
  const queryKeywords = queryLower
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
  
  if (queryKeywords.length === 0) {
    // If no meaningful keywords, use full query
    queryKeywords.push(queryLower)
  }
  
  // Title matches get highest weight
  queryKeywords.forEach(keyword => {
    if (titleLower.includes(keyword)) {
      score += 0.3
    }
    if (titleLower === queryLower || titleLower.includes(queryLower)) {
      score += 0.5 // Exact match bonus
    }
  })
  
  // Content matches
  queryKeywords.forEach(keyword => {
    if (contentLower.includes(keyword)) {
      score += 0.15
    }
  })
  
  // URL matches (less weight)
  queryKeywords.forEach(keyword => {
    if (urlLower.includes(keyword)) {
      score += 0.05
    }
  })
  
  // Check for exact phrase match
  if (contentLower.includes(queryLower) || titleLower.includes(queryLower)) {
    score += 0.2
  }
  
  // Penalize very short content (likely irrelevant)
  if (contentLower.length < 50) {
    score *= 0.5
  }
  
  // Penalize if title and content don't match query at all
  let hasAnyMatch = false
  queryKeywords.forEach(keyword => {
    if (titleLower.includes(keyword) || contentLower.includes(keyword)) {
      hasAnyMatch = true
    }
  })
  
  if (!hasAnyMatch && queryKeywords.length > 0) {
    score *= 0.2 // Heavy penalty for no matches
  }
  
  return Math.min(1, score)
}

/**
 * Filter results by relevance threshold
 */
function filterByRelevance(results: any[], query: string, minRelevanceScore: number = 0.15): any[] {
  const scoredResults = results.map(result => ({
    ...result,
    relevanceScore: calculateRelevanceScore(result, query)
  }))
  
  // Filter out low-relevance results
  const relevantResults = scoredResults.filter(result => result.relevanceScore >= minRelevanceScore)
  
  // Sort by relevance score (highest first)
  relevantResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
  
  console.log(`📊 Relevance filtering: ${results.length} → ${relevantResults.length} results (min score: ${minRelevanceScore})`)
  if (results.length > relevantResults.length) {
    const filteredOut = results.length - relevantResults.length
    console.log(`❌ Filtered out ${filteredOut} irrelevant results`)
  }
  
  return relevantResults
}

/**
 * Classify query geography (Bangladesh vs International)
 */
async function classifyGeography(query: string): Promise<{ type: 'bangladesh' | 'international', confidence: number, reasoning: string }> {
  try {
    // Use internal API call - construct URL from request or use relative path
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'
    const apiUrl = `${baseUrl}/api/classify-geography`
    
    console.log(`🌍 Calling geography classification API: ${apiUrl}`)
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Geography classification API failed: ${response.status} - ${errorText}`)
      throw new Error(`Geography classification API failed: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Geography classification error:', error)
    // Fallback: default to bangladesh if classification fails
    return {
      type: 'bangladesh',
      confidence: 0.5,
      reasoning: 'Classification failed, defaulting to Bangladesh'
    }
  }
}

/**
 * Search sources using tiered approach
 */
async function searchTieredSources(
  query: string,
  geography: 'bangladesh' | 'international',
  maxResults: number = 15,
  minResults: number = 10
): Promise<{ results: any[], socialMediaSources: any[], tierBreakdown: { [key: number]: number }, hasBengaliSources: boolean, hasEnglishSources: boolean }> {
  const tiers = getSourceTiers(geography)
  const allResults: any[] = []
  const socialMediaSources: any[] = []
  const tierBreakdown: { [key: number]: number } = {}
    let hasBengaliSources = false
    let hasEnglishSources = false

  console.log(`🌍 Searching ${geography} claim with ${tiers.length} tiers`)

  for (const tier of tiers) {
    if (allResults.length >= maxResults) {
      console.log(`✅ Reached max results (${maxResults}), stopping tier search`)
      break
    }

    try {
      console.log(`🔍 Searching Tier ${tier.tier}: ${tier.name} (${tier.domains.length} domains)`)
      
      const tierResults = await tavilyManager.search(query, {
        include_domains: tier.domains,
        max_results: Math.min(maxResults - allResults.length, 10), // Limit per tier
        search_depth: "advanced"
      })
      
      if (tierResults.results && tierResults.results.length > 0) {
        // Separate social media sources from valid sources
        const socialMedia = tierResults.results.filter((result: any) => isSocialMediaUrl(result.url))
        const filteredTierResults = filterSocialMedia(tierResults.results)
        
        // Track social media sources separately (for mentioning, not for verification)
        if (socialMedia.length > 0) {
          const socialMediaWithMetadata = socialMedia.map((result: any) => ({
            ...result,
            tier: tier.tier,
            tierCategory: tier.category,
            isSocialMedia: true
          }))
          socialMediaSources.push(...socialMediaWithMetadata)
          console.log(`📱 Tier ${tier.tier} found ${socialMedia.length} social media sources (not counted as verified sources)`)
        }
        
        if (filteredTierResults.length > 0) {
          // Determine language based on tier category
          const isTierBengali = tier.category === 'bangladesh_news' || 
                               tier.category === 'bangladesh_factcheck' || 
                               tier.category === 'local_bangladesh'
          
          if (isTierBengali) {
            hasBengaliSources = true
          } else {
            hasEnglishSources = true
          }

          // Add tier metadata to each result
          const tieredResults = filteredTierResults.map((result: any) => ({
            ...result,
            tier: tier.tier,
            tierCategory: tier.category
          }))

          allResults.push(...tieredResults)
          tierBreakdown[tier.tier] = filteredTierResults.length
          
          console.log(`✅ Tier ${tier.tier} found ${filteredTierResults.length} sources (total: ${allResults.length})`)
        }
      }

      // Check if we have enough results from this tier (at least 3) before moving to next tier
      // Only move to next tier if current tier yielded < 3 results
      if (tierResults.results && tierResults.results.length >= 3 && allResults.length >= 3) {
        console.log(`✅ Tier ${tier.tier} provided sufficient results, may stop or continue based on total count`)
        // Continue to next tier only if we haven't reached maxResults
        if (allResults.length >= maxResults) {
          break
        }
      }

    } catch (error) {
      console.error(`❌ Tier ${tier.tier} search failed:`, error)
      // Continue to next tier on error
      continue
    }
  }

  // Always search outside tiers after tier searches to find additional relevant and important results
  try {
    const remainingSlots = maxResults - allResults.length
    if (remainingSlots > 0) {
      console.log(`🔍 Searching outside tiers for additional relevant results (${remainingSlots} slots available)...`)
      const generalResults = await tavilyManager.search(query, {
        max_results: Math.min(remainingSlots + 5, 10), // Get a few extra to filter
        search_depth: "advanced"
      })
      
      if (generalResults.results && generalResults.results.length > 0) {
        // Separate social media from general search results
        const socialMediaGeneral = generalResults.results.filter((result: any) => isSocialMediaUrl(result.url))
        const filteredGeneral = filterSocialMedia(generalResults.results)
        
        // Track social media sources separately
        if (socialMediaGeneral.length > 0) {
          const socialMediaWithMetadata = socialMediaGeneral.map((result: any) => ({
            ...result,
            tier: 999,
            tierCategory: 'general',
            isSocialMedia: true
          }))
          socialMediaSources.push(...socialMediaWithMetadata)
          console.log(`📱 General search found ${socialMediaGeneral.length} social media sources (not counted as verified sources)`)
        }
        
        // Add filtered general results (limit to remaining slots)
        const generalWithTier = filteredGeneral.slice(0, remainingSlots).map((result: any) => ({
          ...result,
          tier: 999, // General search tier
          tierCategory: 'general'
        }))
        
        if (generalWithTier.length > 0) {
          allResults.push(...generalWithTier)
          tierBreakdown[999] = (tierBreakdown[999] || 0) + generalWithTier.length
          console.log(`✅ General search found ${generalWithTier.length} additional relevant sources outside tiers (total: ${allResults.length})`)
        }
      }
    }
  } catch (error) {
    console.error('Failed to search general web:', error)
  }

  // If we still don't have enough results (minimum required), try additional general search
  if (allResults.length < minResults) {
    try {
      console.log(`⚠️ Still insufficient sources (${allResults.length}/${minResults}), trying extended general search...`)
      const extendedResults = await tavilyManager.search(query, {
        max_results: minResults - allResults.length + 5, // Get a few extra
        search_depth: "advanced"
      })
      
      if (extendedResults.results && extendedResults.results.length > 0) {
        // Separate social media from extended search results
        const socialMediaExtended = extendedResults.results.filter((result: any) => isSocialMediaUrl(result.url))
        const filteredExtended = filterSocialMedia(extendedResults.results)
        
        // Track social media sources separately
        if (socialMediaExtended.length > 0) {
          const socialMediaWithMetadata = socialMediaExtended.map((result: any) => ({
            ...result,
            tier: 999,
            tierCategory: 'general',
            isSocialMedia: true
          }))
          socialMediaSources.push(...socialMediaWithMetadata)
          console.log(`📱 Extended search found ${socialMediaExtended.length} social media sources (not counted as verified sources)`)
        }
        
        const extendedWithTier = filteredExtended.map((result: any) => ({
          ...result,
          tier: 999,
          tierCategory: 'general'
        }))
        allResults.push(...extendedWithTier)
        tierBreakdown[999] = (tierBreakdown[999] || 0) + filteredExtended.length
        console.log(`✅ Extended search found ${filteredExtended.length} additional sources (total: ${allResults.length})`)
      }
    } catch (error) {
      console.error('Failed to search extended general web:', error)
    }
  }

  // Sort results by tier priority (lower tier number = higher priority)
  allResults.sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier - b.tier
    }
    // If same tier, sort by relevance score if available
    return (b.score || 0) - (a.score || 0)
  })

  // Ensure we have at least minResults, but don't exceed maxResults
  const finalResults = allResults.length >= minResults 
    ? allResults.slice(0, maxResults)
    : allResults // Use all available if less than minResults

  if (finalResults.length < minResults) {
    console.warn(`⚠️ Warning: Only found ${finalResults.length} sources (minimum required: ${minResults})`)
  }

  return {
    results: finalResults,
    socialMediaSources: socialMediaSources.slice(0, 10), // Limit social media sources to 10
    tierBreakdown,
    hasBengaliSources,
    hasEnglishSources
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    console.log(`🚀 Starting fact-check for: "${query}"`)

    // Step 1: Classify geography (Bangladesh vs International)
    let geography: { type: 'bangladesh' | 'international', confidence: number, reasoning: string }
    try {
      geography = await classifyGeography(query)
      console.log(`🌍 Geography classified: ${geography.type} (confidence: ${geography.confidence})`)
      
      // If confidence is too low, default to Bangladesh for safety
      if (geography.confidence < 0.6) {
        console.log('⚠️ Low confidence in geography classification, defaulting to Bangladesh')
        geography = {
          type: 'bangladesh',
          confidence: 0.5,
          reasoning: 'Low confidence classification, defaulting to Bangladesh'
        }
      }
    } catch (error) {
      console.error('Geography classification failed:', error)
      // Fallback to Bangladesh
      geography = {
        type: 'bangladesh',
        confidence: 0.5,
        reasoning: 'Classification failed, defaulting to Bangladesh'
      }
    }

    // Step 2: Search sources using tiered approach (minimum 10, target 15)
    const { results: searchResults, socialMediaSources, tierBreakdown, hasBengaliSources, hasEnglishSources } = 
      await searchTieredSources(query, geography.type, 15, 10)

    // Step 3: Process results and filter social media (extra safety check)
    const filteredResults = filterSocialMedia(searchResults)

    // Step 4: Filter by relevance to remove irrelevant results
    let relevantResults = filterByRelevance(filteredResults, query, 0.15)
    
    // Ensure we have at least minResults after relevance filtering
    if (relevantResults.length < 10) {
      console.log(`⚠️ Only ${relevantResults.length} relevant results found, relaxing relevance threshold...`)
      // Relax threshold to get more results, but still filter out completely irrelevant ones
      relevantResults = filterByRelevance(filteredResults, query, 0.1)
      console.log(`✅ Found ${relevantResults.length} results with relaxed threshold`)
    }

    // Use all available results (already sorted by relevance)
    const crawledContent = relevantResults.slice(0, 15).map((result: any, index: number) => ({
      title: result.title,
      url: result.url,
      content: result.content || result.snippet || 'Content not available',
      isEnglish: result.tierCategory === 'international_media' || 
                 result.tierCategory === 'international_factcheck' ||
                 (!hasBengaliSources && result.tierCategory !== 'bangladesh_news' && result.tierCategory !== 'bangladesh_factcheck' && result.tierCategory !== 'local_bangladesh'),
      tier: result.tier,
      tierCategory: result.tierCategory
    }))

    // Process social media sources for mentioning (not for verification)
    const processedSocialMediaSources = socialMediaSources.map((item: any) => ({
      title: item.title,
      url: item.url
    }))

    // Generate fact-checking report with model-specific prompts
    const report = await generateAIReport(query, crawledContent, processedSocialMediaSources)
    
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
এই দাবিটি যাচাই করতে আমরা খোঁজ-এর কোয়েরি পার্সিং প্রক্রিয়া চালিয়ে মোট ${crawledContent.length}টি নির্ভরযোগ্য ও সবচেয়ে প্রাসঙ্গিক উৎস পর্যালোচনা করেছি। আমাদের গবেষণায় নিম্নলিখিত উৎসসমূহ অন্তর্ভুক্ত ছিল:

${crawledContent.map((item: any, index: number) => `- ${item.title} (${item.isEnglish ? 'ইংরেজি উৎস' : 'বাংলা উৎস'})`).join('\n')}
${processedSocialMediaSources.length > 0 ? `

**সামাজিক মাধ্যম:**
ব্যবহারকারীর এই দাবিটি আমরা এই সামাজিক মাধ্যমগুলোতেও লক্ষ্য করেছি ${processedSocialMediaSources.map((item: any, index: number) => `[${index + 1}]`).join(', ')}:
${processedSocialMediaSources.map((item: any, index: number) => `- [${index + 1}] ${item.title}`).join('\n')}
` : ''}

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
        totalSources: crawledContent.length,
        geography: geography.type,
        tierBreakdown: {
          tier1: tierBreakdown[1] || 0,
          tier2: tierBreakdown[2] || 0,
          tier3: tierBreakdown[3] || 0,
          tier4: tierBreakdown[4] || 0,
          tier5: tierBreakdown[5] || 0,
          general: tierBreakdown[999] || 0
        }
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
