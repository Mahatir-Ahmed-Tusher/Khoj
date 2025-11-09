// app/news-collection/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface NewsDetail {
  article_id: string;
  title: string;
  description: string;
  content: string;
  pubDate: string;
  image_url?: string;
  source_name?: string;
  source_url?: string;
  category?: string[];
  creator?: string[];
  keywords?: string[];
  video_url?: string;
}

export default function NewsDetail() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsDetail();
  }, [params.id]);

  const fetchNewsDetail = async () => {
    setLoading(true);
    try {
      // Fetch from API to get all news and find the specific one
      const response = await fetch(`/api/news-collection`);
      const data = await response.json();

      // Find the news item with matching ID
      const newsItem = data.results.find(
        (item: NewsDetail) => item.article_id === params.id
      );

      if (newsItem) {
        setNews(newsItem);
      } else {
        // If not found in current page, you might need to implement a search
        console.log("News not found");
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              সংবাদ পাওয়া যায়নি
            </h2>
            <Link
              href="/news-collection"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              সংবাদ তালিকায় ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/news-collection"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          সংবাদ তালিকায় ফিরে যান
        </Link>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {news.image_url && (
            <div className="w-full h-96 bg-gray-200">
              <img
                src={news.image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <span className="font-semibold">{formatDate(news.pubDate)}</span>
              {news.source_name && (
                <span className="flex items-center">
                  <span className="font-semibold">উৎস:</span>
                  <span className="ml-1">{news.source_name}</span>
                </span>
              )}
              {news.creator && news.creator.length > 0 && (
                <span className="flex items-center">
                  <span className="font-semibold">লেখক:</span>
                  <span className="ml-1">{news.creator.join(", ")}</span>
                </span>
              )}
            </div>

            {news.category && news.category.length > 0 && (
              <div className="mb-6">
                <span className="font-semibold text-gray-700 mr-2">বিভাগ:</span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {news.category.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {news.description && (
              <div className="mb-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {news.description}
                </p>
              </div>
            )}

            {news.content && (
              <div className="prose max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {news.content}
                </p>
              </div>
            )}

            {news.video_url && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">ভিডিও:</h3>
                <a
                  href={news.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ভিডিও দেখুন
                </a>
              </div>
            )}

            {news.keywords && news.keywords.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <span className="font-semibold text-gray-700 mr-2">
                  মূলশব্দ:
                </span>
                <div className="inline-flex flex-wrap gap-2 mt-2">
                  {news.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {news.source_url && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                >
                  মূল সংবাদ পড়ুন
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
