"use client";

import Link from "next/link";
import { factCheckArticles } from "@/lib/data";
import { getVerdictLabel, normalizeVerdict } from "@/lib/utils";

interface RecommendationWidgetProps {
  currentArticleId?: string;
}

export default function RecommendationWidget({
  currentArticleId,
}: RecommendationWidgetProps) {
  // Get 5 recent articles, excluding the current one if provided
  const recentArticles = factCheckArticles
    .filter((article) => article.id !== currentArticleId)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
        আরও পড়ুন
      </h3>

      <div className="space-y-3">
        {recentArticles.map((article) => (
          <Link
            key={article.id}
            href={`/factchecks/${article.slug}`}
            className="block group"
          >
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              {/* Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <img
                  src={article.thumbnail || "/khoj.png"}
                  alt={article.title}
                  className="w-full h-full object-cover rounded-md"
                />
                {/* Verdict badge */}
                <div className="absolute -top-1 -right-1">
                  <span
                    className={`inline-block px-1 py-0.5 rounded-full text-xs font-medium ${
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

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors font-tiro-bangla">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1 font-tiro-bangla">
                  {new Date(article.publishedAt).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
