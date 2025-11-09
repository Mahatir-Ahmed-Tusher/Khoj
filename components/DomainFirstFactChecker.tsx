"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";
import { ArticleVerdict, getArticleVerdictMeta } from "@/lib/utils";

interface SearchResult {
  url: string;
  domain: string;
  title: string;
  published: string | null;
  author: string | null;
  relevance_score: number;
  excerpt: string;
  source: string;
  language?: string;
}

interface SearchStats {
  totalSitesSearched: number;
  totalResultsFound: number;
  allowedSitesResults: number;
  tavilyResults: number;
}

interface FactCheckResponse {
  status: "success" | "partial" | "no_results";
  used_tavily: boolean;
  selected_urls: SearchResult[];
  notes: string[];
  claim: string;
  report: string;
  relatedArticles?: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    verdict: ArticleVerdict;
    publishedAt: string;
    author: string;
    tags: string[];
    thumbnail?: string;
  }[];
  searchStats: SearchStats;
  generatedAt: string;
}

export default function DomainFirstFactChecker() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/factcheck-domain-first", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch fact check");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "ফ্যাক্ট চেকিং রিপোর্ট তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 font-tiro-bangla">
          Khoj ডোমেইন-ফার্স্ট ফ্যাক্ট চেকার
        </h1>
        <p className="text-lg text-gray-600 mb-6 font-tiro-bangla">
          প্রথমে নির্দিষ্ট ওয়েবসাইটে সার্চ, তারপর প্রয়োজন হলে Tavily API
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">নির্দিষ্ট ওয়েবসাইটে সার্চ করা হচ্ছে...</p>
          <p className="text-sm text-gray-500 mt-2">
            এটি কয়েক মিনিট সময় নিতে পারে
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-8">
          {/* সার্চ স্ট্যাটিসটিক্স */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 font-tiro-bangla">
              সার্চ পরিসংখ্যান
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {result.searchStats.totalSitesSearched}
                </div>
                <div className="text-sm text-gray-600">মোট সাইট</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {result.searchStats.totalResultsFound}
                </div>
                <div className="text-sm text-gray-600">মোট ফলাফল</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {result.searchStats.allowedSitesResults}
                </div>
                <div className="text-sm text-gray-600">নির্দিষ্ট সাইট</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {result.searchStats.tavilyResults}
                </div>
                <div className="text-sm text-gray-600">Tavily API</div>
              </div>
            </div>

            {result.used_tavily && (
              <div className="mt-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  ⚠️ Tavily API ব্যবহার করা হয়েছে কারণ নির্দিষ্ট সাইট থেকে
                  পর্যাপ্ত ফলাফল পাওয়া যায়নি।
                </p>
                <p className="text-orange-700 text-sm mt-1">
                  💡 ইংরেজি উৎস থেকে তথ্য সংগ্রহ করে বাংলায় অনুবাদ করা হয়েছে।
                </p>
              </div>
            )}
          </div>

          {/* স্ট্যাটাস ইন্ডিকেটর */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                result.status === "success"
                  ? "bg-green-100 text-green-800"
                  : result.status === "partial"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {result.status === "success"
                ? "✅ সফল"
                : result.status === "partial"
                  ? "⚠️ আংশিক"
                  : "❌ ফলাফল নেই"}
            </div>
          </div>

          {/* রিপোর্ট */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 font-tiro-bangla">
              ফ্যাক্ট চেকিং রিপোর্ট
            </h3>
            <div className="prose max-w-none">
              <div
                className="text-gray-800 leading-relaxed font-tiro-bangla"
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(parseMarkdown(result.report)),
                }}
              />
            </div>
          </div>

          {/* উৎসসমূহ */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 font-tiro-bangla">
              উৎসসমূহ ({result.selected_urls.length}টি)
            </h3>
            <div className="space-y-4">
              {result.selected_urls.map((source, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-blue-600 hover:text-blue-800">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {source.title}
                      </a>
                    </h4>
                    <div className="flex items-center space-x-2">
                      {source.language && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            source.language === "English"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {source.language === "English" ? "ইংরেজি" : "বাংলা"}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          source.source === "allowed_sites"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {source.source === "allowed_sites"
                          ? "নির্দিষ্ট সাইট"
                          : "Tavily API"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{source.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>স্কোর: {source.relevance_score.toFixed(2)}</span>
                    <span>ডোমেইন: {source.domain}</span>
                    {source.published && (
                      <span>
                        প্রকাশ:{" "}
                        {new Date(source.published).toLocaleDateString("bn-BD")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* নোটসমূহ */}
          {result.notes.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <h4 className="font-semibold text-yellow-800 mb-2 font-tiro-bangla">
                নোটসমূহ:
              </h4>
              <ul className="text-sm text-yellow-700">
                {result.notes.map((note, index) => (
                  <li key={index} className="mb-1">
                    • {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* সম্পর্কিত নিবন্ধসমূহ */}
          {result.relatedArticles && result.relatedArticles.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 font-tiro-bangla text-blue-800">
                📚 সম্পর্কিত নিবন্ধসমূহ
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.relatedArticles.map((article) => {
                  const meta = getArticleVerdictMeta(article.verdict);
                  return (
                  <div
                    key={article.id}
                    className="bg-white border border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                        <h4 className="text-white font-bold text-sm leading-tight drop-shadow-lg font-tiro-bangla line-clamp-2">
                          {article.title}
                        </h4>
                      </div>
                      <div className="absolute top-2 left-2">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${meta.chipClass}`}
                        >
                          {meta.chipLabelBn}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm font-tiro-bangla line-clamp-2 hidden md:block">
                        <a
                          href={`/factchecks/${article.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </a>
                      </h4>

                      <p className="text-gray-600 text-xs mb-3 line-clamp-2 font-tiro-bangla">
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
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium font-tiro-bangla"
                        >
                          পড়ুন →
                        </a>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center mt-6 text-sm text-gray-500">
            রিপোর্ট তৈরি হয়েছে:{" "}
            {new Date(result.generatedAt).toLocaleString("bn-BD")}
          </div>
        </div>
      )}
    </div>
  );
}
