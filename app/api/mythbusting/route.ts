import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import {
  searchWithRapidAPIFallback,
  searchWithRapidAPIFallbackAlternative,
} from "@/lib/rapidapi-manager";

// Generate fallback references when RapidAPI search fails
function generateFallbackReferences(query: string) {
  const fallbackSources = [
    {
      title: "Scientific American - Latest Research",
      url: "https://www.scientificamerican.com",
      snippet:
        "Peer-reviewed scientific research and analysis on various topics including health, technology, and environmental science.",
    },
    {
      title: "PubMed - National Library of Medicine",
      url: "https://pubmed.ncbi.nlm.nih.gov",
      snippet:
        "Database of biomedical literature with millions of citations from MEDLINE and other life science journals.",
    },
    {
      title: "Nature - International Journal of Science",
      url: "https://www.nature.com",
      snippet:
        "Leading international weekly journal of science publishing the finest peer-reviewed research.",
    },
    {
      title: "Science Magazine",
      url: "https://www.science.org",
      snippet:
        "American Association for the Advancement of Science journal covering all scientific disciplines.",
    },
    {
      title: "World Health Organization (WHO)",
      url: "https://www.who.int",
      snippet:
        "United Nations specialized agency for international public health with evidence-based health information.",
    },
    {
      title: "NASA - National Aeronautics and Space Administration",
      url: "https://www.nasa.gov",
      snippet:
        "U.S. government agency responsible for space exploration and scientific research.",
    },
    {
      title: "National Geographic",
      url: "https://www.nationalgeographic.com",
      snippet:
        "Scientific and educational organization providing reliable information about science, nature, and culture.",
    },
    {
      title: "BBC Science",
      url: "https://www.bbc.com/news/science_and_environment",
      snippet:
        "BBC News coverage of science, environment, and technology with expert analysis.",
    },
  ];

  // Add query-specific sources based on the topic
  const queryLower = query.toLowerCase();

  if (
    queryLower.includes("health") ||
    queryLower.includes("medical") ||
    queryLower.includes("disease")
  ) {
    fallbackSources.push({
      title: "Mayo Clinic - Health Information",
      url: "https://www.mayoclinic.org",
      snippet:
        "Nonprofit organization committed to clinical practice, education, and research in medical care.",
    });
  }

  if (
    queryLower.includes("climate") ||
    queryLower.includes("environment") ||
    queryLower.includes("global warming")
  ) {
    fallbackSources.push({
      title: "IPCC - Intergovernmental Panel on Climate Change",
      url: "https://www.ipcc.ch",
      snippet:
        "United Nations body for assessing the science related to climate change.",
    });
  }

  if (
    queryLower.includes("technology") ||
    queryLower.includes("ai") ||
    queryLower.includes("artificial intelligence")
  ) {
    fallbackSources.push({
      title: "MIT Technology Review",
      url: "https://www.technologyreview.com",
      snippet:
        "Independent media company owned by MIT, covering emerging technologies and their commercial, social, and political impacts.",
    });
  }

  return fallbackSources.slice(0, 8); // Ensure exactly 8 sources
}

export async function GET() {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey =
      process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      return NextResponse.json({
        status: "Mythbusting API is working",
        message: "Use POST method with query parameter to analyze claims",
        error: "No AI API keys configured",
        details: "Need either GROQ_API_KEY or GEMINI_API_KEY",
        availableKeys: Object.keys(process.env).filter(
          (key) => key.includes("GROQ") || key.includes("GEMINI")
        ),
      });
    }

    return NextResponse.json({
      status: "Mythbusting API is working",
      message: "Use POST method with query parameter to analyze claims",
      apiKeyConfigured: true,
      primaryModel: groqApiKey ? "Groq GPT-OSS-120B" : "Gemini 2.5 Flash",
      fallbackModel: groqApiKey && geminiApiKey ? "Gemini 2.5 Flash" : "None",
      groqAvailable: !!groqApiKey,
      geminiAvailable: !!geminiApiKey,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Mythbusting API is working",
      message: "Use POST method with query parameter to analyze claims",
      error: "API key issue: " + error,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log("Mythbusting request received:", query);

    // Step 1: Search for evidence using RapidAPI with fallback
    let searchResults = null;
    let evidenceSources: Array<{
      title: string;
      url: string;
      snippet: string;
    }> = [];

    try {
      console.log("Starting RapidAPI search...");
      // Try primary RapidAPI search with fallback
      searchResults = await searchWithRapidAPIFallback(query, 20);

      // If primary fails, try alternative with fallback
      if (!searchResults) {
        console.log("Primary RapidAPI search failed, trying alternative...");
        searchResults = await searchWithRapidAPIFallbackAlternative(query, 10);
      }

      if (searchResults) {
        console.log("RapidAPI search successful");
      } else {
        console.log(
          "All RapidAPI searches failed, will use fallback references"
        );
      }
    } catch (searchError) {
      console.error("RapidAPI search error:", searchError);
      console.log("Continuing with fallback references...");
    }

    // Extract sources from search results
    if (searchResults && searchResults.results) {
      const toCandidate = (result: any) => ({
        title: result.title || result.name || "Unknown",
        url: result.url || result.link || result.href || "",
        snippet: result.snippet || result.description || result.excerpt || "",
      });

      const candidates = searchResults.results.map(toCandidate).filter((s: any) => s.url && s.title);

      // Prefer international, English-language sources; filter out Bangla/local (.bd) content
      const isLikelyBangla = (text: string) => /[\u0980-\u09FF]/.test(text);
      const isLocalBd = (url: string) => /\.(bd)(\/|$)/i.test(url);

      evidenceSources = candidates
        .filter((s: any) => !isLocalBd(s.url) && !isLikelyBangla(s.title + " " + s.snippet))
        .slice(0, 8);

      // Fallback to any candidates if filtering removed all
      if (evidenceSources.length === 0) {
        evidenceSources = candidates.slice(0, 8);
      }
    }

    // If no evidence sources found, create fallback references based on the query
    if (evidenceSources.length === 0) {
      console.log("No RapidAPI results found, creating fallback references...");
      evidenceSources = generateFallbackReferences(query);
    }

    console.log(`📚 Found ${evidenceSources.length} evidence sources`);

    // Initialize AI models - Groq first, then Gemini fallback
    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey =
      process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;

    if (!groqApiKey && !geminiApiKey) {
      console.error("No AI API keys configured in environment");
      return NextResponse.json(
        {
          error: "No AI API keys configured",
          details:
            "Please check your environment variables. Need either GROQ_API_KEY or GEMINI_API_KEY",
          availableKeys: Object.keys(process.env).filter(
            (key) => key.includes("GROQ") || key.includes("GEMINI")
          ),
        },
        { status: 500 }
      );
    }

    console.log("Environment check passed - AI API keys are configured");

    let useGroq = false;
    let groqClient = null;
    let geminiModel = null;

    // Try Groq first (primary)
    if (groqApiKey) {
      try {
        console.log("Initializing Groq client with GPT-OSS-120B...");
        groqClient = new Groq({ apiKey: groqApiKey });
        useGroq = true;
        console.log("Successfully initialized Groq client");
      } catch (error) {
        console.error("Groq initialization failed:", error);
        useGroq = false;
      }
    } else {
      console.log("GROQ_API_KEY not found, using Gemini fallback");
    }

    // Initialize Gemini as fallback
    if (!useGroq && geminiApiKey) {
      try {
        console.log("Initializing Gemini AI as fallback...");
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Successfully initialized Gemini 2.5 Flash model");
      } catch (error) {
        console.error("Gemini initialization failed:", error);
        return NextResponse.json(
          {
            error: "No AI model available",
            details: "Both Groq and Gemini failed to initialize",
            groqAvailable: !!groqApiKey,
            geminiAvailable: !!geminiApiKey,
            last_error:
              error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }
    } else if (!useGroq && !geminiApiKey) {
      return NextResponse.json(
        {
          error: "No AI API keys configured",
          details: "Need either GROQ_API_KEY or GEMINI_API_KEY",
          availableKeys: Object.keys(process.env).filter(
            (key) => key.includes("GROQ") || key.includes("GEMINI")
          ),
        },
        { status: 500 }
      );
    }

    // Prepare evidence context for AI
    let evidenceContext = "";
    if (evidenceSources.length > 0) {
      evidenceContext = `\n\n**EVIDENCE FROM WEB SEARCH (${evidenceSources.length} sources found):**\n`;
      evidenceSources.forEach((source: any, index: number) => {
        evidenceContext += `[${index + 1}] ${source.title}\nURL: ${source.url}\nSnippet: ${source.snippet}\n\n`;
      });
      evidenceContext += `\n**INSTRUCTIONS FOR ANALYSIS:**\n`;
      evidenceContext += `- Use these web search results as primary evidence\n`;
      evidenceContext += `- Supplement with your extensive knowledge base\n`;
      evidenceContext += `- Cross-reference information between sources\n`;
      evidenceContext += `- Provide scientific context and background\n`;
      evidenceContext += `- Include counter-arguments if they exist\n`;
      evidenceContext += `- Explain the broader implications\n`;
      evidenceContext += `- When referencing sources, include the source name (e.g., "BBC Science [7] mentions...")\n`;
      evidenceContext += `- ALWAYS include at least 8 references in your SOURCES section\n`;
    } else {
      evidenceContext =
        "\n\n**Note: No web search results found. Rely on your extensive knowledge base to provide a comprehensive analysis.**";
      evidenceContext += `\n\n**INSTRUCTIONS FOR ANALYSIS:**\n`;
      evidenceContext += `- Use your comprehensive knowledge base\n`;
      evidenceContext += `- Provide detailed scientific background\n`;
      evidenceContext += `- Include relevant research and studies\n`;
      evidenceContext += `- Explain underlying principles\n`;
      evidenceContext += `- Address common misconceptions\n`;
      evidenceContext += `- ALWAYS include at least 8 references in your SOURCES section\n`;
    }

    // Enhanced system prompt for conversational mythbusting
    const systemPrompt = `You are a careful fact-checker writing a Bengali report. Do not use clichéd openings like "আপনি হয়তো ভাবছেন". Keep the tone natural and clear.

**Your Communication Style:**
- Use simple, everyday Bengali that anyone can understand
- Flowing narrative; avoid bullet points and tables
- Natural openings; DO NOT use the phrase "আপনি হয়তো ভাবছেন"

**Your Analysis Approach:**
- Start with the big picture - what's really going on here?
- Explain the science/history/context in simple terms
- Use analogies and examples people can relate to
- Address common misconceptions naturally in the flow
- Show why this matters to people's daily lives
- Be honest about what we know vs. what we don't know

**Response Format (Write as flowing narrative, not bullet points):**

VERDICT: [true/false/misleading/unverified/partially_true/context_dependent]

SUMMARY: [Write a BRIEF 2-3 sentence gist in Bengali (no heading text required in the body, just the summary sentences).]

DETAILED_ANALYSIS: [Write a comprehensive, flowing analysis in Bengali that:
- Starts and ends naturally
- Explains complex topics in simple language
- Uses real-life examples and analogies
- Corrects common misconceptions
- Explains why this topic is important
- Incorporates evidence as part of the story
- Provides detailed scientific/historical context
- Analyzes from multiple perspectives
- Encourages readers to think critically
- Contains at least 5-7 detailed paragraphs
- NO TABLES, NO BULLET POINTS - only flowing paragraphs]

CONCLUSION: [Write "তাহলে যেটা দাঁড়ায়" - your own explanation and final opinion that includes:
- Summary of all analysis
- Your own assessment
- Explanation of why you reached this conclusion
- Importance for people
- Advice for the future]

KEY TAKEAWAYS: [Write 2-3 simple, memorable key messages in Bengali]


**Critical Formatting Requirements:**
- SUMMARY must be a BRIEF gist (2-3 sentences max), NOT a detailed analysis
- NO TABLES anywhere in the response
- NO bullet points or numbered lists in DETAILED_ANALYSIS
- Write in flowing paragraphs that connect naturally
- Use conversational tone in Bengali; do NOT use the phrase "আপনি হয়তো ভাবছেন"
- Include interesting facts and surprising discoveries
- Make it feel like a friendly conversation, not a formal report
- Use Bengali expressions and cultural references when appropriate
- Be comprehensive - don't just rely on search results, use your extensive knowledge
- Prefer international, English-language sources in SOURCES. Avoid local/regional Bangla-only sources when strong international sources exist.
- For scientific/medical/technical claims, prioritize peer‑reviewed journals (e.g., Nature, Science, The Lancet, PNAS), reputable organizations (WHO, CDC, NASA, IPCC), credible science magazines (Scientific American, National Geographic, MIT Technology Review), and trustworthy research blogs from institutions.
- In the SOURCES section, output lines strictly as: Title - URL (http/https link). Include at least 8 items.
- Provide deep analysis with historical context, scientific background, and cultural implications
- Write at least 5-7 detailed paragraphs in DETAILED_ANALYSIS section
- In CONCLUSION section, provide your own expert opinion and final assessment
- Make the analysis educational but accessible to everyone
- Write ALL content in Bengali except for technical terms that are better in English

Analyze the claim: "`;

    const prompt = `${systemPrompt}${query}"

${evidenceContext}

Please provide a comprehensive mythbusting analysis following the exact format above. Use the provided evidence sources when available and reference them properly. The report must be in Bengali.`;

    console.log("Sending request to AI with evidence...");
    let text: string;
    let aiModelUsed: string;

    try {
      if (useGroq && groqClient) {
        console.log("Using Groq GPT-OSS-120B for mythbusting analysis...");
        const completion = await groqClient.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 1,
          max_tokens: 8192,
          top_p: 1,
        });

        text = completion.choices[0]?.message?.content || "";
        aiModelUsed = "Groq GPT-OSS-120B";
        console.log("Successfully received response from Groq GPT-OSS-120B");
      } else if (geminiModel) {
        console.log("Using Gemini 2.5 Flash for mythbusting analysis...");
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        text = response.text();
        aiModelUsed = "Gemini 2.5 Flash";
        console.log("Successfully received response from Gemini 2.5 Flash");
      } else {
        throw new Error("No AI model available");
      }

      if (!text) {
        console.error("Empty response from AI model");
        return NextResponse.json(
          { error: "Empty response from AI model" },
          { status: 500 }
        );
      }
    } catch (aiError) {
      console.error("AI request failed:", aiError);

      // Try fallback if Groq failed and Gemini is available
      if (useGroq && geminiModel) {
        console.log("Groq failed, trying Gemini fallback...");
        try {
          const result = await geminiModel.generateContent(prompt);
          const response = await result.response;
          text = response.text();
          aiModelUsed = "Gemini 2.5 Flash (fallback)";
          console.log("Successfully received response from Gemini fallback");
        } catch (fallbackError) {
          console.error("Both AI models failed:", fallbackError);
          return NextResponse.json(
            {
              error: "Failed to generate content with AI models",
              details: `Groq error: ${aiError instanceof Error ? aiError.message : "Unknown"}, Gemini error: ${fallbackError instanceof Error ? fallbackError.message : "Unknown"}`,
              models_tried: ["Groq GPT-OSS-120B", "Gemini 2.5 Flash"],
            },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          {
            error: "Failed to generate content with AI model",
            details:
              aiError instanceof Error ? aiError.message : "Unknown error",
            model_used: useGroq ? "Groq GPT-OSS-120B" : "Gemini 2.5 Flash",
          },
          { status: 500 }
        );
      }
    }

    console.log(`Received response from ${aiModelUsed}, parsing...`);
    // Parse the response to extract structured data
    const parsedResult = parseMythbustingResponse(text, query, evidenceSources);

    console.log("Mythbusting analysis completed:", parsedResult.verdict);
    console.log("Returning evidenceSources:", evidenceSources);
    return NextResponse.json({
      ...parsedResult,
      evidenceSources: evidenceSources,
      aiModelUsed: aiModelUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Mythbusting error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze claim",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function parseMythbustingResponse(
  response: string,
  query: string,
  evidenceSources: Array<{ title: string; url: string; snippet: string }>
) {
  // Enhanced structure with conclusion section
  let verdict:
    | "true"
    | "false"
    | "misleading"
    | "unverified"
    | "partially_true"
    | "context_dependent" = "unverified";
  let summary = "প্রশ্নের উত্তর বিশ্লেষণ করা হয়েছে।";
  let detailedAnalysis = response;
  let conclusion = "";
  let keyTakeaways: string[] = [];
  let sources: string[] = [];

  try {
    // Try to extract verdict
    const verdictMatch = response.match(
      /VERDICT:\s*(true|false|misleading|unverified|partially_true|context_dependent)/i
    );
    if (verdictMatch) {
      verdict = verdictMatch[1].toLowerCase() as any;
    }

    // Try to extract summary - ensure it's brief (2-3 sentences max)
    const summaryMatch = response.match(/SUMMARY:\s*(.+?)/is);
    if (summaryMatch) {
      summary = summaryMatch[1].trim();

      // Ensure summary is brief - truncate if too long
      if (summary.length > 200) {
        const sentences = summary.split(/[.!?]+/);
        summary = sentences.slice(0, 2).join(". ").trim() + ".";
      }
    }

    // Try to extract detailed analysis
    const analysisMatch = response.match(
      /DETAILED_ANALYSIS:\s*(.+?)(?=\nCONCLUSION:|$)/is
    );
    if (analysisMatch) {
      detailedAnalysis = analysisMatch[1].trim();
    }

    // Try to extract conclusion
    const conclusionMatch = response.match(
      /CONCLUSION:\s*(.+?)(?=\nKEY_TAKEAWAYS:|$)/is
    );
    if (conclusionMatch) {
      conclusion = conclusionMatch[1].trim();
    }

    // Try to extract key takeaways
    const takeawaysMatch = response.match(
      /KEY_TAKEAWAYS:\s*(.+?)(?=\nSOURCES:|$)/is
    );
    if (takeawaysMatch) {
      const takeawaysText = takeawaysMatch[1].trim();
      keyTakeaways = takeawaysText
        .split("\n")
        .filter((takeaway) => takeaway.trim().length > 0);
    }

    // Try to extract sources and format them properly with hyperlinks
    const sourcesMatch = response.match(/SOURCES:\s*(.+?)(?=\n|$)/is);
    if (sourcesMatch) {
      const sourcesText = sourcesMatch[1].trim();
      const sourceLines = sourcesText.split("\n").filter((line) => line.trim());

      // Format sources with proper hyperlinks
      sources = sourceLines.map((line) => {
        // Check if line already has URL format
        if (line.includes(" - [") && line.includes("]")) {
          return line; // Already formatted
        } else if (line.includes(" - ")) {
          // Format: "Title - URL" -> "Title - [URL]"
          const parts = line.split(" - ");
          if (parts.length === 2) {
            return `${parts[0].trim()} - [${parts[1].trim()}]`;
          }
        } else if (line.startsWith("http")) {
          // Just URL, create generic title
          return `Source - [${line.trim()}]`;
        }
        return line;
      });
    }

    // If no structured format found, try to extract URLs
    if (sources.length === 0) {
      const urlMatches = response.match(/https?:\/\/[^\s\n]+/g);
      if (urlMatches) {
        sources = urlMatches.slice(0, 8); // Limit to 8 sources
      }
    }

    // If still no sources found, use evidence sources as fallback
    if (sources.length === 0 && evidenceSources.length > 0) {
      sources = evidenceSources.map(
        (source) => `${source.title} - ${source.url}`
      );
    }

    // Ensure we have at least 8 sources by adding fallback sources if needed
    if (sources.length < 8) {
      const fallbackSources = [
        "Scientific American - https://www.scientificamerican.com",
        "PubMed - https://pubmed.ncbi.nlm.nih.gov",
        "Nature - https://www.nature.com",
        "Science Magazine - https://www.science.org",
        "World Health Organization - https://www.who.int",
        "NASA - https://www.nasa.gov",
        "National Geographic - https://www.nationalgeographic.com",
        "BBC Science - https://www.bbc.com/news/science_and_environment",
      ];

      const additionalSources = fallbackSources.slice(0, 8 - sources.length);
      sources = [...sources, ...additionalSources];
    }

    // If no key takeaways found, generate some based on the analysis
    if (keyTakeaways.length === 0) {
      keyTakeaways = [
        "প্রমাণের উপর ভিত্তি করে সিদ্ধান্ত নিন",
        "বিভিন্ন দৃষ্টিকোণ থেকে চিন্তা করুন",
        "নতুন তথ্য পাওয়া গেলে মত পরিবর্তন করতে প্রস্তুত থাকুন",
      ];
    }

    // If no conclusion found, create a simple one
    if (!conclusion) {
      conclusion =
        "উপরের বিশ্লেষণ থেকে দেখা যায় যে এই দাবিটি মূলত সত্য/মিথ্যা/অর্ধসত্য। তবে এখানে গুরুত্বপূর্ণ বিষয় হলো প্রমাণের উপর ভিত্তি করে সিদ্ধান্ত নেওয়া।";
    }
  } catch (parseError) {
    console.error("Error parsing mythbusting response:", parseError);
    // Keep default values if parsing fails
  }

  return {
    query,
    verdict,
    summary,
    detailedAnalysis,
    conclusion,
    keyTakeaways,
    sources,
  };
}
