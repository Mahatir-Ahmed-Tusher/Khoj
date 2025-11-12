import { NextRequest, NextResponse } from "next/server";
import {
  validateAPIKey,
  checkRateLimit,
  getAPIKeyFromRequest,
} from "@/lib/api-auth";

// Re-export the fact-checking logic from the internal API
// We'll import the core functions from the existing factcheck route
import { tavilyManager } from "@/lib/tavily-manager";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Groq } from "groq-sdk";
import { PRIORITY_SITES, type VerdictValue } from "@/lib/utils";
import { findRelatedArticles } from "@/lib/data";
import {
  getSourceTiers,
  filterSocialMedia,
  isSocialMediaUrl,
} from "@/lib/source-tiers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

// CORS headers helper function to ensure all responses have proper CORS headers
function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
  };
}

// Import helper functions from the internal factcheck route
// These are the same functions used in /api/factcheck/route.ts

function createModelSpecificPrompt(
  query: string,
  crawledContent: any[],
  socialMediaSources: any[],
  modelType: "gemini" | "openai" | "deepseek"
) {
  const baseContent = `
Claim to fact-check: ${query}

Verified Sources found (DO NOT use social media sources for verification):
${crawledContent
  .map(
    (item: any, index: number) => `
Source ${index + 1}: ${item.title}
URL: ${item.url}
Language: ${item.isEnglish ? "English" : "Bengali"}
Content: ${item.content.substring(0, 1000)}...
`
  )
  .join("\n")}
${
  socialMediaSources.length > 0
    ? `
Social Media Sources found (DO NOT use these for verification, only mention them):
${socialMediaSources
  .map(
    (item: any, index: number) => `
Social Media Source ${index + 1}: ${item.title}
URL: ${item.url}
`
  )
  .join("\n")}
**IMPORTANT:** When mentioning these social media sources in the report, use their source numbers: ${socialMediaSources.map((item: any, index: number) => index + 1).join(", ")}
`
    : ""
}
`;

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
[True/False/unverified/Unverified - write clearly and prominently]

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
  ${socialMediaSources.length > 0 ? `Example: "ব্যবহারকারীর এই দাবিটি আমরা এই সামাজিক মাধ্যমগুলোতেও লক্ষ্য করেছি ${socialMediaSources.map((item: any, index: number) => `[${index + 1}]`).join(", ")}"` : ""}
- However, these social media sources MUST NOT be counted as verified resources or used to determine the verdict.
- Social media sources should ONLY be mentioned to acknowledge that the claim exists on social media, but they cannot be used for fact verification.
- Only use credible news sources, official websites, research papers, government sources, and verified fact-checking organizations for fact verification.

Write the report as if an experienced journalist is writing for their readers - simple, clear, and trustworthy.
**MOST IMPORTANT: This report MUST be detailed and comprehensive. Do NOT write concisely or briefly.**`;

  if (modelType === "deepseek") {
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

  if (modelType === "openai") {
    return `${basePrompt}

**STRICT FORMAT RULES (for GROQ/OpenAI):**
- Do NOT generate tables in any form (no Markdown tables, no HTML tables)
- Do NOT use the pipe character '|' to format columns
- Write ONLY paragraphs and, where necessary, simple bullet lists
- Keep headings to only # and ## as specified above
`;
  }

  return basePrompt;
}

async function generateAIReport(
  query: string,
  crawledContent: any[],
  socialMediaSources: any[],
  maxRetries: number = 3
): Promise<string> {
  console.log("🤖 Trying Gemini (gemini-2.5-flash) first...");

  const geminiPrompt = createModelSpecificPrompt(
    query,
    crawledContent,
    socialMediaSources,
    "gemini"
  );

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `🤖 Generating AI report with gemini-2.5-flash (attempt ${attempt}/${maxRetries})...`
      );
      const result = await model.generateContent(geminiPrompt);
      const response = await result.response;
      return response.text();
    } catch (geminiError: any) {
      console.error(`❌ Gemini AI error (attempt ${attempt}):`, geminiError);

      if (geminiError.message && geminiError.message.includes("429")) {
        if (attempt < maxRetries) {
          const delay = Math.min(6000 * Math.pow(2, attempt - 1), 30000);
          console.log(
            `⏳ Rate limited. Waiting ${delay / 1000}s before retry...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        } else {
          console.log("❌ Max retries reached for rate limit, trying GROQ...");
          break;
        }
      }

      break;
    }
  }

  console.log("🔄 Gemini (gemini-2.5-flash) failed, falling back to GROQ...");

  try {
    console.log("🤖 Trying GROQ (openai/gpt-oss-120b)...");

    const groqPrompt = createModelSpecificPrompt(
      query,
      crawledContent,
      socialMediaSources,
      "openai"
    );

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: groqPrompt,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_tokens: 8192,
      top_p: 1,
      stream: false,
      stop: null,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;
    if (generatedText) {
      console.log("✅ GROQ report generated successfully");
      return generatedText;
    }
  } catch (groqError) {
    console.error("❌ GROQ error:", groqError);
  }

  try {
    console.log(
      "🔄 GROQ failed, trying DeepSeek (deepseek-r1-0528:free) as final fallback..."
    );

    const deepseekPrompt = createModelSpecificPrompt(
      query,
      crawledContent,
      socialMediaSources,
      "deepseek"
    );

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://khoj-bd.com",
          "X-Title": "Khoj Fact Checker API",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: deepseekPrompt,
            },
          ],
          max_tokens: 6000,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const generatedText = data.choices?.[0]?.message?.content;
      if (generatedText) {
        console.log("✅ DeepSeek report generated successfully");
        return generatedText;
      }
    } else {
      console.log(`❌ DeepSeek failed with status: ${response.status}`);
    }
  } catch (deepseekError) {
    console.error("❌ DeepSeek error:", deepseekError);
  }

  return "AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।";
}

function calculateRelevanceScore(result: any, query: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = (result.title || "").toLowerCase();
  const contentLower = (result.content || result.snippet || "").toLowerCase();
  const urlLower = (result.url || "").toLowerCase();

  let score = 0;

  const stopWords = [
    "এবং",
    "অথবা",
    "কিন্তু",
    "যে",
    "এই",
    "একটি",
    "এক",
    "হয়",
    "থাকে",
    "আছে",
    "করেছে",
    "করেছেন",
    "হবে",
    "the",
    "is",
    "are",
    "was",
    "were",
    "a",
    "an",
    "and",
    "or",
    "but",
    "that",
    "this",
    "these",
    "those",
  ];
  const queryKeywords = queryLower
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.includes(word));

  if (queryKeywords.length === 0) {
    queryKeywords.push(queryLower);
  }

  queryKeywords.forEach((keyword) => {
    if (titleLower.includes(keyword)) {
      score += 0.3;
    }
    if (titleLower === queryLower || titleLower.includes(queryLower)) {
      score += 0.5;
    }
  });

  queryKeywords.forEach((keyword) => {
    if (contentLower.includes(keyword)) {
      score += 0.15;
    }
  });

  queryKeywords.forEach((keyword) => {
    if (urlLower.includes(keyword)) {
      score += 0.05;
    }
  });

  if (contentLower.includes(queryLower) || titleLower.includes(queryLower)) {
    score += 0.2;
  }

  if (contentLower.length < 50) {
    score *= 0.5;
  }

  let hasAnyMatch = false;
  queryKeywords.forEach((keyword) => {
    if (titleLower.includes(keyword) || contentLower.includes(keyword)) {
      hasAnyMatch = true;
    }
  });

  if (!hasAnyMatch && queryKeywords.length > 0) {
    score *= 0.2;
  }

  return Math.min(1, score);
}

function filterByRelevance(
  results: any[],
  query: string,
  minRelevanceScore: number = 0.15
): any[] {
  const scoredResults = results.map((result) => ({
    ...result,
    relevanceScore: calculateRelevanceScore(result, query),
  }));

  const relevantResults = scoredResults.filter(
    (result) => result.relevanceScore >= minRelevanceScore
  );

  relevantResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  console.log(
    `📊 Relevance filtering: ${results.length} → ${relevantResults.length} results (min score: ${minRelevanceScore})`
  );

  return relevantResults;
}

async function classifyGeography(
  query: string
): Promise<{
  type: "bangladesh" | "international";
  confidence: number;
  reasoning: string;
}> {
  // Try khoj-bd.com first, then fallback to localhost:3000
  const baseUrls = [
    process.env.NEXT_PUBLIC_APP_URL || "https://khoj-bd.com",
    "http://localhost:3000",
  ];

  for (const baseUrl of baseUrls) {
    let timeoutId: NodeJS.Timeout | null = null;
    try {
      const apiUrl = `${baseUrl}/api/classify-geography`;
      console.log(`🌍 Trying geography classification API: ${apiUrl}`);

      // Create timeout controller
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      if (timeoutId) clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Geography classification successful from ${baseUrl}`);
        return result;
      } else {
        console.log(
          `⚠️ Geography classification failed from ${baseUrl}: ${response.status}`
        );
        // Continue to next URL
        continue;
      }
    } catch (error: any) {
      if (timeoutId) clearTimeout(timeoutId);
      console.log(
        `⚠️ Geography classification error from ${baseUrl}:`,
        error.message || error
      );
      // Continue to next URL if this one failed
      continue;
    }
  }

  // If all URLs failed, return default
  console.error("❌ All geography classification URLs failed, using default");
  return {
    type: "bangladesh",
    confidence: 0.5,
    reasoning: "Classification failed, defaulting to Bangladesh",
  };
}

async function searchTieredSources(
  query: string,
  geography: "bangladesh" | "international",
  maxResults: number = 15,
  minResults: number = 10
): Promise<{
  results: any[];
  socialMediaSources: any[];
  tierBreakdown: { [key: number]: number };
  hasBengaliSources: boolean;
  hasEnglishSources: boolean;
}> {
  const tiers = getSourceTiers(geography);
  const allResults: any[] = [];
  const socialMediaSources: any[] = [];
  const tierBreakdown: { [key: number]: number } = {};
  let hasBengaliSources = false;
  let hasEnglishSources = false;

  console.log(`🌍 Searching ${geography} claim with ${tiers.length} tiers`);

  for (const tier of tiers) {
    if (allResults.length >= maxResults) {
      console.log(
        `✅ Reached max results (${maxResults}), stopping tier search`
      );
      break;
    }

    try {
      console.log(
        `🔍 Searching Tier ${tier.tier}: ${tier.name} (${tier.domains.length} domains)`
      );

      const tierResults = await tavilyManager.search(query, {
        include_domains: tier.domains,
        max_results: Math.min(maxResults - allResults.length, 10),
        search_depth: "advanced",
      });

      if (tierResults.results && tierResults.results.length > 0) {
        const socialMedia = tierResults.results.filter((result: any) =>
          isSocialMediaUrl(result.url)
        );
        const filteredTierResults = filterSocialMedia(tierResults.results);

        if (socialMedia.length > 0) {
          const socialMediaWithMetadata = socialMedia.map((result: any) => ({
            ...result,
            tier: tier.tier,
            tierCategory: tier.category,
            isSocialMedia: true,
          }));
          socialMediaSources.push(...socialMediaWithMetadata);
          console.log(
            `📱 Tier ${tier.tier} found ${socialMedia.length} social media sources (not counted as verified sources)`
          );
        }

        if (filteredTierResults.length > 0) {
          const isTierBengali =
            tier.category === "bangladesh_news" ||
            tier.category === "bangladesh_factcheck" ||
            tier.category === "local_bangladesh";

          if (isTierBengali) {
            hasBengaliSources = true;
          } else {
            hasEnglishSources = true;
          }

          const tieredResults = filteredTierResults.map((result: any) => ({
            ...result,
            tier: tier.tier,
            tierCategory: tier.category,
          }));

          allResults.push(...tieredResults);
          tierBreakdown[tier.tier] = filteredTierResults.length;

          console.log(
            `✅ Tier ${tier.tier} found ${filteredTierResults.length} sources (total: ${allResults.length})`
          );
        }
      }

      if (
        tierResults.results &&
        tierResults.results.length >= 3 &&
        allResults.length >= 3
      ) {
        if (allResults.length >= maxResults) {
          break;
        }
      }
    } catch (error) {
      console.error(`❌ Tier ${tier.tier} search failed:`, error);
      continue;
    }
  }

  try {
    const remainingSlots = maxResults - allResults.length;
    if (remainingSlots > 0) {
      console.log(
        `🔍 Searching outside tiers for additional relevant results (${remainingSlots} slots available)...`
      );
      const generalResults = await tavilyManager.search(query, {
        max_results: Math.min(remainingSlots + 5, 10),
        search_depth: "advanced",
      });

      if (generalResults.results && generalResults.results.length > 0) {
        const socialMediaGeneral = generalResults.results.filter(
          (result: any) => isSocialMediaUrl(result.url)
        );
        const filteredGeneral = filterSocialMedia(generalResults.results);

        if (socialMediaGeneral.length > 0) {
          const socialMediaWithMetadata = socialMediaGeneral.map(
            (result: any) => ({
              ...result,
              tier: 999,
              tierCategory: "general",
              isSocialMedia: true,
            })
          );
          socialMediaSources.push(...socialMediaWithMetadata);
        }

        const generalWithTier = filteredGeneral
          .slice(0, remainingSlots)
          .map((result: any) => ({
            ...result,
            tier: 999,
            tierCategory: "general",
          }));

        if (generalWithTier.length > 0) {
          allResults.push(...generalWithTier);
          tierBreakdown[999] =
            (tierBreakdown[999] || 0) + generalWithTier.length;
        }
      }
    }
  } catch (error) {
    console.error("Failed to search general web:", error);
  }

  if (allResults.length < minResults) {
    try {
      console.log(
        `⚠️ Still insufficient sources (${allResults.length}/${minResults}), trying extended general search...`
      );
      const extendedResults = await tavilyManager.search(query, {
        max_results: minResults - allResults.length + 5,
        search_depth: "advanced",
      });

      if (extendedResults.results && extendedResults.results.length > 0) {
        const socialMediaExtended = extendedResults.results.filter(
          (result: any) => isSocialMediaUrl(result.url)
        );
        const filteredExtended = filterSocialMedia(extendedResults.results);

        if (socialMediaExtended.length > 0) {
          const socialMediaWithMetadata = socialMediaExtended.map(
            (result: any) => ({
              ...result,
              tier: 999,
              tierCategory: "general",
              isSocialMedia: true,
            })
          );
          socialMediaSources.push(...socialMediaWithMetadata);
        }

        const extendedWithTier = filteredExtended.map((result: any) => ({
          ...result,
          tier: 999,
          tierCategory: "general",
        }));
        allResults.push(...extendedWithTier);
        tierBreakdown[999] =
          (tierBreakdown[999] || 0) + filteredExtended.length;
      }
    } catch (error) {
      console.error("Failed to search extended general web:", error);
    }
  }

  allResults.sort((a, b) => {
    if (a.tier !== b.tier) {
      return a.tier - b.tier;
    }
    return (b.score || 0) - (a.score || 0);
  });

  const finalResults =
    allResults.length >= minResults
      ? allResults.slice(0, maxResults)
      : allResults;

  if (finalResults.length < minResults) {
    console.warn(
      `⚠️ Warning: Only found ${finalResults.length} sources (minimum required: ${minResults})`
    );
  }

  return {
    results: finalResults,
    socialMediaSources: socialMediaSources.slice(0, 10),
    tierBreakdown,
    hasBengaliSources,
    hasEnglishSources,
  };
}

/**
 * Public API endpoint for AI-powered fact-checking
 * POST /api/v1/factcheck
 * 
 * Authentication: Bearer token or X-API-Key header
 * Rate limiting: Configurable per API key
 */
export async function POST(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: {
        ...getCorsHeaders(),
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    // 1. Authenticate request (optional if API_AUTH_REQUIRED is false)
    const apiKey = getAPIKeyFromRequest(request.headers);
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 API Key received:', apiKey ? `${apiKey.substring(0, 4)}...` : 'none');
    }
    
    const keyConfig = validateAPIKey(apiKey);
    const authRequired = process.env.API_AUTH_REQUIRED !== "false"; // Default: true (required)

    if (authRequired && !keyConfig) {
      // Get detailed validation info for better error messages
      let errorMessage = "Invalid or missing API key.";
      let helpMessage = "";
      
      if (apiKey) {
        const { validateAPIKeyForUser } = await import('@/lib/api-key-manager');
        const trimmedApiKey = apiKey.trim();
        const validation = validateAPIKeyForUser(trimmedApiKey);
        
        // Debug logging (only in development)
        if (process.env.NODE_ENV === 'development') {
          console.log('❌ API Key validation failed:', {
            keyReceived: trimmedApiKey.substring(0, 4) + '...',
            keyLength: trimmedApiKey.length,
            keyExists: !!validation.key,
            status: validation.key?.status,
            assigned: validation.assigned,
            error: validation.error,
          });
        }
        
        // Provide specific error messages
        if (!validation.key) {
          errorMessage = `API key not found. Please check your API key and try again. Make sure you copied the key correctly from https://khoj-bd.com/get-api-key`;
          helpMessage = "💡 For development/testing, you can disable authentication by setting API_AUTH_REQUIRED=false in your .env file.";
        } else if (validation.key.status === 'revoked') {
          errorMessage = "This API key has been revoked. Please contact support or get a new API key from https://khoj-bd.com/get-api-key";
        } else if (validation.key.status === 'available') {
          errorMessage = "This API key is not assigned to any user. Please log in with Google and visit https://khoj-bd.com/get-api-key to assign it to your account.";
          helpMessage = "💡 For development/testing, you can disable authentication by setting API_AUTH_REQUIRED=false in your .env file.";
        } else if (!validation.assigned) {
          errorMessage = "This API key is not assigned. Please log in with Google and visit https://khoj-bd.com/get-api-key to assign it to your account.";
          helpMessage = "💡 For development/testing, you can disable authentication by setting API_AUTH_REQUIRED=false in your .env file.";
        }
      } else {
        errorMessage = "No API key provided. Please provide a valid API key in the 'Authorization: Bearer <key>' header or 'X-API-Key' header.";
        helpMessage = "💡 For development/testing, you can disable authentication by setting API_AUTH_REQUIRED=false in your .env file. This allows you to test without an API key.";
      }
      
      const fullMessage = helpMessage 
        ? `${errorMessage}\n\n${helpMessage}\n\nTo get an API key for production, log in with Google and visit https://khoj-bd.com/get-api-key`
        : `${errorMessage} To get an API key, log in with Google and visit https://khoj-bd.com/get-api-key`;
      
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: fullMessage,
          developmentTip: process.env.NODE_ENV === 'development' 
            ? "Set API_AUTH_REQUIRED=false in your .env file to disable authentication for testing"
            : undefined,
        },
        { 
          status: 401,
          headers: getCorsHeaders(),
        }
      );
    }

    // 2. Check rate limit (only if API key is provided)
    let rateLimit = { allowed: true, remaining: 999, resetAt: Date.now() + 3600000 };
    if (keyConfig && apiKey) {
      rateLimit = checkRateLimit(apiKey);
      if (!rateLimit.allowed) {
        const resetDate = new Date(rateLimit.resetAt);
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: `You have exceeded your rate limit. Please try again after ${resetDate.toISOString()}.`,
            resetAt: resetDate.toISOString(),
          },
          {
            status: 429,
            headers: {
              ...getCorsHeaders(),
              "X-RateLimit-Limit": keyConfig.rateLimit.requests.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": resetDate.toISOString(),
            },
          }
        );
      }
    }

    // 3. Parse request body
    let body: any;
    try {
      body = await request.json();
    } catch (jsonError) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Invalid JSON in request body. Please ensure your request body is valid JSON.",
        },
        { 
          status: 400,
          headers: getCorsHeaders(),
        }
      );
    }
    
    const { query } = body;

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Query is required and must be a non-empty string",
        },
        { 
          status: 400,
          headers: getCorsHeaders(),
        }
      );
    }

    console.log(
      `🚀 [API v1] Starting fact-check for: "${query}"${keyConfig ? ` (API Key: ${keyConfig.name})` : " (No API key - public access)"}`
    );

    // 4. Classify geography
    let geography: {
      type: "bangladesh" | "international";
      confidence: number;
      reasoning: string;
    };
    try {
      geography = await classifyGeography(query);
      console.log(
        `🌍 Geography classified: ${geography.type} (confidence: ${geography.confidence})`
      );

      if (geography.confidence < 0.6) {
        console.log(
          "⚠️ Low confidence in geography classification, defaulting to Bangladesh"
        );
        geography = {
          type: "bangladesh",
          confidence: 0.5,
          reasoning: "Low confidence classification, defaulting to Bangladesh",
        };
      }
    } catch (error) {
      console.error("Geography classification failed:", error);
      geography = {
        type: "bangladesh",
        confidence: 0.5,
        reasoning: "Classification failed, defaulting to Bangladesh",
      };
    }

    // 5. Search sources using tiered approach
    const {
      results: searchResults,
      socialMediaSources,
      tierBreakdown,
      hasBengaliSources,
      hasEnglishSources,
    } = await searchTieredSources(query, geography.type, 15, 10);

    // 6. Process results
    const filteredResults = filterSocialMedia(searchResults);
    let relevantResults = filterByRelevance(filteredResults, query, 0.15);

    if (relevantResults.length < 10) {
      console.log(
        `⚠️ Only ${relevantResults.length} relevant results found, relaxing relevance threshold...`
      );
      relevantResults = filterByRelevance(filteredResults, query, 0.1);
    }

    const crawledContent = relevantResults
      .slice(0, 15)
      .map((result: any, index: number) => ({
        title: result.title,
        url: result.url,
        content: result.content || result.snippet || "Content not available",
        isEnglish:
          result.tierCategory === "international_media" ||
          result.tierCategory === "international_factcheck" ||
          (!hasBengaliSources &&
            result.tierCategory !== "bangladesh_news" &&
            result.tierCategory !== "bangladesh_factcheck" &&
            result.tierCategory !== "local_bangladesh"),
        tier: result.tier,
        tierCategory: result.tierCategory,
      }));

    const processedSocialMediaSources = socialMediaSources.map((item: any) => ({
      title: item.title,
      url: item.url,
    }));

    // 7. Generate fact-checking report
    const report = await generateAIReport(
      query,
      crawledContent,
      processedSocialMediaSources
    );

    // 8. Find related articles
    const relatedArticles = findRelatedArticles(query, 3);

    // 9. Add fallback content if AI failed
    const finalReport =
      report ===
      "AI সিস্টেমে সমস্যার কারণে বিস্তারিত বিশ্লেষণ প্রদান করা সম্ভব হচ্ছে না।"
        ? `
## দাবি
${query}

## সিদ্ধান্ত
অযাচাইকৃত

## বিস্তারিত বিশ্লেষণ

**প্রাথমিক তথ্য সংগ্রহ:**
এই দাবিটি যাচাই করতে আমরা খোঁজ-এর কোয়েরি পার্সিং প্রক্রিয়া চালিয়ে মোট ${crawledContent.length}টি নির্ভরযোগ্য ও সবচেয়ে প্রাসঙ্গিক উৎস পর্যালোচনা করেছি। আমাদের গবেষণায় নিম্নলিখিত উৎসসমূহ অন্তর্ভুক্ত ছিল:

${crawledContent.map((item: any, index: number) => `- ${item.title} (${item.isEnglish ? "ইংরেজি উৎস" : "বাংলা উৎস"})`).join("\n")}
${
  processedSocialMediaSources.length > 0
    ? `

**সামাজিক মাধ্যম:**
ব্যবহারকারীর এই দাবিটি আমরা এই সামাজিক মাধ্যমগুলোতেও লক্ষ্য করেছি ${processedSocialMediaSources.map((item: any, index: number) => `[${index + 1}]`).join(", ")}:
${processedSocialMediaSources.map((item: any, index: number) => `- [${index + 1}] ${item.title}`).join("\n")}
`
    : ""
}

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
        : report;

    // 10. Determine verdict
    const getVerdictFromReport = (reportText: string): VerdictValue => {
      const lowerText = reportText.toLowerCase();
      if (
        lowerText.includes("context dependent") ||
        lowerText.includes("context-dependent") ||
        lowerText.includes("context specific") ||
        lowerText.includes("contextual") ||
        lowerText.includes("প্রেক্ষাপট")
      ) {
        return "context_dependent";
      } else if (lowerText.includes("সত্য") || lowerText.includes("true")) {
        return "true";
      } else if (lowerText.includes("মিথ্যা") || lowerText.includes("false")) {
        return "false";
      } else if (
        lowerText.includes("ভ্রান্ত") ||
        lowerText.includes("unverified")
      ) {
        return "unverified";
      } else {
        return "unverified";
      }
    };

    const verdict = getVerdictFromReport(finalReport);

    // 11. Return response with rate limit headers (if API key provided)
    const resetDate = new Date(rateLimit.resetAt);
    const responseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...getCorsHeaders(),
    };
    
    if (keyConfig) {
      responseHeaders["X-RateLimit-Limit"] = keyConfig.rateLimit.requests.toString();
      responseHeaders["X-RateLimit-Remaining"] = rateLimit.remaining.toString();
      responseHeaders["X-RateLimit-Reset"] = resetDate.toISOString();
    } else {
      responseHeaders["X-RateLimit-Limit"] = "unlimited";
      responseHeaders["X-RateLimit-Remaining"] = "unlimited";
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          claim: query,
          report: finalReport,
          verdict: verdict,
          sources: crawledContent.map((item: any, index: number) => ({
            id: index + 1,
            title: item.title,
            url: item.url,
            snippet: item.content.substring(0, 200) + "...",
            language: item.isEnglish ? "English" : "Bengali",
          })),
          relatedArticles: relatedArticles.map((article) => ({
            id: article.id,
            title: article.title,
            slug: article.slug,
            summary: article.summary,
            verdict: article.verdict,
            publishedAt: article.publishedAt,
            author: article.author,
            tags: article.tags,
            thumbnail: article.thumbnail,
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
              general: tierBreakdown[999] || 0,
            },
          },
          generatedAt: new Date().toISOString(),
        },
        meta: {
          apiVersion: "1.0",
          generatedAt: new Date().toISOString(),
          authenticated: !!keyConfig,
        },
      },
      {
        status: 200,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error("Fact check API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate fact-checking report",
      },
      { 
        status: 500,
        headers: getCorsHeaders(),
      }
    );
  }
}

/**
 * GET endpoint for API documentation
 */
export async function GET() {
  return NextResponse.json({
    name: "Khoj Fact-Checking API",
    version: "1.0",
    description:
      "AI-powered fact-checking API for third-party integration. Verify claims and get detailed fact-checking reports in Bengali.",
    endpoint: "/api/v1/factcheck",
    method: "POST",
    authentication: {
      type: "API Key (Optional for testing, Required in production)",
      required: process.env.API_AUTH_REQUIRED !== "false",
      methods: [
        "Authorization: Bearer <your-api-key>",
        "X-API-Key: <your-api-key>",
      ],
      note: "Set API_AUTH_REQUIRED=false in environment to disable authentication for testing",
    },
    request: {
      contentType: "application/json",
      body: {
        query: "string (required) - The claim or statement to fact-check",
      },
      example: {
        query: "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে",
      },
    },
    response: {
      success: true,
      data: {
        claim: "string - The original claim",
        report: "string - Detailed fact-checking report in Bengali (Markdown format)",
        verdict: "string - One of: 'true', 'false', 'unverified', 'context_dependent'",
        sources: [
          {
            id: "number",
            title: "string",
            url: "string",
            snippet: "string",
            language: "string - 'Bengali' or 'English'",
          },
        ],
        relatedArticles: "array - Related fact-check articles from Khoj database",
        sourceInfo: {
          hasBengaliSources: "boolean",
          hasEnglishSources: "boolean",
          totalSources: "number",
          geography: "string - 'bangladesh' or 'international'",
          tierBreakdown: "object - Breakdown of sources by tier",
        },
        generatedAt: "string - ISO 8601 timestamp",
      },
      meta: {
        apiVersion: "string",
        generatedAt: "string - ISO 8601 timestamp",
      },
    },
    rateLimiting: {
      description:
        "Rate limits are configured per API key. Check response headers for current status.",
      headers: {
        "X-RateLimit-Limit": "Total requests allowed in the time window",
        "X-RateLimit-Remaining": "Remaining requests in current window",
        "X-RateLimit-Reset": "ISO 8601 timestamp when the rate limit resets",
      },
    },
    errors: {
      400: "Bad Request - Invalid or missing query parameter",
      401: "Unauthorized - Invalid or missing API key",
      429: "Too Many Requests - Rate limit exceeded",
      500: "Internal Server Error - Server-side error occurred",
    },
    documentation: "https://khoj-bd.com/api-docs",
    support: "For technical support, contact info@khoj-bd.com. To get an API key, log in with Google and visit /get-api-key",
  }, {
    headers: getCorsHeaders(),
  });
}

