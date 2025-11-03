"use client";

import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import { useLoading } from "@/components/LoadingProvider";
import Link from "next/link";

interface ImageCheckResult {
  success: boolean;
  verdict: "true" | "false" | "misleading" | "unverified";
  confidence: "high" | "medium" | "low";
  explanation: string;
  aiGeneratedScore: number;
  requestId?: string;
  mediaId?: string;
  imageUrl?: string;
  bengaliReport?: string;
}

export default function ImageCheckPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImageCheckResult | null>(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [autoCheckStarted, setAutoCheckStarted] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const loadingCtx = useLoading();

  // Auto-load image from sessionStorage and start check
  useEffect(() => {
    const storedFileData = sessionStorage.getItem("selectedImageFile");
    if (storedFileData && !autoCheckStarted) {
      try {
        const fileData = JSON.parse(storedFileData);

        // Create a File object from the stored data
        const byteCharacters = atob(fileData.content.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const file = new File([byteArray], fileData.name, {
          type: fileData.type,
        });

        setSelectedFile(file);
        setPreviewUrl(fileData.content);

        // Clear the stored data
        sessionStorage.removeItem("selectedImageFile");

        // Start auto-check after a short delay
        setTimeout(() => {
          setAutoCheckStarted(true);
          handleImageCheck(file);
        }, 1000);
      } catch (error) {
        console.error("Error loading stored image:", error);
        sessionStorage.removeItem("selectedImageFile");
      }
    }
  }, [autoCheckStarted]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl("");
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError("");
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    setSelectedFile(null);
    setPreviewUrl(url);
    setResult(null);
    setError("");
  };

  const handleImageCheck = async (file: File) => {
    setIsLoading(true);
    setError("");
    setResult(null);
    try {
      loadingCtx.setLoading(true);
    } catch (e) {}
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/image-check", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "ছবি যাচাই করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
      try {
        loadingCtx.setLoading(false);
      } catch (e) {}
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !imageUrl) {
      setError("দয়া করে একটি ছবি আপলোড করুন বা URL দিন");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const response = await fetch("/api/image-check", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "ছবি যাচাই করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "bg-red-50 text-red-700 border-red-200";
      case "false":
        return "bg-green-50 text-green-700 border-green-200";
      case "misleading":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case "true":
        return "AI দ্বারা তৈরি";
      case "false":
        return "প্রকৃত ছবি";
      case "misleading":
        return "সন্দেহজনক";
      default:
        return "অযাচাইকৃত";
    }
  };

  const handleGenerateReport = async () => {
    if (!result || !result.imageUrl) return;

    setIsGeneratingReport(true);
    try {
      const response = await fetch("/api/image-check", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          sightengineResult: {
            type: { ai_generated: result.aiGeneratedScore },
          },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult((prev) =>
          prev ? { ...prev, bengaliReport: data.bengaliReport } : null
        );
      } else {
        setError(data.error || "রিপোর্ট তৈরি করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-white to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-200/80 to-orange-200/80 blur-xl"></div>
            <div className="relative w-full h-full rounded-3xl bg-white/60 backdrop-blur border border-amber-200 flex items-center justify-center shadow-xl">
              <span className="text-amber-600 text-4xl">🖼️</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-tiro-bangla tracking-tight">
            AI ছবি যাচাই
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-tiro-bangla">
            আপলোড করা ছবিটি AI-জেনারেটেড কিনা, সুন্দর ভিজ্যুয়াল রিপোর্টে দেখুন
          </p>
        </div>

        {/* Auto-check Status */}
        {autoCheckStarted && isLoading && (
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 font-tiro-bangla font-medium">
                মেইন পেইজ থেকে আপলোড করা ছবি যাচাই হচ্ছে...
              </p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-tiro-bangla">
                ছবি আপলোড করুন
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border file:border-amber-200 file:text-sm file:font-medium file:bg-gradient-to-r file:from-amber-50 file:to-orange-50 file:text-amber-700 hover:file:from-amber-100 hover:file:to-orange-100"
              />
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-tiro-bangla">
                  অথবা
                </span>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-tiro-bangla">
                ছবির URL দিন
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-300 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="text-center">
                <div className="inline-block p-2 bg-gradient-to-br from-amber-100/60 to-orange-100/60 rounded-2xl border border-amber-200">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-60 object-contain rounded-xl bg-white shadow-inner"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!selectedFile && !imageUrl)}
              className="w-full relative overflow-hidden text-white py-3 px-6 rounded-xl font-tiro-bangla font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(90deg, rgba(245,158,11,1) 0%, rgba(249,115,22,1) 100%)",
                boxShadow: "0 10px 20px rgba(249,115,22,0.25)",
              }}
            >
              {isLoading ? "যাচাই হচ্ছে..." : "ছবি যাচাই করুন"}
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
            <div className="mt-8 p-6 bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-tiro-bangla">
                যাচাইকরণ ফলাফল
              </h3>

              <div className="space-y-4">
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
                    {result.confidence === "high"
                      ? "উচ্চ"
                      : result.confidence === "medium"
                        ? "মাঝারি"
                        : "নিম্ন"}
                  </span>
                </div>

                {/* AI Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    AI স্কোর:
                  </span>
                  <span className="text-gray-800 font-medium text-sm">
                    {(result.aiGeneratedScore * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Explanation */}
                <div>
                  <span className="text-gray-700 font-tiro-bangla text-sm">
                    ব্যাখ্যা:
                  </span>
                  <p className="text-gray-800 mt-1 font-tiro-bangla text-sm">
                    {result.explanation}
                  </p>
                </div>

                {/* Report Generation Button */}
                {!result.bengaliReport && (
                  <div className="mt-6">
                    <button
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-tiro-bangla font-medium transition-all duration-200"
                    >
                      {isGeneratingReport ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>রিপোর্ট তৈরি হচ্ছে...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>📊</span>
                          <span>রিপোর্ট</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Bengali Report */}
                {result.bengaliReport && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/50">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 font-tiro-bangla">
                      বিস্তারিত বিশ্লেষণ
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 font-tiro-bangla text-sm leading-relaxed whitespace-pre-wrap">
                        {result.bengaliReport}
                      </p>
                    </div>
                  </div>
                )}

                {/* Request ID */}
                {result.requestId && (
                  <div className="text-xs text-gray-500">
                    রিকোয়েস্ট ID: {result.requestId}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 font-tiro-bangla">
            কিভাবে কাজ করে
          </h2>
          <p className="text-gray-600 mb-6 font-tiro-bangla text-sm">
            আমাদের AI সিস্টেম ছবির বিভিন্ন বৈশিষ্ট্য বিশ্লেষণ করে AI দ্বারা তৈরি
            কিনা তা সনাক্ত করে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-200">
                <span className="text-blue-600 text-lg">📸</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">
                ছবি আপলোড
              </h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">
                ছবি আপলোড করুন বা URL দিন
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-200">
                <span className="text-green-600 text-lg">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">
                AI বিশ্লেষণ
              </h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">
                AI ছবি বিশ্লেষণ করে
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-200">
                <span className="text-purple-600 text-lg">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">
                ফলাফল
              </h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">
                বিস্তারিত রিপোর্ট পান
              </p>
            </div>
          </div>
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

      <Footer />
    </div>
  );
}
