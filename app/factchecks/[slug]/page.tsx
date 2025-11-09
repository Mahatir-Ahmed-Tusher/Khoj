import Footer from "@/components/Footer";
import RecommendationWidget from "@/components/RecommendationWidget";
import ShareButtons from "@/components/ShareButtons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { factCheckArticles } from "@/lib/data";
import { parseMarkdown, sanitizeHtml } from "@/lib/markdown";

// Create a map of articles by slug for easy lookup
const articlesBySlug = factCheckArticles.reduce(
  (acc, article) => {
    acc[article.slug] = article;
    return acc;
  },
  {} as Record<string, (typeof factCheckArticles)[0]>
);

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articlesBySlug[slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                হোম
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/factchecks" className="hover:text-gray-700">
                ফ্যাক্টচেক সমূহ
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Article Content - Left Side */}
          <div className="flex-1">
            {/* Article Header */}
            <article className="card mb-8">
              {/* Thumbnail */}
              {article.thumbnail && (
                <div className="relative mb-6 rounded-t-lg overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-auto object-contain"
                  />
                  {/* Title Overlay with Shadow - Mobile Only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:hidden"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
                    <h1 className="text-white font-bold text-3xl leading-tight drop-shadow-lg">
                      {article.title}
                    </h1>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="mb-6">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      article.verdict === "true"
                        ? "bg-green-100 text-green-800"
                        : article.verdict === "false"
                          ? "bg-red-100 text-red-800"
                          : article.verdict === "unverified"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {article.verdict === "true"
                      ? "সত্য"
                      : article.verdict === "false"
                        ? "মিথ্যা"
                        : article.verdict === "unverified"
                          ? "ভ্রান্তিমূলক"
                          : "অযাচাইকৃত"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {article.title}
                </h1>

                <div className="mb-6">
                  <p className="text-lg text-gray-700 bg-gray-50 p-4 rounded-lg">
                    <strong>দাবি:</strong> {article.claim}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-4">
                    <span>লেখক: {article.author}</span>
                    <span>•</span>
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "bn-BD"
                      )}
                    </span>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(parseMarkdown(article.content)),
                    }}
                  />
                </div>
              </div>
            </article>

            {/* References */}
            {article.references.length > 0 && (
              <div className="card mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  উৎসসমূহ
                </h2>
                <div className="space-y-3">
                  {article.references.map((reference) => (
                    <div
                      key={reference.id}
                      className="border-l-4 border-primary-500 pl-4"
                    >
                      <h3 className="font-medium text-gray-900 mb-1">
                        {reference.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {reference.snippet}
                      </p>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        উৎস দেখুন →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ট্যাগসমূহ
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Share Section */}
            <ShareButtons
              title={article.title}
              url={`${process.env.NEXT_PUBLIC_BASE_URL || "https://khoj-bd.com"}/factchecks/${article.slug}`}
              description={article.summary}
            />
          </div>

          {/* Recommendation Widget - Right Side */}
          <div className="lg:w-80 flex-shrink-0">
            <RecommendationWidget currentArticleId={article.id} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
