"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import {
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Share2,
  Loader2,
} from "lucide-react";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";
import ShareModal from "@/components/ShareModal";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export default function MuktiCornerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // modal control state
  const [showShareModal, setShowShareModal] = useState(false);

  // Query the database for the mukti corner report by ID
  const muktiData = useQuery(api.factChecks.getByID, { 
    id: id as Id<"factChecks"> 
  });

  const downloadReport = () => {
    if (!muktiData) return;

    const content = `
Mukti Corner রিপোর্ট
==================

প্রশ্ন: ${muktiData.query}
তৈরির তারিখ: ${new Date(muktiData.timestamp).toLocaleString("bn-BD")}

${muktiData.result}

উৎসসমূহ:
${muktiData.sources.map((source) => `${source.id}. ${source.title} - ${source.url}`).join("\n")}

---
এই রিপোর্টটি Mukti Corner দ্বারা তৈরি করা হয়েছে।
     `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mukti-corner-${muktiData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "true":
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case "false":
        return <XCircle className="h-6 w-6 text-red-600" />;
      case "misleading":
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return <HelpCircle className="h-6 w-6 text-gray-600" />;
    }
  };

  if (muktiData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            লোড হচ্ছে...
          </h1>
          <p className="text-gray-600">
            Mukti Corner রিপোর্ট লোড করা হচ্ছে
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (muktiData === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            রিপোর্ট পাওয়া যায়নি
          </h1>
          <p className="text-gray-600">
            এই রিপোর্টটি আর পাওয়া যায় না। সম্ভবত এটি মুছে ফেলা হয়েছে।
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mukti Corner রিপোর্ট
          </h1>
          <p className="text-lg text-gray-600">
            "{muktiData.query}" এর জন্য পূর্বে তৈরি করা বিশ্লেষণ
          </p>
        </div>

        {/* Report */}
        <div className="space-y-8">
          {/* Report Header */}
          <div className="card bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-600">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {getVerdictIcon(muktiData.verdict)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Mukti Corner বিশ্লেষণ
                  </h2>
                  <p className="text-gray-600 font-tiro-bangla">
                    সংরক্ষিত গবেষণা-ভিত্তিক বিশ্লেষণ
                  </p>
                </div>
              </div>
              {/* action buttons  */}
              <div className="flex gap-4" id="buttons">
                <button
                  id="share-button"
                  onClick={() => setShowShareModal(true)}
                  className="flex items-center space-x-2 bg-gray-100 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Share2 />
                  <span className="font-medium">শেয়ার করুন</span>
                </button>
                <button
                  onClick={downloadReport}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  <span className="font-medium">ডাউনলোড করুন</span>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                প্রশ্ন:
              </h3>
              <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm break-words overflow-hidden">
                {muktiData.query}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                তৈরির তারিখ:
              </h3>
              <p className="text-gray-600 bg-white px-4 py-2 rounded-lg inline-block">
                {new Date(muktiData.timestamp).toLocaleString("bn-BD")}
              </p>
            </div>
          </div>

          {/* Detailed Report */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              বিস্তারিত বিশ্লেষণ:
            </h3>
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed text-base"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(parseMarkdown(muktiData.result)),
                }}
              />
            </div>
          </div>

          {/* Sources */}
          {muktiData.sources && muktiData.sources.length > 0 && (
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                উৎসসমূহ:
              </h3>

              {/* Source Info */}
              {muktiData.sourceInfo && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700 font-medium">
                        মোট উৎস:
                      </span>
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {muktiData.sourceInfo.totalSources}টি
                      </span>
                    </div>
                    {muktiData.sourceInfo.hasBengaliSources && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-700 font-medium">
                          বাংলা উৎস:
                        </span>
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">
                          ✓ পাওয়া গেছে
                        </span>
                      </div>
                    )}
                    {muktiData.sourceInfo.hasEnglishSources && (
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
                  {muktiData.sourceInfo.hasEnglishSources && (
                    <p className="text-blue-600 text-sm mt-3 p-3 bg-blue-50 rounded-lg">
                      💡 বাংলায় পর্যাপ্ত তথ্য না থাকায় ইংরেজি উৎস থেকে তথ্য
                      সংগ্রহ করে বাংলায় অনুবাদ করা হয়েছে।
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {muktiData.sources.map((source) => (
                  <div
                    key={source.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow max-w-full overflow-hidden"
                  >
                    <div className="flex items-start justify-between min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {source.id}. {source.title}
                          </h4>
                          {source.language && (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
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
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed break-words">
                          {source.snippet}
                        </p>
                        {/* URL Display */}
                        <div className="mb-3 p-2 bg-gray-50 rounded border">
                          <p className="text-xs text-gray-500 mb-1 font-medium">লিংক:</p>
                          <p className="text-xs text-blue-600 break-all overflow-hidden">
                            {source.url}
                          </p>
                        </div>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-2 ml-4 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors flex-shrink-0"
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
        </div>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          url={typeof window !== "undefined" ? window.location.href : ""}
        />
      </div>

      <Footer />
    </div>
  );
}
