"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsItem {
  article_id: string;
  title: string;
  description: string;
  pubDate: string;
  image_url?: string;
  category?: string[];
  source_name?: string;
}

interface NewsData {
  results: NewsItem[];
  nextPage: string | null;
  totalResults: number;
}

const categories = [
  { value: "", label: "সব" },
  { value: "top", label: "শীর্ষ সংবাদ" },
  { value: "business", label: "ব্যবসা" },
  { value: "technology", label: "প্রযুক্তি" },
  { value: "sports", label: "খেলাধুলা" },
  { value: "entertainment", label: "বিনোদন" },
  { value: "health", label: "স্বাস্থ্য" },
  { value: "politics", label: "রাজনীতি" },
];

export default function NewsCollection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [prevPageTokens, setPrevPageTokens] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, fromDate, toDate]);

  const fetchNews = async (pageToken: string = "") => {
    setLoading(true);
    try {
      let url = `/api/news-collection?`;

      if (pageToken) {
        url += `nextPage=${pageToken}&`;
      }

      if (selectedCategory) {
        url += `category=${selectedCategory}&`;
      }

      if (fromDate) {
        url += `from_date=${fromDate}&`;
      }

      if (toDate) {
        url += `to_date=${toDate}&`;
      }

      const response = await fetch(url);
      const data: NewsData = await response.json();

      setNews(data.results);
      setNextPageToken(data.nextPage);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setPrevPageTokens([]);
    setNextPageToken(null);
  };

  const handleNextPage = () => {
    if (nextPageToken) {
      setPrevPageTokens([...prevPageTokens, nextPageToken]);
      setCurrentPage(currentPage + 1);
      fetchNews(nextPageToken);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (prevPageTokens.length > 0) {
      const newPrevTokens = [...prevPageTokens];
      newPrevTokens.pop();
      setPrevPageTokens(newPrevTokens);
      setCurrentPage(currentPage - 1);
      const prevToken = newPrevTokens[newPrevTokens.length - 1] || "";
      fetchNews(prevToken);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentPage > 1) {
      setCurrentPage(1);
      setPrevPageTokens([]);
      fetchNews();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          সংবাদ সংগ্রহ
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              বিভাগ নির্বাচন করুন:
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                শুরুর তারিখ:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setCurrentPage(1);
                  setPrevPageTokens([]);
                  setNextPageToken(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                শেষ তারিখ:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setCurrentPage(1);
                  setPrevPageTokens([]);
                  setNextPageToken(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">কোনো সংবাদ পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="space-y-6">
            {news.map((item) => (
              <Link
                key={item.article_id}
                href={`/news-collection/${item.article_id}`}
                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="md:flex">
                  {item.image_url && (
                    <div className="md:w-1/3">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 md:w-2/3">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {item.description || "বিবরণ নেই"}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{formatDate(item.pubDate)}</span>
                      {item.source_name && (
                        <span className="font-semibold">
                          {item.source_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && news.length > 0 && (
          <div className="mt-8 flex justify-center items-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-lg font-semibold ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              পূর্ববর্তী
            </button>
            <span className="text-gray-700 font-semibold">
              পৃষ্ঠা {currentPage}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!nextPageToken}
              className={`px-6 py-2 rounded-lg font-semibold ${
                !nextPageToken
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              পরবর্তী
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
