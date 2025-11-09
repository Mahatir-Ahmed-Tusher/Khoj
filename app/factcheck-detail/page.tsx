"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ShareModal from "@/components/ShareModal";
import { useQuery } from "convex/react";
import {
  Loader2,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Share2,
} from "lucide-react";
import { addAIFactCheck } from "@/lib/ai-factcheck-utils";
import { getVerdictLabel, normalizeVerdict, VerdictValue } from "@/lib/utils";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";
import { useSearchLimit } from "@/lib/hooks/useSearchLimit";
import SearchLimitModal from "@/components/SearchLimitModal";
import GenkitAudioPlayer from "@/components/GenkitAudioPlayer";
//import convex
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import Loading from "@/components/Loading";

interface FactCheckReport {
  claim: string;
  report: string;
  verdict: VerdictValue;
  sources: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
    language?: string;
  }>;
  relatedArticles?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    verdict: VerdictValue;
    publishedAt: string;
    author: string;
    tags: string[];
    thumbnail?: string;
  }[];
  sourceInfo?: {
    hasBengaliSources: boolean;
    hasEnglishSources: boolean;
    totalSources: number;
  };
  generatedAt: string;
}

function FactCheckDetailContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  const createFactCheck = useMutation(api.factChecks.create);

  // Only run the query if we have a query string
  const queryArgs = query ? { query } : "skip";
  console.log("Query Args:", queryArgs); // Debug log

  const existingFactCheck = useQuery(api.factChecks.getByQuery, queryArgs);

  console.log("Existing FactCheck State:", {
    isUndefined: existingFactCheck === undefined,
    isError: existingFactCheck instanceof Error,
    value: existingFactCheck,
  });

  // Handle loading and error states from the query
  const isQueryLoading = existingFactCheck === undefined;
  const hasQueryError = existingFactCheck instanceof Error;
  const [report, setReport] = useState<FactCheckReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  // Share modal controller
  const [showShareModal, setShowShareModal] = useState(false);
  const hasPerformedFactCheck = useRef(false);
  //getting the url from window

  const [url, setUrl] = useState("");

  const { canSearch, recordSearch, loginWithGoogle, remainingSearches } =
    useSearchLimit();

  const performFactCheck = useCallback(
    async (searchQuery: string) => {
      if (!canSearch()) {
        setShowLimitModal(true);
        return;
      }

      const searchRecorded = recordSearch(searchQuery, "factcheck");
      if (!searchRecorded) {
        setShowLimitModal(true);
        return;
      }

      // Check if fact-check already exists in Convex
      if (existingFactCheck === undefined) {
        console.log("Query is still loading...");
        return; // Wait for the query to complete
      }

      if (existingFactCheck instanceof Error) {
        console.log("Query error:", existingFactCheck);
        // Continue with API call as fallback
      } else if (existingFactCheck) {
        console.log("Found existing fact check:", existingFactCheck);
        const existingReport = {
          claim: searchQuery,
          report: existingFactCheck.result,
          verdict: normalizeVerdict(existingFactCheck.verdict),
          sources: existingFactCheck.sources,
          sourceInfo: existingFactCheck.sourceInfo,
          generatedAt: existingFactCheck.generatedAt,
          relatedArticles: (existingFactCheck as any)?.relatedArticles,
        };
        setReport(existingReport);
        // Scroll to top when loading existing report
        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0);
        return;
      }

      setIsLoading(true);
      setError("");
      console.log(query);
      console.log(existingFactCheck);

      try {
        const response = await fetch("/api/factcheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (!response.ok) {
          throw new Error("ফ্যাক্ট চেকিং রিপোর্ট তৈরি করতে সমস্যা হয়েছে");
        }

        const data = await response.json();
        const normalizedData: FactCheckReport = {
          ...data,
          claim: searchQuery,
          verdict: normalizeVerdict(data.verdict),
          sources: data.sources || [],
        };

        setReport(normalizedData);

        if (data.verdict) {
          await addAIFactCheck(
            searchQuery,
            data.report,
            data.verdict,
            data.sources,
            data.sourceInfo,
            createFactCheck
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "একটি ত্রুটি ঘটেছে");
      } finally {
        setIsLoading(false);
      }
    },
    [canSearch, recordSearch, createFactCheck, existingFactCheck]
  );

  useEffect(() => {
    if (
      query &&
      !hasPerformedFactCheck.current &&
      existingFactCheck !== undefined
    ) {
      // Only proceed if the query has finished loading
      hasPerformedFactCheck.current = true;
      performFactCheck(query);
    }
  }, [query, performFactCheck, existingFactCheck]);

  // Scroll to top when report is generated (prevents auto-scroll to bottom)
  useEffect(() => {
    if (report && !isLoading) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [report, isLoading]);

  const downloadReport = () => {
    if (!report) return;

    const content = `
Khoj ফ্যাক্ট চেকার রিপোর্ট
========================

দাবি: ${report.claim}
তৈরির তারিখ: ${new Date(report.generatedAt).toLocaleString("bn-BD")}

${report.report}

উৎসসমূহ:
${report.sources.map((source) => `${source.id}. ${source.title} - ${source.url}`).join("\n")}

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।

================================================================================
Generated by Khoj - The first ever bengali AI based fact checker
================================================================================
     `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // Format date for filename: YYYY-MM-DD
    const dateStr = new Date(report.generatedAt).toISOString().split("T")[0];
    a.download = `Khoj-factcheck-report-${dateStr}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const getVerdictIcon = (verdict?: string | null) => {
    switch (normalizeVerdict(verdict)) {
      case "true":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "false":
        return <XCircle className="h-6 w-6 text-red-600" />;
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
    }
  };

  // Process the report HTML to remove English text in parentheses after verdict words
  const processReportHtml = (html: string) => {
    let processedHtml = html;

    // Remove English text in parentheses after verdict words
    // Match "সত্য (TRUE)", "সত্য(TRUE)", "সত্য (True)", etc. and keep only "সত্য"
    processedHtml = processedHtml.replace(
      /(সত্য)\s*\(?(TRUE|True|true)\)?/gi,
      "$1"
    );

    // Match "অসত্য (FALSE)", "মিথ্যা(FALSE)", "অসত্য (False)", etc. and keep only অসত্য
    processedHtml = processedHtml.replace(
      /(মিথ্যা)\s*\(?(FALSE|False|false)\)?/gi,
      "অসত্য"
    );

    // Match "অযাচাইকৃত (UNVERIFIED)", etc. and keep only "অযাচাইকৃত"
    processedHtml = processedHtml.replace(
      /(অযাচাইকৃত)\s*\(?(UNVERIFIED|Unverified|unverified)\)?/gi,
      "বিভ্রান্তিকর"
    );

    // Match "ভ্রান্ত (MISLEADING)", etc. and keep only "ভ্রান্ত"
    processedHtml = processedHtml.replace(
      /(ভ্রান্ত)\s*\(?(MISLEADING|Misleading|misleading)\)?/gi,
      "বিভ্রান্তিকর"
    );

    // Normalize verdict terminology
    processedHtml = processedHtml.replace(/\b(TRUE|True|true)\b/g, "সত্য");
    processedHtml = processedHtml.replace(
      /\b(FALSE|False|false|UNTRUE|Untrue|untrue)\b/g,
      "অসত্য"
    );
    processedHtml = processedHtml.replace(
      /\b(UNVERIFIED|Unverified|unverified|MISLEADING|Misleading|misleading)\b/g,
      "বিভ্রান্তিকর"
    );
    processedHtml = processedHtml.replace(/মিথ্যা/gi, "অসত্য");
    processedHtml = processedHtml.replace(/অযাচাইকৃত/g, "বিভ্রান্তিকর");
    processedHtml = processedHtml.replace(/ভ্রান্তিমূলক/g, "বিভ্রান্তিকর");
    processedHtml = processedHtml.replace(/ভ্রান্ত(?!িকর)/g, "বিভ্রান্তিকর");

    return processedHtml;
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ফ্যাক্ট চেকিং এর জন্য একটি দাবি লিখুন
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Search Bar Section */}
          <div className="mb-8 relative rounded-lg overflow-hidden">
            {/* Background Image with Dark Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('https://i.postimg.cc/L8pTdzF0/khoj-2.png'), url('/khoj-2.png')`,
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 md:p-12">
              <div className="text-center mb-6">
                <h1 className="text-lg md:text-2xl font-bold text-white mb-2 font-tiro-bangla drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                  নতুন ফ্যাক্ট চেক করুন
                </h1>
                <p className="text-base md:text-lg text-white font-tiro-bangla drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  যেকোনো দাবি বা তথ্য যাচাই করুন
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <SearchBar
                  placeholder="কী নিয়ে যাচাই করতে চান তা লিখে ফেলুন..."
                  className="mb-4"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
              বিস্তারিত ফ্যাক্ট চেকিং রিপোর্ট
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              "{query}" এর জন্য বিস্তারিত বিশ্লেষণ
            </p>
          </div>

          {/* Loading State */}
          {(isLoading || isQueryLoading) && <Loading />}

          {/* Error State */}
          {(error || hasQueryError) && (
            <div className="card text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ত্রুটি ঘটেছে
              </h3>
              <p className="text-gray-600">
                {hasQueryError ? "ডাটাবেস থেকে তথ্য আনতে সমস্যা হয়েছে" : error}
              </p>
            </div>
          )}

          {/* Report */}
          {!isLoading && !error && report && (
            <div className="space-y-8">
              {/* Report Header */}
              <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary-600">
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {getVerdictIcon(report.verdict)}
                  <div>
                      <h2 className="text-base md:text-xl font-bold text-gray-900">
                        ফ্যাক্ট চেকিং রিপোর্ট
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 font-tiro-bangla">
                        AI চালিত বিস্তারিত বিশ্লেষণ
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4" id="buttons">
                    <button
                      id="share-button"
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center bg-gray-100 text-black p-3 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={downloadReport}
                      className="flex items-center bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    দাবি:
                  </h3>
                  <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    {report.claim}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    তৈরির তারিখ:
                  </h3>
                  <p className="text-gray-600 bg-white px-4 py-2 rounded-lg inline-block">
                    {new Date(report.generatedAt).toLocaleString("bn-BD")}
                  </p>
                </div>
              </div>

              {/* Detailed Report */}
              <div className="card bg-white shadow-lg border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex-shrink-0">
                      বিস্তারিত বিশ্লেষণ:
                    </h3>
                    {/* Audio Player and Options Menu - Desktop only beside title */}
                    <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <GenkitAudioPlayer
                        text={sanitizeHtml(parseMarkdown(report.report))}
                        filename={`Khoj-factcheck-report-${new Date(report.generatedAt).toISOString().split("T")[0]}.mp3`}
                      />
                    </div>
                  </div>
                  {/* Mobile: Show buttons below title */}
                  <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
                    <GenkitAudioPlayer
                      text={sanitizeHtml(parseMarkdown(report.report))}
                      filename={`Khoj-factcheck-report-${new Date(report.generatedAt).toISOString().split("T")[0]}.mp3`}
                    />
                  </div>
                </div>
                <div className="prose prose-lg max-w-none report-content">
                  <div
                    className="text-gray-700 leading-relaxed text-base text-justify"
                    dangerouslySetInnerHTML={{
                      __html: processReportHtml(
                        sanitizeHtml(parseMarkdown(report.report))
                      ),
                    }}
                  />
                </div>
              </div>

              {/* Sources */}
              {report.sources.length > 0 && (
                <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    উৎসসমূহ:
                  </h3>

                  {/* Source Info */}
                  {report.sourceInfo && (
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-700 font-medium">
                            মোট উৎস:
                          </span>
                          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {report.sourceInfo.totalSources}টি
                          </span>
                        </div>
                        {report.sourceInfo.hasBengaliSources && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-700 font-medium">
                              বাংলা উৎস:
                            </span>
                            <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              ✓ পাওয়া গেছে
                            </span>
                          </div>
                        )}
                        {report.sourceInfo.hasEnglishSources && (
                          <div className="flex items-center space-x-2">
                            <span className="text-orange-700 font-medium">
                              ইংরেজি উৎস:
                            </span>
                            <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                              ✓ ব্যবহার করা হয়েছে
                            </span>
                          </div>
                        )}
                      </div>
                      {report.sourceInfo.hasEnglishSources && (
                        <p className="text-blue-600 text-sm mt-3 p-3 bg-blue-50 rounded-lg">
                          💡 বাংলায় পর্যাপ্ত তথ্য না থাকায় ইংরেজি উৎস থেকে
                          তথ্য সংগ্রহ করে বাংলায় অনুবাদ করা হয়েছে।
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    {report.sources.map((source) => (
                      <div
                        key={source.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {source.id}. {source.title}
                              </h4>
                              {source.language && (
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    source.language === "English"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {source.language === "English"
                                    ? "ইংরেজি"
                                    : "বাংলা"}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {source.snippet}
                            </p>
                          </div>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-2 ml-4 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                          >
                            <span>উৎস দেখুন</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {report.relatedArticles && report.relatedArticles.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    সম্পর্কিত নিবন্ধসমূহ:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {report.relatedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-32 mb-3 rounded overflow-hidden">
                          <img
                            src={article.thumbnail || "/khoj.png"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Title Overlay with Shadow - Mobile Only */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:hidden"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
                            <h4 className="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-2">
                              {article.title}
                            </h4>
                          </div>
                          <div className="absolute top-2 left-2">
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                normalizeVerdict(article.verdict) === "true"
                                  ? "bg-green-100 text-green-800"
                                  : normalizeVerdict(article.verdict) === "false"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {getVerdictLabel(article.verdict)}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 hidden md:block">
                            <a
                              href={`/factchecks/${article.slug}`}
                              className="hover:text-primary-600 transition-colors"
                            >
                              {article.title}
                            </a>
                          </h4>

                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            {article.summary}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{article.author}</span>
                            <span>
                              {new Date(article.publishedAt).toLocaleDateString(
                                "bn-BD"
                              )}
                            </span>
                          </div>

                          <div className="mt-2">
                            <a
                              href={`/factchecks/${article.slug}`}
                              className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                            >
                              পড়ুন →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={url}
        />

        <SearchLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          onLogin={loginWithGoogle}
          remainingSearches={remainingSearches}
        />
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default function FactCheckDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">লোড হচ্ছে...</p>
          </div>
        }
      >
        <FactCheckDetailContent />
      </Suspense>
      <Footer />
    </div>
  );
}
