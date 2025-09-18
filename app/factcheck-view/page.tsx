"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import {
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function FactCheckViewAllPage() {
  // Query all fact checks from database
  const factChecksData = useQuery(api.factChecks.list);

  const downloadAllFactChecks = () => {
    if (!factChecksData) return;
    
    const dataStr = JSON.stringify(factChecksData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `all-ai-fact-checks-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "bg-green-100 text-green-800";
      case "false":
        return "bg-red-100 text-red-800";
      case "misleading":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "true":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "false":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "misleading":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (factChecksData === undefined) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            লোড হচ্ছে...
          </h1>
          <p className="text-gray-600 font-tiro-bangla">
            ফ্যাক্ট চেক রিপোর্টসমূহ লোড করা হচ্ছে
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!factChecksData || factChecksData.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-4">
            <img
              src="https://i.postimg.cc/BQZw4j8L/image.png"
              alt="AI Fact Check"
              className="w-20 h-20 mx-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            কোনো এআই ফ্যাক্টচেক নেই
          </h1>
          <p className="text-gray-600 mb-6 font-tiro-bangla">
            আপনি এখনও কোনো এআই ফ্যাক্টচেক তৈরি করেননি
          </p>
          <Link
            href="/#search"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-tiro-bangla"
          >
            প্রথম ফ্যাক্টচেক করুন
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-tiro-bangla">
            আপনার এআই ফ্যাক্টচেক সমূহ
          </h1>
          <p className="text-lg text-gray-600 font-tiro-bangla">
            আপনার তৈরি করা সব ফ্যাক্টচেক রিপোর্ট
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={downloadAllFactChecks}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-tiro-bangla"
          >
            <Download className="h-4 w-4" />
            <span>সব ডাউনলোড করুন</span>
          </button>
        </div>

        {/* Fact Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {factChecksData.map((check) => (
            <div
              key={check.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2 mb-3">
                  {getVerdictIcon(check.verdict)}
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(check.verdict)}`}
                  >
                    {getVerdictText(check.verdict)}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 line-clamp-2 font-tiro-bangla">
                  {check.query}
                </h3>
                <p className="text-xs text-gray-500 mt-2 font-tiro-bangla">
                  {new Date(check.timestamp).toLocaleString("bn-BD")}
                </p>
              </div>

              {/* Content Preview */}
              <div className="p-4">
                <p className="text-sm text-gray-600 line-clamp-3 font-tiro-bangla mb-3">
                  {check.result.substring(0, 200)}...
                </p>

                {/* Source Info */}
                {check.sourceInfo && (
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <span>উৎস: {check.sourceInfo.totalSources}টি</span>
                    {check.sourceInfo.hasBengaliSources && (
                      <span className="text-green-600">বাংলা</span>
                    )}
                    {check.sourceInfo.hasEnglishSources && (
                      <span className="text-orange-600">ইংরেজি</span>
                    )}
                  </div>
                )}

                {/* View Button */}
                <Link
                  href={`/factcheck-view/${check.id}`}
                  className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium font-tiro-bangla"
                >
                  <span>সম্পূর্ণ রিপোর্ট দেখুন</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  );
}
