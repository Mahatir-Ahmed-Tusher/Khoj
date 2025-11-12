"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface NewsItem {
  article_id: string;
  title: string;
  description: string | null;
  content?: string | null;
  pubDate: string;
  image_url?: string | null;
  category?: string[];
  source_name?: string;
  source_url?: string;
  link?: string;
}

interface NewsData {
  results: NewsItem[];
  nextPage: string | null;
  totalResults: number;
}

const topics: Array<{ value: string; label: string }> = [
  { value: "all", label: "সব" },
  { value: "top", label: "শীর্ষ" },
  { value: "business", label: "ব্যবসা" },
  { value: "technology", label: "প্রযুক্তি" },
  { value: "sports", label: "খেলাধুলা" },
  { value: "entertainment", label: "বিনোদন" },
  { value: "health", label: "স্বাস্থ্য" },
  { value: "politics", label: "রাজনীতি" },
  { value: "science", label: "বিজ্ঞান" },
];

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};

const getOriginalUrl = (item: NewsItem) =>
  (item.link || item.source_url || "").trim();

export default function NewsCollection() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string>("top");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNews = async (reset = true) => {
      const params = new URLSearchParams();
      params.set("size", "12");

      if (selectedTopic && selectedTopic !== "all") {
        params.set("category", selectedTopic);
      }

      if (searchQuery) {
        params.set("q", searchQuery);
      }

      setError("");
      if (reset) {
        setLoading(true);
      }

      try {
        const response = await fetch(
          `/api/news-collection?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("সংবাদ লোড করা যায়নি। পরে আবার চেষ্টা করুন।");
        }

        const data: NewsData = await response.json();
        setNews(data.results || []);
        setNextPageToken(data.nextPage || null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setNews([]);
        setError(
          err instanceof Error
            ? err.message
            : "সংবাদ লোড করতে সমস্যা হয়েছে।"
        );
      } finally {
        if (reset) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchNews();

    return () => controller.abort();
  }, [selectedTopic, searchQuery]);

  const loadMore = async () => {
    if (!nextPageToken) return;

    const params = new URLSearchParams();
    params.set("size", "12");
    params.set("nextPage", nextPageToken);

    if (selectedTopic && selectedTopic !== "all") {
      params.set("category", selectedTopic);
    }

    if (searchQuery) {
      params.set("q", searchQuery);
    }

    setLoadingMore(true);
    setError("");

    try {
      const response = await fetch(`/api/news-collection?${params.toString()}`);

      if (!response.ok) {
        throw new Error("আরও সংবাদ লোড করা সম্ভব হয়নি।");
      }

      const data: NewsData = await response.json();
      setNews((prev) => [...prev, ...(data.results || [])]);
      setNextPageToken(data.nextPage || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "আরও সংবাদ লোড করতে সমস্যা হয়েছে।"
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const handleResetSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleVerify = (url: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!url) {
      setError("এই সংবাদটির মূল লিংক পাওয়া যায়নি।");
      return;
    }
    router.push(`/news-verification-v2?url=${encodeURIComponent(url)}`);
  };

  const topicLabel = useMemo(() => {
    const found = topics.find((topic) => topic.value === selectedTopic);
    return found?.label || "সংবাদ";
  }, [selectedTopic]);

  const renderNewsCard = (item: NewsItem) => {
    const originalUrl = getOriginalUrl(item);
    const canOpenOriginal = Boolean(originalUrl);

    return (
      <article
        key={item.article_id}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (canOpenOriginal) {
            window.open(originalUrl, "_blank", "noopener,noreferrer");
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canOpenOriginal) {
            window.open(originalUrl, "_blank", "noopener,noreferrer");
          }
        }}
        className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow transition hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          canOpenOriginal ? "cursor-pointer" : "cursor-not-allowed opacity-80"
        }`}
      >
        {item.image_url && (
          <div className="h-56 w-full overflow-hidden bg-gray-100 sm:h-64">
            <img
              src={item.image_url}
              alt={item.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-blue-600">
                {topicLabel}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {item.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={(event) => handleVerify(originalUrl, event)}
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              যাচাই করুন
            </button>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3">
            {item.description ||
              item.content ||
              "এই সংবাদের সংক্ষিপ্ত বিবরণ নেই। মূল লিংকে ক্লিক করে বিস্তারিত পড়ুন।"}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
            <span>{formatDate(item.pubDate)}</span>
            {item.source_name && (
              <span className="font-medium text-gray-700">
                {item.source_name}
              </span>
            )}
          </div>

          {canOpenOriginal && (
            <span className="mt-2 inline-flex items-center text-sm font-semibold text-blue-600">
              মূল সংবাদ খুলুন →
            </span>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            সংবাদ সংগ্রহ
          </h1>
          <p className="mt-3 text-gray-600 md:text-lg">
            বিষয়ের ভিত্তিতে সংবাদ ব্রাউজ করুন, সার্চ করুন এবং তাৎক্ষণিকভাবে
            যাচাই করুন।
          </p>
        </header>

        <section className="mb-8 rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <button
                  key={topic.value}
                  type="button"
                  onClick={() => setSelectedTopic(topic.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    selectedTopic === topic.value
                      ? "bg-blue-600 text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="flex w-full max-w-md items-center gap-2"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="সংবাদ শিরোনাম, বিষয় বা কীওয়ার্ড লিখুন..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="submit"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                খুঁজুন
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="rounded-full border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  মুছুন
                </button>
              )}
            </form>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-700">
            {error}
          </div>
        )}

        {loading && isInitialLoad ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          </div>
        ) : news.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-lg text-gray-600">
              {searchQuery
                ? "এই অনুসন্ধানে কোনো সংবাদ পাওয়া যায়নি।"
                : "এই মুহূর্তে কোনো সংবাদ পাওয়া যাচ্ছে না।"}
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid gap-6 md:grid-cols-2">
              {news.map((item) => renderNewsCard(item))}
            </div>

            {nextPageToken && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingMore ? "আরও সংবাদ লোড হচ্ছে..." : "আরও সংবাদ দেখুন"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
