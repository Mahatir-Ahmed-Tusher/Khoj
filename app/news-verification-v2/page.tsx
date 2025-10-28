"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Info, Download } from "lucide-react";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";

interface NewsVerificationResult {
  success: boolean;
  verdict: "true" | "false" | "misleading";
  confidence: number;
  claim: string;
  report: string;
  sources: Array<{
    id: number;
    title: string;
    url: string;
    snippet: string;
  }>;
  originalUrl: string;
  scrapedTitle: string;
  scrapedDomain: string;
}

export default function NewsVerificationV2Page() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NewsVerificationResult | null>(null);
  const [error, setError] = useState("");
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Get URL from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlFromParams = urlParams.get("url");

    if (urlFromParams) {
      setUrl(decodeURIComponent(urlFromParams));
      // Auto-start verification
      setTimeout(() => {
        handleVerification(decodeURIComponent(urlFromParams));
      }, 500);
    }
  }, []);

  const downloadReport = () => {
    if (!result) return;

    const getVerdictText = (verdict: string) => {
      switch (verdict) {
        case "true":
          return "সত্য";
        case "false":
          return "মিথ্যা";
        case "misleading":
          return "ভ্রান্ত তথ্য";
        default:
          return "অযাচাইকৃত";
      }
    };

    const getConfidenceText = (confidence: number) => {
      if (confidence >= 80) return "উচ্চ";
      if (confidence >= 60) return "মধ্যম";
      return "নিম্ন";
    };

    // Create a clean text version of the report (removing HTML tags)
    const cleanReport = result.report.replace(/<[^>]*>/g, '');
    
    const reportContent = `
═══════════════════════════════════════════════════════════════
                    নিউজ যাচাই রিপোর্ট
                Khoj - Fact Checker Report
═══════════════════════════════════════════════════════════════

নিউজ URL: ${result.originalUrl}
শিরোনাম: ${result.claim}
ডোমেইন: ${result.scrapedDomain}

═══════════════════════════════════════════════════════════════
ফলাফল (Verdict): ${getVerdictText(result.verdict)}
আত্মবিশ্বাস (Confidence): ${getConfidenceText(result.confidence)} (${result.confidence}%)

═══════════════════════════════════════════════════════════════
বিস্তারিত রিপোর্ট (Detailed Report)
═══════════════════════════════════════════════════════════════

${cleanReport}

═══════════════════════════════════════════════════════════════
উৎসসমূহ (Sources)
═══════════════════════════════════════════════════════════════

${result.sources.map((source, index) => 
  `${index + 1}. ${source.title}\n   URL: ${source.url}\n   ${source.snippet}\n`
).join('\n')}

═══════════════════════════════════════════════════════════════
রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleString("bn-BD")}
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে
═══════════════════════════════════════════════════════════════
`;

    // Create a blob and download
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `খবর_যাচাই_রিপোর্ট_${date}.txt`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVerification = async (urlToCheck?: string) => {
    console.log("handleVerification called with URL:", urlToCheck);
    const urlToVerify = urlToCheck || url.trim();

    if (!urlToVerify) {
      setError("দয়া করে একটি নিউজ URL দিন");
      return;
    }

    // Validate URL
    // const urlPattern =
    //   /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    // if (!urlPattern.test(urlToVerify)) {
    //   setError("দয়া করে একটি বৈধ URL দিন");
    //   return;
    // }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      console.log(
        "Making API call to /api/news-verification-v2 with URL:",
        urlToVerify
      );
      const response = await fetch("/api/news-verification-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToVerify }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.errorBengali || data.error || "নিউজ যাচাই করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleVerification();
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "bg-green-100 text-green-800 border-green-200";
      case "false":
        return "bg-red-100 text-red-800 border-red-200";
      case "misleading":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "সত্য";
      case "false":
        return "মিথ্যা";
      case "misleading":
        return "ভ্রান্তিমূলক";
      default:
        return "অযাচাইকৃত";
    }
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return "উচ্চ";
    if (confidence >= 60) return "মাঝারি";
    return "নিম্ন";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-200">
            <img 
              src="https://i.postimg.cc/02ghqP5Z/image.png" 
              alt="News Verification Icon" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-tiro-bangla tracking-tight">
            খবর যাচাই
          </h1>
          <p className="text-lg text-gray-600 font-tiro-bangla">
            খবরের সত্যতা যাচাইয়ের দায়ভার দিন খোঁজ কে
          </p>
        </div>

        {/* Auto-check Status */}
        {isLoading && (
          <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-8 mb-8">
            <div className="text-center">
              {/* Animated News Icon */}
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
                  <span className="text-blue-600 text-2xl animate-pulse">📰</span>
                </div>
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 animate-ping"></div>
              </div>
              
              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-blue-800 mb-2 font-tiro-bangla">
                নিউজ যাচাই হচ্ছে...
              </h3>
              <p className="text-blue-700 font-tiro-bangla text-sm mb-4">
                অনুগ্রহ করে অপেক্ষা করুন
              </p>
              
              {/* Progress Steps */}
              <div className="space-y-2 text-sm text-blue-600 font-tiro-bangla">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>নিউজ আর্টিকেল পড়া হচ্ছে...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>সে খবরটি নিয়ে খোঁজ চালানো হচ্ছে...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>রিপোর্ট তৈরি করা হচ্ছে...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-tiro-bangla">
                নিউজ আর্টিকেলের URL দিন
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 bg-white/50 backdrop-blur-sm"
              />
              <p className="text-sm text-gray-500 mt-2 font-tiro-bangla">
                যে নিউজ আর্টিকেল যাচাই করতে চান তার লিংক দিন
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-tiro-bangla font-medium transition-all duration-200"
            >
              {isLoading ? "যাচাই হচ্ছে..." : "নিউজ যাচাই করুন"}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50/80 border border-red-200 rounded-xl">
              <p className="text-red-700 font-tiro-bangla text-sm">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 font-tiro-bangla">
                  যাচাইকরণ ফলাফল
                </h3>
                <button
                  onClick={downloadReport}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-tiro-bangla text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Original Article Info */}
                <div className="bg-white/50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 font-tiro-bangla">
                    মূল নিউজ আর্টিকেল:
                  </h4>
                  <p className="text-sm text-gray-700 font-tiro-bangla mb-1">
                    <strong>শিরোনাম:</strong> {result.scrapedTitle}
                  </p>
                  <p className="text-sm text-gray-700 font-tiro-bangla mb-1">
                    <strong>ডোমেইন:</strong> {result.scrapedDomain}
                  </p>
                  <a
                    href={result.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 font-tiro-bangla"
                  >
                    মূল আর্টিকেল দেখুন →
                  </a>
                </div>

                {/* Claim */}
                <div>
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    মূল দাবি:
                  </span>
                  <p className="text-gray-800 mt-1 font-tiro-bangla text-sm font-medium">
                    {result.claim}
                  </p>
                </div>

                {/* Verdict */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    ফলাফল:
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getVerdictColor(result.verdict)}`}
                  >
                    {getVerdictText(result.verdict)}
                  </span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    আত্মবিশ্বাস:
                  </span>
                  <span className="text-gray-800 font-medium text-sm">
                    {getConfidenceText(result.confidence)} ({result.confidence}
                    %)
                  </span>
                </div>

                {/* Report */}
                <div>
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    বিস্তারিত রিপোর্ট:
                  </span>
                  <div className="mt-2 p-4 bg-white/50 rounded-lg border border-gray-200">
                    <div 
                      className="prose prose-sm max-w-none text-gray-800 font-tiro-bangla leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(parseMarkdown(result.report)),
                      }}
                    />
                  </div>
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-tiro-bangla">
                      উৎসসমূহ:
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.sources.map((source) => (
                        <div
                          key={source.id}
                          className="bg-white/50 border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate flex-1"
                            >
                              {source.title}
                            </a>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 font-tiro-bangla">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Info Button - Only show the info button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors font-tiro-bangla"
            title="কিভাবে কাজ করে সম্পর্কে আরও জানুন"
          >
            <Info className="w-4 h-4" />
            <span>কিভাবে কাজ করে</span>
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-xl hover:from-gray-200 hover:to-slate-200 transition-all duration-200 font-tiro-bangla text-sm font-medium border border-gray-200"
          >
            ← মূল পৃষ্ঠায় ফিরে যান
          </Link>
        </div>
      </div>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 font-tiro-bangla">
                  কিভাবে কাজ করে
                </h3>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 font-tiro-bangla">HTTP Request</h4>
                  <p className="text-blue-700 text-sm font-tiro-bangla">
                    সরাসরি নিউজ সাইট থেকে কনটেন্ট নেয়।
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 font-tiro-bangla"> AI বিশ্লেষণ</h4>
                  <p className="text-green-700 text-sm font-tiro-bangla">
                    কৃত্রিম বুদ্ধিমত্তা দিয়ে কনটেন্ট বিশ্লেষণ করে। এটি নিউজের সত্যতা যাচাই করে এবং একটি বিস্তারিত রিপোর্ট তৈরি করে।
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2 font-tiro-bangla">অনুসন্ধান</h4>
                  <p className="text-purple-700 text-sm font-tiro-bangla">
                    অতিরিক্ত তথ্য খোঁজার জন্য বিভিন্ন উৎস থেকে তথ্য সংগ্রহ করে। এটি আরও সঠিক যাচাইকরণের জন্য প্রয়োজনীয়।
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2 font-tiro-bangla">রিপোর্ট</h4>
                  <p className="text-orange-700 text-sm font-tiro-bangla">
                    চূড়ান্ত ফ্যাক্ট চেক রিপোর্ট তৈরি করে যেখানে সত্যতা, আত্মবিশ্বাসের মাত্রা এবং উৎসসমূহ দেখানো হয়।
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-2 font-tiro-bangla">বিশেষত্ব</h4>
                  <ul className="text-gray-700 text-sm font-tiro-bangla space-y-1">
                    <li>• সরাসরি নিউজ সাইট থেকে তথ্য নেয়</li>
                    <li>• কৃত্রিম বুদ্ধিমত্ত দিয়ে বুদ্ধিদীপ্ত বিশ্লেষণ</li>
                    <li>• বাংলা ভাষায় ফলাফল</li>
                    <li>• দ্রুত এবং নির্ভরযোগ্য</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-tiro-bangla"
                >
                  বুঝেছি
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
