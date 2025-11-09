import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";
import {
  searchWithRapidAPIFallback,
  searchWithRapidAPIFallbackAlternative,
} from "@/lib/rapidapi-manager";
import { normalizeVerdict, type VerdictValue } from "@/lib/utils";

const MAX_SOURCES = 16;
const RAPID_API_RESULT_LIMIT = 40;
const MIN_REFERENCE_COUNT = 10;

const isBanglaText = (text: string) => /[\u0980-\u09FF]/.test(text || "");

const getHostname = (url: string) => {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    return parsed.hostname.toLowerCase();
  } catch (error) {
    return "";
  }
};

const normalizeUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.replace(/^www\./, "").toLowerCase()}${parsed.pathname.replace(/\/$/, "")}`;
  } catch (error) {
    return url.trim().toLowerCase();
  }
};

const RESTRICTED_DOMAINS = [
  "facebook.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "instagram.com",
  "quora.com",
  "reddit.com",
  "whatsapp.com",
  "telegram.org",
  "youtube.com",
  "blogspot.com",
];

const isRestrictedDomain = (hostname: string) =>
  RESTRICTED_DOMAINS.some((domain) => hostname.endsWith(domain));

const cleanText = (text: string) =>
  (text || "")
    .replace(/\s+/g, " ")
    .replace(/\[[0-9]+\]/g, "")
    .trim();

async function searchRapidApiForEvidence(query: string) {
  let searchResults = await searchWithRapidAPIFallback(query, RAPID_API_RESULT_LIMIT);

  if (!searchResults) {
    searchResults = await searchWithRapidAPIFallbackAlternative(query, 15);
  }

  if (!searchResults?.results?.length) {
    return [];
  }

  const seen = new Set<string>();

  return searchResults.results
    .map((result: any) => {
      const url = result.url || result.link || result.href || "";
      const title = cleanText(result.title || result.name || "Unknown");
      const snippet = cleanText(result.snippet || result.description || result.excerpt || "");

      if (!url || !title || seen.has(url)) {
        return null;
      }

      const hostname = getHostname(url);
      if (!hostname || hostname.startsWith("bn.")) {
        return null;
      }

      if (isRestrictedDomain(hostname)) {
        return null;
      }

      const isEnglish = !isBanglaText(title + " " + snippet);

      if (!isEnglish) {
        return null;
      }

      seen.add(url);

      return {
        title,
        url,
        snippet,
        isEnglish,
      };
    })
    .filter(Boolean)
    .slice(0, 40) as Array<{
    title: string;
    url: string;
    snippet: string;
    isEnglish: boolean;
  }>;
}

async function fetchArticleContent(url: string) {
  try {
    const jinaUrl = `https://r.jina.ai/${url.startsWith("http") ? url : `https://${url}`}`;
    const response = await fetch(jinaUrl, { next: { revalidate: 60 } });

    if (!response.ok) {
      return "";
    }

    const text = await response.text();
    return cleanText(text).slice(0, 6000);
  } catch (error) {
    console.error("Failed to fetch article content:", url, error);
    return "";
  }
}

async function buildEvidenceCorpus(query: string) {
  const candidates = await searchRapidApiForEvidence(query);

  const corpus: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    content: string;
    isEnglish: boolean;
  }> = [];

  for (const candidate of candidates) {
    if (corpus.length >= MAX_SOURCES) {
      break;
    }

    const content = await fetchArticleContent(candidate.url);

    if (!content || content.length < 300) {
      continue;
    }

    corpus.push({
      id: corpus.length + 1,
      title: candidate.title,
      url: candidate.url,
      snippet: candidate.snippet,
      content,
      isEnglish: candidate.isEnglish,
    });
  }

  return corpus;
}

function buildEvidenceContext(
  evidence: ReturnType<typeof buildEvidenceCorpus> extends Promise<infer T>
    ? T
    : never
) {
  if (!evidence.length) {
    return "\n\n**EVIDENCE:**\n- No trustworthy sources were retrieved. Provide an unverified conclusion and explain the lack of evidence.";
  }

  const lines = evidence
    .map(
      (source) =>
        `[${source.id}] ${source.title}\nURL: ${source.url}\nSnippet: ${source.snippet.slice(0, 500)}\nExtract: ${source.content.slice(0, 1000)}\n`
    )
    .join("\n");

  return `\n\n**EVIDENCE (Use these sources when citing with [n]):**\n${lines}`;
}

function createModelPrompt(
  query: string,
  evidence: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    content: string;
    isEnglish: boolean;
  }>
) {
  const evidenceContext = buildEvidenceContext(evidence);

  const sourcesList = evidence
    .map((source) => `- [${source.id}] ${source.title} (${source.url})`)
    .join("\n");

  return `You are a meticulous fact-checking analyst. Follow every instruction below exactly. Write the entire report in fluent, reader-friendly Bengali while keeping the structure identical to the template. The body of the report must contain only paragraphs (no bullet lists or tables). Use only the supplied evidence plus trustworthy internal knowledge—never invent data or sources.

FORMAT TEMPLATE (all headings and paragraph text must remain in Bengali):

# 🧠 মিথবাস্টিং রিপোর্ট

## ১. দাবি (Claim)
Write one or two paragraphs that clearly restate the claim in Bengali.

## ২. প্রেক্ষাপট (Context)
Describe where, when, and how the claim spread in Bengali paragraphs.

## ৩. সংক্ষিপ্ত ফলাফল (Fact-Check Summary)
✅ রায় (Verdict): সত্য (True) / অসত্য (False) / বিভ্রান্তিকর (Unverified)
Explain the reasoning for the verdict in two to three full Bengali paragraphs. Do NOT place reference numbers inside the body text.

## ৪. বিশ্লেষণ (Analysis)
### ৪.১ বৈজ্ঞানিক ব্যাখ্যা
Provide at least two Bengali paragraphs summarizing scientific research or evidence.
### ৪.২ সাধারণ ভুল ধারণা
Provide at least two Bengali paragraphs explaining why people believe the claim and what reality shows.
### ৪.৩ বিশেষজ্ঞ মতামত
Provide at least two Bengali paragraphs quoting or summarizing international experts or institutions.

## ৫. উপসংহার (Conclusion)
Summarize the overall findings and give reader guidance in Bengali paragraphs.

## ৬. Reference Box
List at least ${MIN_REFERENCE_COUNT} credible international/English sources, one per line, using the exact format "[ক্রমিক] উৎসের শিরোনাম - https://example.com". Links must be official publications (no social media, forums, or personal blogs). Do not reference them inline within the report body.

CRITICAL INSTRUCTIONS:
- Output everything (headings and paragraphs) in polished Bengali, but keep the template text exactly as shown.
- Verdict must be one of: সত্য (True), অসত্য (False), or বিভ্রান্তিকর (Unverified).
- Only #, ##, ### headings may be used; do not add other heading levels.
- Absolutely no bullet lists, numbered lists, or tables inside the report body.
- If fewer than ${MIN_REFERENCE_COUNT} qualifying sources exist, explain that clearly and set the verdict to বিভ্রান্তিকর (Unverified).
- Reject any social-media or user-generated sites.

Claim: ${query}
${evidenceContext}

Available evidence sources (use these for the Reference Box only):
${sourcesList}`;
}

function createKnowledgePrompt(query: string) {
  return `You are an expert science communicator. No dependable external search results were retrieved, so rely on vetted internal knowledge and well-established international science sources. Produce the full report in elegant Bengali while exactly following the template below. Never fabricate institutions or links; only cite real, authoritative publications with working URLs.

FORMAT TEMPLATE (all headings and paragraphs must remain in Bengali):

# 🧠 মিথবাস্টিং রিপোর্ট

## ১. দাবি (Claim)
Restate the claim in one or two Bengali paragraphs.

## ২. প্রেক্ষাপট (Context)
Describe the discussion context and any evidence gaps in Bengali paragraphs.

## ৩. সংক্ষিপ্ত ফলাফল (Fact-Check Summary)
**✅ রায় (Verdict):** সত্য (True) / অসত্য (False) / বিভ্রান্তিকর (Unverified)
Provide at least two Bengali paragraphs that justify the verdict scientifically. Do not place reference markers inside the text.

## ৪. বিশ্লেষণ (Analysis)
### ৪.১ বৈজ্ঞানিক ব্যাখ্যা
Summarize the scientific consensus in detailed Bengali paragraphs.
### ৪.২ সাধারণ ভুল ধারণা
Explain why the myth persists and how to correct it, using Bengali paragraphs.
### ৪.৩ বিশেষজ্ঞ মতামত
Summarize international expert or institutional statements in Bengali paragraphs.

## ৫. উপসংহার (Conclusion)
Offer a concise Bengali summary and guidance for readers.

## ৬. Reference Box
List at least ${MIN_REFERENCE_COUNT} authoritative global sources, each as "[ক্রমিক] উৎসের শিরোনাম - https://example.com". Only use official institutional or peer-reviewed links—no social media or informal blogs.

CRITICAL INSTRUCTIONS:
- Keep the entire narrative in polished Bengali while following the template literally.
- Verdict must be one of: সত্য (True), অসত্য (False), বিভ্রান্তিকর (Unverified).
- Do not include bullets, numbered lists, or tables in the report body.
- References appear only in the Reference Box and each must be a valid, verifiable hyperlink.
- If sufficient sources are unavailable, state that clearly and set the verdict to বিভ্রান্তিকর (Unverified).

Claim: ${query}`;
}

async function generateStructuredReport(
  query: string,
  evidence: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    content: string;
    isEnglish: boolean;
  }>
) {
  const prompt = createModelPrompt(query, evidence);

  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;

  if (!groqApiKey && !geminiApiKey) {
    throw new Error("No AI API keys configured");
  }

  const tryGroq = async () => {
    if (!groqApiKey) return null;
    try {
      const client = new Groq({ apiKey: groqApiKey });
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 6000,
      });
      return completion.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error("Groq generation failed:", error);
      return null;
    }
  };

  const tryGemini = async () => {
    if (!geminiApiKey) return null;
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text() || null;
    } catch (error) {
      console.error("Gemini generation failed:", error);
      return null;
    }
  };

  return (await tryGroq()) || (await tryGemini());
}

async function generateKnowledgeFallbackReport(query: string) {
  const prompt = createKnowledgePrompt(query);

  const groqApiKey = process.env.GROQ_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;

  if (!groqApiKey && !geminiApiKey) {
    throw new Error("No AI API keys configured");
  }

  const tryGroq = async () => {
    if (!groqApiKey) return null;
    try {
      const client = new Groq({ apiKey: groqApiKey });
      const completion = await client.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 6000,
      });
      return completion.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error("Groq knowledge fallback failed:", error);
      return null;
    }
  };

  const tryGemini = async () => {
    if (!geminiApiKey) return null;
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text() || null;
    } catch (error) {
      console.error("Gemini knowledge fallback failed:", error);
      return null;
    }
  };

  return (await tryGroq()) || (await tryGemini());
}

function parseStructuredReport(
  report: string,
  evidence: Array<{ id: number; title: string; url: string; snippet?: string }>
) {
  const fullReport = report.trim();

  const verdictMatch = fullReport.match(/✅\s*রায়\s*\(Verdict\)\s*:\s*([^\n]+)/);
  const verdictRaw = verdictMatch ? verdictMatch[1].trim() : "";
  const verdict = normalizeVerdict(verdictRaw);

  const summarySectionMatch = fullReport.match(/## ৩\. সংক্ষিপ্ত ফলাফল[\s\S]*?(?=## ৪\.)/);
  const summary = summarySectionMatch
    ? summarySectionMatch[0]
        .replace(/## ৩\. সংক্ষিপ্ত ফলাফল[\s\S]*?\n/, "")
        .trim()
    : "";

  const conclusionSectionMatch = fullReport.match(/## ৫\. উপসংহার[\s\S]*?(?=## ৬\.)/);
  const conclusion = conclusionSectionMatch
    ? conclusionSectionMatch[0]
        .replace(/## ৫\. উপসংহার[\s\S]*?\n/, "")
        .trim()
    : "";

  const referencesStart = fullReport.indexOf("## ৬. Reference Box");
  const referencesSection = referencesStart !== -1 ? fullReport.slice(referencesStart).trim() : "";
  const reportWithoutReferences = referencesStart !== -1 ? fullReport.slice(0, referencesStart).trim() : fullReport;

  const referenceLines = referencesSection
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("["));

  const structuredSources = referenceLines
    .map((line, index) => {
      const match = line.match(/^\[(\d+)\]\s*(.*?)\s*-\s*(https?:\/\/\S+)/i);
      const id = match ? Number(match[1]) : index + 1;
      const title = match ? match[2].trim() : line.replace(/^\[\d+\]\s*/, "").split(" - ")[0]?.trim();
      const url = match ? match[3].trim() : line.split(" - ")[1]?.trim();

      if (!url) {
        return null;
      }

      const evidenceMatch = evidence.find(
        (source) => normalizeUrl(source.url) === normalizeUrl(url)
      );

      return {
        id,
        title: title || evidenceMatch?.title || `Source ${id}`,
        url,
        snippet: evidenceMatch?.snippet || "",
        language: "English",
      };
    })
    .filter(Boolean) as Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    language: string;
  }>;

  const fallbackSources = evidence.map((source) => ({
    id: source.id,
    title: source.title,
    url: source.url,
    snippet: source.snippet || "",
    language: "English",
  }));

  const sources = structuredSources.length ? structuredSources : fallbackSources;

  return {
    report: reportWithoutReferences,
    verdict,
    summary,
    conclusion,
    sources,
  };
}

export async function GET() {
  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY;

    return NextResponse.json({
      status: "Mythbusting API is working",
      message: "Use POST method with query parameter to analyze claims",
      groqAvailable: !!groqApiKey,
      geminiAvailable: !!geminiApiKey,
    });
  } catch (error) {
    return NextResponse.json({
      status: "Mythbusting API encountered an issue",
      error: (error as Error).message,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const evidence = await buildEvidenceCorpus(query);
    let usedKnowledgeFallback = false;

    let aiReport = "";

    if (evidence.length === 0) {
      const knowledgeReport = await generateKnowledgeFallbackReport(query);
      if (!knowledgeReport) {
        throw new Error("Knowledge fallback generation failed");
      }
      aiReport = knowledgeReport;
      usedKnowledgeFallback = true;
    } else {
      const generatedReport = await generateStructuredReport(query, evidence);
      if (!generatedReport) {
        throw new Error("AI generation failed");
      }
      aiReport = generatedReport;
    }

    let parsed = parseStructuredReport(aiReport, evidence);

    if (parsed.sources.length < MIN_REFERENCE_COUNT) {
      const knowledgeReport = await generateKnowledgeFallbackReport(query);
      if (knowledgeReport) {
        parsed = parseStructuredReport(knowledgeReport, []);
        aiReport = knowledgeReport;
        usedKnowledgeFallback = true;
      }
    }

    const responsePayload = {
      report: parsed.report,
      verdict: parsed.verdict,
      summary: parsed.summary,
      conclusion: parsed.conclusion,
      sources: parsed.sources,
      result: parsed.report,
      response: parsed.report,
      detailedAnalysis: parsed.report,
      evidenceSources: parsed.sources,
      aiModelUsed: usedKnowledgeFallback ? "AI-knowledge" : "AI",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error("Mythbusting error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate mythbusting report",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}