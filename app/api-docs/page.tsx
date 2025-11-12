"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Link from "next/link";
import { 
  ExternalLink, 
  Key, 
  Lock, 
  LogIn, 
  Copy, 
  Check,
  Menu,
  X,
  Globe
} from "lucide-react";

type Language = "en" | "bn";

interface Translations {
  [key: string]: {
    en: string;
    bn: string;
  };
}

const translations: Translations = {
  pageTitle: {
    en: "API Documentation",
    bn: "API ডকুমেন্টেশন"
  },
  pageSubtitle: {
    en: "Complete guide to using the Khoj Fact-Checking API",
    bn: "Khoj ফ্যাক্ট-চেকিং API ব্যবহারের সম্পূর্ণ গাইড"
  },
  getApiKey: {
    en: "Get Your API Key",
    bn: "আপনার API কী পান"
  },
  loginToGetKey: {
    en: "Login to Get API Key",
    bn: "API কী পেতে লগইন করুন"
  },
  loggedIn: {
    en: "You're Logged In",
    bn: "আপনি লগইন করেছেন"
  },
  requestKey: {
    en: "request your API key",
    bn: "আপনার API কী অনুরোধ করুন"
  },
  apiKeyRequired: {
    en: "API Key Required",
    bn: "API কী প্রয়োজন"
  },
  loginWithGoogle: {
    en: "log in with Google",
    bn: "Google দিয়ে লগইন করুন"
  },
  contactSupport: {
    en: "Contact Support",
    bn: "সাপোর্টে যোগাযোগ করুন"
  },
  overview: {
    en: "Overview",
    bn: "সারসংক্ষেপ"
  },
  quickStart: {
    en: "Quick Start",
    bn: "দ্রুত শুরু করুন"
  },
  authentication: {
    en: "Authentication",
    bn: "প্রমাণীকরণ"
  },
  endpoints: {
    en: "API Endpoints",
    bn: "API এন্ডপয়েন্ট"
  },
  requestResponse: {
    en: "Request & Response Format",
    bn: "অনুরোধ ও প্রতিক্রিয়া ফরম্যাট"
  },
  codeExamples: {
    en: "Code Examples",
    bn: "কোড উদাহরণ"
  },
  cors: {
    en: "Cross-Origin Resource Sharing (CORS)",
    bn: "ক্রস-অরিজিন রিসোর্স শেয়ারিং (CORS)"
  },
  configuration: {
    en: "Configuration",
    bn: "কনফিগারেশন"
  },
  rateLimiting: {
    en: "Rate Limiting",
    bn: "হার সীমাবদ্ধতা"
  },
  errorHandling: {
    en: "Error Handling",
    bn: "ত্রুটি পরিচালনা"
  },
  testing: {
    en: "Testing",
    bn: "পরীক্ষা"
  },
  bestPractices: {
    en: "Best Practices",
    bn: "সেরা অনুশীলন"
  },
  faq: {
    en: "FAQ",
    bn: "প্রায়শই জিজ্ঞাসিত প্রশ্ন"
  },
  support: {
    en: "Support",
    bn: "সাপোর্ট"
  }
};

function t(key: string, lang: Language): string {
  return translations[key]?.[lang] || translations[key]?.en || key;
}

export default function APIDocsPage() {
  const { data: session, status } = useSession();
  const [language, setLanguage] = useState<Language>("en");
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const isLoggedIn = status === "authenticated" && !!session?.user;

  const sections = [
    { id: "overview", label: t("overview", language) },
    { id: "quick-start", label: t("quickStart", language) },
    { id: "authentication", label: t("authentication", language) },
    { id: "endpoints", label: t("endpoints", language) },
    { id: "request-response", label: t("requestResponse", language) },
    { id: "cors", label: t("cors", language) },
    { id: "code-examples", label: t("codeExamples", language) },
    { id: "configuration", label: t("configuration", language) },
    { id: "rate-limiting", label: t("rateLimiting", language) },
    { id: "error-handling", label: t("errorHandling", language) },
    { id: "testing", label: t("testing", language) },
    { id: "best-practices", label: t("bestPractices", language) },
    { id: "faq", label: t("faq", language) },
    { id: "support", label: t("support", language) },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
      setSidebarOpen(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ 
    code, 
    language: lang, 
    id 
  }: { 
    code: string; 
    language: string; 
    id: string;
  }) => (
    <div className="relative group">
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copiedCode === id ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {t("pageTitle", language)}
                </h1>
                {/* Language Toggle */}
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === "en"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage("bn")}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === "bn"
                        ? "bg-primary-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    BN
                  </button>
                </div>
              </div>
              <p className="text-gray-600">
                {t("pageSubtitle", language)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href="/get-api-key"
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <Key className="h-5 w-5" />
                  <span>{t("getApiKey", language)}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/signin?callbackUrl=/get-api-key"
                  className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  <LogIn className="h-5 w-5" />
                  <span>{t("loginToGetKey", language)}</span>
                </Link>
              )}
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Info Banner */}
          {isLoggedIn ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Key className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-green-800 font-semibold mb-1">
                    {t("loggedIn", language)}
                  </h3>
                  <p className="text-green-700 text-sm">
                    {language === "en" ? (
                      <>You can now{" "}
                        <Link href="/get-api-key" className="underline font-medium">
                          {t("requestKey", language)}
                        </Link>{" "}
                        to start using the API.</>
                    ) : (
                      <>আপনি এখন{" "}
                        <Link href="/get-api-key" className="underline font-medium">
                          {t("requestKey", language)}
                        </Link>{" "}
                        করে API ব্যবহার শুরু করতে পারেন।</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <Lock className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-blue-800 font-semibold mb-1">
                    {t("apiKeyRequired", language)}
                  </h3>
                  <p className="text-blue-700 text-sm">
                    {language === "en" ? (
                      <>This documentation is publicly available. However, to get an API key and use the API, you need to{" "}
                        <Link href="/auth/signin?callbackUrl=/get-api-key" className="underline font-medium">
                          {t("loginWithGoogle", language)}
                        </Link>.</>
                    ) : (
                      <>এই ডকুমেন্টেশন সর্বজনীনভাবে উপলব্ধ। তবে API কী পেতে এবং API ব্যবহার করতে, আপনাকে{" "}
                        <Link href="/auth/signin?callbackUrl=/get-api-key" className="underline font-medium">
                          {t("loginWithGoogle", language)}
                        </Link>{" "}
                        করতে হবে।</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation - Desktop Only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8 bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {language === "en" ? "Table of Contents" : "সূচিপত্র"}
              </h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-primary-100 text-primary-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {language === "en" ? "Table of Contents" : "সূচিপত্র"}
                  </h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-primary-100 text-primary-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-12">
              {/* Overview Section */}
              <section
                id="overview"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("overview", language)}
                </h2>
                {language === "en" ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                      The Khoj Fact-Checking API provides third-party developers with access to our AI-powered fact-checking pipeline. This API allows you to integrate fact-checking capabilities into your own applications, websites, or services.
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Features</h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li>AI-powered fact-checking in Bengali and English</li>
                      <li>Detailed reports with sources and verdicts</li>
                      <li>Tiered source verification system</li>
                      <li>Geography-aware fact-checking (Bangladesh vs International)</li>
                      <li>Related articles from Khoj database</li>
                      <li>Full CORS support for cross-origin requests</li>
                      <li>Rate limiting and API key authentication</li>
                      <li>Comprehensive error handling</li>
                    </ul>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 mb-4">
                      Khoj ফ্যাক্ট-চেকিং API তৃতীয় পক্ষের ডেভেলপারদের আমাদের AI-চালিত ফ্যাক্ট-চেকিং পাইপলাইনে অ্যাক্সেস প্রদান করে। এই API আপনাকে আপনার নিজস্ব অ্যাপ্লিকেশন, ওয়েবসাইট বা পরিষেবাগুলিতে ফ্যাক্ট-চেকিং ক্ষমতা একীভূত করতে দেয়।
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">বৈশিষ্ট্য</h3>
                    <ul className="list-disc ml-6 space-y-2 text-gray-700">
                      <li>বাংলা এবং ইংরেজিতে AI-চালিত ফ্যাক্ট-চেকিং</li>
                      <li>সূত্র এবং রায় সহ বিস্তারিত প্রতিবেদন</li>
                      <li>স্তরযুক্ত সূত্র যাচাইকরণ সিস্টেম</li>
                      <li>ভূগোল-সচেতন ফ্যাক্ট-চেকিং (বাংলাদেশ বনাম আন্তর্জাতিক)</li>
                      <li>Khoj ডাটাবেস থেকে সম্পর্কিত নিবন্ধ</li>
                      <li>ক্রস-অরিজিন অনুরোধের জন্য সম্পূর্ণ CORS সমর্থন</li>
                      <li>হার সীমাবদ্ধতা এবং API কী প্রমাণীকরণ</li>
                      <li>ব্যাপক ত্রুটি পরিচালনা</li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Quick Start Section */}
              <section
                id="quick-start"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("quickStart", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Get API Access</h3>
                      <p className="text-gray-700 mb-2">
                        To obtain an API key, simply log in with your Google account and visit the{" "}
                        <Link href="/get-api-key" className="text-primary-600 hover:underline">Get API Key</Link>{" "}
                        page. You can request a unique API key directly from the platform without contacting support.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Make Your First Request</h3>
                      <p className="text-gray-700 mb-2">With API Key (Production):</p>
                      <CodeBlock
                        id="quick-start-curl"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                      <p className="text-gray-700 mt-3 mb-2">Without API Key (Development - requires API_AUTH_REQUIRED=false):</p>
                      <CodeBlock
                        id="quick-start-curl-no-key"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">১. API অ্যাক্সেস পান</h3>
                      <p className="text-gray-700 mb-2">
                        API কী পেতে, কেবল আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন এবং{" "}
                        <Link href="/get-api-key" className="text-primary-600 hover:underline">API কী পান</Link>{" "}
                        পৃষ্ঠায় যান। আপনি সাপোর্টে যোগাযোগ না করেই সরাসরি প্ল্যাটফর্ম থেকে একটি অনন্য API কী অনুরোধ করতে পারেন।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">২. আপনার প্রথম অনুরোধ করুন</h3>
                      <p className="text-gray-700 mb-2">API কী সহ (প্রোডাকশন):</p>
                      <CodeBlock
                        id="quick-start-curl-bn"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                      <p className="text-gray-700 mt-3 mb-2">API কী ছাড়া (উন্নয়ন - API_AUTH_REQUIRED=false প্রয়োজন):</p>
                      <CodeBlock
                        id="quick-start-curl-no-key-bn"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Authentication Section */}
              <section
                ref={(el) => { sectionRefs.current["authentication"] = el; }}
                id="authentication"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("authentication", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>By Default: API Key is REQUIRED</strong>
                    </p>
                    <p className="text-gray-700">
                      The API requires authentication by default for security. You can provide your API key using either of these methods:
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Method 1: Authorization Header (Recommended)</h3>
                      <CodeBlock
                        id="auth-header"
                        language="text"
                        code={`Authorization: Bearer <your-api-key>`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Method 2: X-API-Key Header</h3>
                      <CodeBlock
                        id="auth-x-header"
                        language="text"
                        code={`X-API-Key: <your-api-key>`}
                      />
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Testing Without API Key (Development Only)</h3>
                      <p className="text-gray-700 mb-3">
                        For development and testing, you can disable authentication by setting <code className="bg-blue-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> in your server's <code className="bg-blue-100 px-2 py-1 rounded text-sm">.env</code> file.
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>⚠️ WARNING:</strong> Only use this in development/testing environments, never in production!
                      </p>
                      <p className="text-gray-700">
                        When authentication is disabled, you can make API calls without providing an API key. This is useful for local development and testing.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>ডিফল্ট: API কী প্রয়োজন</strong>
                    </p>
                    <p className="text-gray-700">
                      নিরাপত্তার জন্য API ডিফল্টভাবে প্রমাণীকরণ প্রয়োজন। আপনি এই দুটি পদ্ধতির যেকোনো একটি ব্যবহার করে আপনার API কী প্রদান করতে পারেন:
                    </p>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">পদ্ধতি ১: Authorization হেডার (সুপারিশকৃত)</h3>
                      <CodeBlock
                        id="auth-header-bn"
                        language="text"
                        code={`Authorization: Bearer <your-api-key>`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">পদ্ধতি ২: X-API-Key হেডার</h3>
                      <CodeBlock
                        id="auth-x-header-bn"
                        language="text"
                        code={`X-API-Key: <your-api-key>`}
                      />
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 API কী ছাড়া পরীক্ষা (শুধুমাত্র উন্নয়ন)</h3>
                      <p className="text-gray-700 mb-3">
                        উন্নয়ন এবং পরীক্ষার জন্য, আপনি আপনার সার্ভারের <code className="bg-blue-100 px-2 py-1 rounded text-sm">.env</code> ফাইলে <code className="bg-blue-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> সেট করে প্রমাণীকরণ নিষ্ক্রিয় করতে পারেন।
                      </p>
                      <p className="text-gray-700 mb-3">
                        <strong>⚠️ সতর্কতা:</strong> এটি কেবল উন্নয়ন/পরীক্ষার পরিবেশে ব্যবহার করুন, কখনই প্রোডাকশনে নয়!
                      </p>
                      <p className="text-gray-700">
                        প্রমাণীকরণ নিষ্ক্রিয় হলে, আপনি API কী প্রদান না করেই API কল করতে পারেন। এটি স্থানীয় উন্নয়ন এবং পরীক্ষার জন্য উপযোগী।
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* API Endpoints Section */}
              <section
                ref={(el) => { sectionRefs.current["endpoints"] = el; }}
                id="endpoints"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("endpoints", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Fact-Check a Claim</h3>
                      <p className="text-gray-700 mb-3">
                        Verify a claim or statement and receive a detailed fact-checking report.
                      </p>
                      <p className="text-gray-700 mb-2"><strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/v1/factcheck</code></p>
                      <p className="text-gray-700 mb-2"><strong>Authentication:</strong> Required (unless API_AUTH_REQUIRED=false)</p>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Request Body:</h4>
                        <CodeBlock
                          id="request-body"
                          language="json"
                          code={`{
  "query": "The claim or statement to fact-check"
}`}
                        />
                      </div>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Response (200 OK):</h4>
                        <CodeBlock
                          id="response-example"
                          language="json"
                          code={`{
  "success": true,
  "data": {
    "claim": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে",
    "report": "# দাবি\\n\\n[Detailed Bengali report in Markdown format...]",
    "verdict": "false",
    "sources": [
      {
        "id": 1,
        "title": "Source Title",
        "url": "https://example.com/article",
        "snippet": "Article snippet...",
        "language": "Bengali"
      }
    ],
    "relatedArticles": [...],
    "sourceInfo": {
      "hasBengaliSources": true,
      "hasEnglishSources": false,
      "totalSources": 12,
      "geography": "bangladesh",
      "tierBreakdown": {
        "tier1": 5,
        "tier2": 4,
        "tier3": 2,
        "tier4": 1,
        "tier5": 0,
        "general": 0
      }
    },
    "generatedAt": "2024-01-01T12:00:00.000Z"
  },
  "meta": {
    "apiVersion": "1.0",
    "generatedAt": "2024-01-01T12:00:00.000Z",
    "authenticated": true
  }
}`}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">একটি দাবি ফ্যাক্ট-চেক করুন</h3>
                      <p className="text-gray-700 mb-3">
                        একটি দাবি বা বিবৃতি যাচাই করুন এবং একটি বিস্তারিত ফ্যাক্ট-চেকিং প্রতিবেদন পান।
                      </p>
                      <p className="text-gray-700 mb-2"><strong>এন্ডপয়েন্ট:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">POST /api/v1/factcheck</code></p>
                      <p className="text-gray-700 mb-2"><strong>প্রমাণীকরণ:</strong> প্রয়োজন (API_AUTH_REQUIRED=false না হলে)</p>
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">অনুরোধ বডি:</h4>
                        <CodeBlock
                          id="request-body-bn"
                          language="json"
                          code={`{
  "query": "The claim or statement to fact-check"
}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Request & Response Format Section */}
              <section
                ref={(el) => { sectionRefs.current["request-response"] = el; }}
                id="request-response"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("requestResponse", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Verdict Values</h3>
                      <p className="text-gray-700 mb-2">The <code className="bg-gray-100 px-2 py-1 rounded text-sm">verdict</code> field can have one of the following values:</p>
                      <ul className="list-disc ml-6 space-y-1 text-gray-700">
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"true"</code>: The claim is verified as true</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"false"</code>: The claim is verified as false</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"unverified"</code>: The claim could not be verified with available sources</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"context_dependent"</code>: The claim's truthfulness depends on context</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Structure</h3>
                      <CodeBlock
                        id="response-structure"
                        language="json"
                        code={`{
  "success": true,
  "data": {
    "claim": "string - The original claim",
    "report": "string - Detailed fact-checking report in Bengali (Markdown format)",
    "verdict": "string - One of: 'true', 'false', 'unverified', 'context_dependent'",
    "sources": [
      {
        "id": "number",
        "title": "string",
        "url": "string",
        "snippet": "string",
        "language": "string - 'Bengali' or 'English'"
      }
    ],
    "relatedArticles": "array - Related fact-check articles from Khoj database",
    "sourceInfo": {
      "hasBengaliSources": "boolean",
      "hasEnglishSources": "boolean",
      "totalSources": "number",
      "geography": "string - 'bangladesh' or 'international'",
      "tierBreakdown": "object - Breakdown of sources by tier"
    },
    "generatedAt": "string - ISO 8601 timestamp"
  },
  "meta": {
    "apiVersion": "string",
    "generatedAt": "string - ISO 8601 timestamp",
    "authenticated": "boolean"
  }
}`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">রায় মান</h3>
                      <p className="text-gray-700 mb-2"><code className="bg-gray-100 px-2 py-1 rounded text-sm">verdict</code> ক্ষেত্রটিতে নিম্নলিখিত মানগুলির যেকোনো একটি থাকতে পারে:</p>
                      <ul className="list-disc ml-6 space-y-1 text-gray-700">
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"true"</code>: দাবিটি সত্য হিসাবে যাচাই করা হয়েছে</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"false"</code>: দাবিটি মিথ্যা হিসাবে যাচাই করা হয়েছে</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"unverified"</code>: উপলব্ধ সূত্র দিয়ে দাবিটি যাচাই করা যায়নি</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">"context_dependent"</code>: দাবির সত্যতা প্রসঙ্গের উপর নির্ভর করে</li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {/* CORS Section */}
              <section
                ref={(el) => { sectionRefs.current["cors"] = el; }}
                id="cors"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("cors", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-gray-700 mb-3">
                        <strong>✅ Full CORS Support:</strong> The API fully supports Cross-Origin Resource Sharing (CORS), allowing you to make requests from any web application, including browser-based JavaScript applications.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">CORS Headers</h3>
                      <p className="text-gray-700 mb-2">
                        All API responses include the following CORS headers:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-gray-700 mb-4">
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Origin: *</code> - Allows requests from any origin</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Methods: GET, POST, OPTIONS</code> - Allowed HTTP methods</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key</code> - Allowed request headers</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Preflight Requests</h3>
                      <p className="text-gray-700 mb-2">
                        The API automatically handles CORS preflight (OPTIONS) requests. Browsers will send these automatically before making cross-origin POST requests.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Responses</h3>
                      <p className="text-gray-700 mb-2">
                        All error responses (400, 401, 429, 500) include proper CORS headers, ensuring that error messages are accessible from cross-origin requests.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Example: Using from Browser</h3>
                      <p className="text-gray-700 mb-2">
                        You can call the API directly from any web page using JavaScript:
                      </p>
                      <CodeBlock
                        id="cors-example"
                        language="javascript"
                        code={`// This works from any web page, no CORS issues
async function factCheck(query, apiKey = null) {
  const headers = { 
    'Content-Type': 'application/json' 
  };
  
  if (apiKey) {
    headers['Authorization'] = \`Bearer \${apiKey.trim()}\`;
  }
  
  const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fact-check failed');
  }
  
  return await response.json();
}

// Usage
factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে')
  .then(result => console.log('Verdict:', result.data.verdict))
  .catch(error => console.error('Error:', error));`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-gray-700 mb-3">
                        <strong>✅ সম্পূর্ণ CORS সমর্থন:</strong> API সম্পূর্ণরূপে Cross-Origin Resource Sharing (CORS) সমর্থন করে, যা আপনাকে যেকোনো ওয়েব অ্যাপ্লিকেশন থেকে, ব্রাউজার-ভিত্তিক JavaScript অ্যাপ্লিকেশন সহ, অনুরোধ করতে দেয়।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">CORS হেডার</h3>
                      <p className="text-gray-700 mb-2">
                        সমস্ত API প্রতিক্রিয়ায় নিম্নলিখিত CORS হেডার অন্তর্ভুক্ত থাকে:
                      </p>
                      <ul className="list-disc ml-6 space-y-1 text-gray-700 mb-4">
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Origin: *</code> - যেকোনো উৎস থেকে অনুরোধের অনুমতি দেয়</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Methods: GET, POST, OPTIONS</code> - অনুমোদিত HTTP পদ্ধতি</li>
                        <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key</code> - অনুমোদিত অনুরোধ হেডার</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">প্রিফ্লাইট অনুরোধ</h3>
                      <p className="text-gray-700 mb-2">
                        API স্বয়ংক্রিয়ভাবে CORS প্রিফ্লাইট (OPTIONS) অনুরোধ পরিচালনা করে। ব্রাউজারগুলি ক্রস-অরিজিন POST অনুরোধ করার আগে স্বয়ংক্রিয়ভাবে এগুলি পাঠাবে।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">ত্রুটি প্রতিক্রিয়া</h3>
                      <p className="text-gray-700 mb-2">
                        সমস্ত ত্রুটি প্রতিক্রিয়া (400, 401, 429, 500) সঠিক CORS হেডার অন্তর্ভুক্ত করে, নিশ্চিত করে যে ক্রস-অরিজিন অনুরোধ থেকে ত্রুটি বার্তাগুলি অ্যাক্সেসযোগ্য।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">উদাহরণ: ব্রাউজার থেকে ব্যবহার</h3>
                      <p className="text-gray-700 mb-2">
                        আপনি JavaScript ব্যবহার করে যেকোনো ওয়েব পৃষ্ঠা থেকে সরাসরি API কল করতে পারেন:
                      </p>
                      <CodeBlock
                        id="cors-example-bn"
                        language="javascript"
                        code={`// এটি যেকোনো ওয়েব পৃষ্ঠা থেকে কাজ করে, CORS সমস্যা নেই
async function factCheck(query, apiKey = null) {
  const headers = { 
    'Content-Type': 'application/json' 
  };
  
  if (apiKey) {
    headers['Authorization'] = \`Bearer \${apiKey.trim()}\`;
  }
  
  const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fact-check failed');
  }
  
  return await response.json();
}

// ব্যবহার
factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে')
  .then(result => console.log('Verdict:', result.data.verdict))
  .catch(error => console.error('Error:', error));`}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Code Examples Section */}
              <section
                ref={(el) => { sectionRefs.current["code-examples"] = el; }}
                id="code-examples"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("codeExamples", language)}
                </h2>
                <CodeExamples language={language} />
              </section>

              {/* Configuration Section */}
              <section
                ref={(el) => { sectionRefs.current["configuration"] = el; }}
                id="configuration"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("configuration", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      For testing purposes, you can disable authentication by setting <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> in your environment variables.
                    </p>
                    <p className="text-gray-700">
                      <strong>⚠️ WARNING:</strong> Only use this in development/testing environments, never in production!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      পরীক্ষার উদ্দেশ্যে, আপনি আপনার পরিবেশ ভেরিয়েবলে <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> সেট করে প্রমাণীকরণ নিষ্ক্রিয় করতে পারেন।
                    </p>
                    <p className="text-gray-700">
                      <strong>⚠️ সতর্কতা:</strong> এটি কেবল উন্নয়ন/পরীক্ষার পরিবেশে ব্যবহার করুন, কখনই প্রোডাকশনে নয়!
                    </p>
                  </div>
                )}
              </section>

              {/* Rate Limiting Section */}
              <section
                ref={(el) => { sectionRefs.current["rate-limiting"] = el; }}
                id="rate-limiting"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("rateLimiting", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Rate limits are configured per API key. The default rate limit is <strong>100 requests per hour</strong>.
                    </p>
                    <p className="text-gray-700">
                      Rate limit information is included in response headers:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-gray-700">
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Limit</code>: Total requests allowed</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Remaining</code>: Remaining requests</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code>: Reset timestamp</li>
                    </ul>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      হার সীমা প্রতিটি API কী অনুযায়ী কনফিগার করা হয়। ডিফল্ট হার সীমা হল <strong>প্রতি ঘন্টায় ১০০ অনুরোধ</strong>।
                    </p>
                    <p className="text-gray-700">
                      হার সীমা তথ্য প্রতিক্রিয়া হেডারে অন্তর্ভুক্ত করা হয়:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-gray-700">
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Limit</code>: অনুমোদিত মোট অনুরোধ</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Remaining</code>: অবশিষ্ট অনুরোধ</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code>: রিসেট টাইমস্ট্যাম্প</li>
                    </ul>
                  </div>
                )}
              </section>

              {/* Error Handling Section */}
              <section
                ref={(el) => { sectionRefs.current["error-handling"] = el; }}
                id="error-handling"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("errorHandling", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-700 mb-4"><strong>Common Error Codes:</strong></p>
                      <ul className="space-y-3 text-gray-700 mb-6">
                        <li>
                          <strong>400 Bad Request:</strong> Invalid or missing query parameter, or invalid JSON in request body
                        </li>
                        <li>
                          <strong>401 Unauthorized:</strong> Invalid or missing API key. For development, set <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> in your server's .env file to test without an API key.
                        </li>
                        <li>
                          <strong>429 Too Many Requests:</strong> Rate limit exceeded
                        </li>
                        <li>
                          <strong>500 Internal Server Error:</strong> Server-side error occurred
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Error Response Examples</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-700 mb-2"><strong>400 Bad Request:</strong></p>
                          <CodeBlock
                            id="error-400"
                            language="json"
                            code={`{
  "error": "Bad Request",
  "message": "Query is required and must be a non-empty string"
}`}
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>401 Unauthorized:</strong></p>
                          <CodeBlock
                            id="error-401"
                            language="json"
                            code={`{
  "error": "Unauthorized",
  "message": "No API key provided. Please provide a valid API key...",
  "developmentTip": "Set API_AUTH_REQUIRED=false in your .env file..."
}`}
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>429 Too Many Requests:</strong></p>
                          <CodeBlock
                            id="error-429"
                            language="json"
                            code={`{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your rate limit. Please try again after 2024-01-01T13:00:00.000Z.",
  "resetAt": "2024-01-01T13:00:00.000Z"
}`}
                          />
                          <p className="text-gray-600 text-sm mt-2">
                            Response headers also include: <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Limit</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Remaining</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>500 Internal Server Error:</strong></p>
                          <CodeBlock
                            id="error-500"
                            language="json"
                            code={`{
  "success": false,
  "error": "Internal Server Error",
  "message": "Failed to generate fact-checking report"
}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-700 mb-4"><strong>সাধারণ ত্রুটি কোড:</strong></p>
                      <ul className="space-y-3 text-gray-700 mb-6">
                        <li>
                          <strong>400 Bad Request:</strong> অবৈধ বা অনুপস্থিত ক্যোয়ারী প্যারামিটার, বা অনুরোধ বডিতে অবৈধ JSON
                        </li>
                        <li>
                          <strong>401 Unauthorized:</strong> অবৈধ বা অনুপস্থিত API কী। উন্নয়নের জন্য, API কী ছাড়া পরীক্ষা করতে আপনার সার্ভারের .env ফাইলে <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> সেট করুন।
                        </li>
                        <li>
                          <strong>429 Too Many Requests:</strong> হার সীমা অতিক্রম করেছে
                        </li>
                        <li>
                          <strong>500 Internal Server Error:</strong> সার্ভার-সাইড ত্রুটি ঘটেছে
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">ত্রুটি প্রতিক্রিয়া উদাহরণ</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-700 mb-2"><strong>400 Bad Request:</strong></p>
                          <CodeBlock
                            id="error-400-bn"
                            language="json"
                            code={`{
  "error": "Bad Request",
  "message": "Query is required and must be a non-empty string"
}`}
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>401 Unauthorized:</strong></p>
                          <CodeBlock
                            id="error-401-bn"
                            language="json"
                            code={`{
  "error": "Unauthorized",
  "message": "No API key provided. Please provide a valid API key...",
  "developmentTip": "Set API_AUTH_REQUIRED=false in your .env file..."
}`}
                          />
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>429 Too Many Requests:</strong></p>
                          <CodeBlock
                            id="error-429-bn"
                            language="json"
                            code={`{
  "error": "Rate limit exceeded",
  "message": "You have exceeded your rate limit. Please try again after 2024-01-01T13:00:00.000Z.",
  "resetAt": "2024-01-01T13:00:00.000Z"
}`}
                          />
                          <p className="text-gray-600 text-sm mt-2">
                            প্রতিক্রিয়া হেডারেও অন্তর্ভুক্ত: <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Limit</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Remaining</code>, <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-700 mb-2"><strong>500 Internal Server Error:</strong></p>
                          <CodeBlock
                            id="error-500-bn"
                            language="json"
                            code={`{
  "success": false,
  "error": "Internal Server Error",
  "message": "Failed to generate fact-checking report"
}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Testing Section */}
              <section
                ref={(el) => { sectionRefs.current["testing"] = el; }}
                id="testing"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("testing", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Test with API Key (Production)</h3>
                      <CodeBlock
                        id="test-with-key"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Without API Key (Development)</h3>
                      <p className="text-gray-700 mb-2 text-sm">
                        ⚠️ Requires <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> in server's .env file
                      </p>
                      <CodeBlock
                        id="test-without-key"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Test API Info Endpoint</h3>
                      <CodeBlock
                        id="test-info"
                        language="bash"
                        code={`curl https://khoj-bd.com/api/v1/factcheck`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">API কী দিয়ে পরীক্ষা করুন (প্রোডাকশন)</h3>
                      <CodeBlock
                        id="test-with-key-bn"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">API কী ছাড়া পরীক্ষা করুন (উন্নয়ন)</h3>
                      <p className="text-gray-700 mb-2 text-sm">
                        ⚠️ সার্ভারের .env ফাইলে <code className="bg-gray-100 px-2 py-1 rounded text-sm">API_AUTH_REQUIRED=false</code> প্রয়োজন
                      </p>
                      <CodeBlock
                        id="test-without-key-bn"
                        language="bash"
                        code={`curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'`}
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* Best Practices Section */}
              <section
                ref={(el) => { sectionRefs.current["best-practices"] = el; }}
                id="best-practices"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("bestPractices", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Cache Results</h3>
                      <p className="text-gray-700 mb-2">
                        Fact-checking reports are deterministic for the same query. Consider caching results to reduce API calls and improve response times.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Handle Rate Limits</h3>
                      <p className="text-gray-700 mb-2">
                        Implement exponential backoff when you receive a 429 response. Check the <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code> header to know when to retry.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Error Handling</h3>
                      <p className="text-gray-700 mb-2">
                        Always check the response status and handle errors appropriately. Implement retry logic for transient errors.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Query Formatting</h3>
                      <p className="text-gray-700 mb-2">
                        Provide clear, specific claims for better fact-checking results. Avoid vague or overly broad queries.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Store API Keys Securely</h3>
                      <p className="text-gray-700 mb-2">
                        Never commit API keys to version control. Store them in environment variables and use different keys for development and production.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">১. ফলাফল ক্যাশ করুন</h3>
                      <p className="text-gray-700 mb-2">
                        একই ক্যোয়ারীর জন্য ফ্যাক্ট-চেকিং প্রতিবেদন নির্ধারিত। API কল কমাতে এবং প্রতিক্রিয়া সময় উন্নত করতে ফলাফল ক্যাশ করার কথা বিবেচনা করুন।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">২. হার সীমা পরিচালনা করুন</h3>
                      <p className="text-gray-700 mb-2">
                        আপনি 429 প্রতিক্রিয়া পেলে সূচকীয় ব্যাকঅফ প্রয়োগ করুন। কখন পুনরায় চেষ্টা করতে হবে তা জানতে <code className="bg-gray-100 px-2 py-1 rounded text-sm">X-RateLimit-Reset</code> হেডার পরীক্ষা করুন।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">৩. ত্রুটি পরিচালনা</h3>
                      <p className="text-gray-700 mb-2">
                        সর্বদা প্রতিক্রিয়া অবস্থা পরীক্ষা করুন এবং ত্রুটিগুলি যথাযথভাবে পরিচালনা করুন। ক্ষণস্থায়ী ত্রুটির জন্য পুনরায় চেষ্টা করার যুক্তি প্রয়োগ করুন।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">৪. ক্যোয়ারী ফরম্যাটিং</h3>
                      <p className="text-gray-700 mb-2">
                        ভাল ফ্যাক্ট-চেকিং ফলাফলের জন্য পরিষ্কার, নির্দিষ্ট দাবি প্রদান করুন। অস্পষ্ট বা অত্যধিক বিস্তৃত ক্যোয়ারী এড়িয়ে চলুন।
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">৫. API কী নিরাপদে সংরক্ষণ করুন</h3>
                      <p className="text-gray-700 mb-2">
                        কখনই API কী সংস্করণ নিয়ন্ত্রণে কমিট করবেন না। এগুলি পরিবেশ ভেরিয়েবলে সংরক্ষণ করুন এবং উন্নয়ন এবং প্রোডাকশনের জন্য বিভিন্ন কী ব্যবহার করুন।
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* FAQ Section */}
              <section
                ref={(el) => { sectionRefs.current["faq"] = el; }}
                id="faq"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("faq", language)}
                </h2>
                <FAQ language={language} />
              </section>

              {/* Support Section */}
              <section
                ref={(el) => { sectionRefs.current["support"] = el; }}
                id="support"
                className="scroll-mt-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  {t("support", language)}
                </h2>
                {language === "en" ? (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>Email:</strong> <a href="mailto:info@khoj-bd.com" className="text-primary-600 hover:underline">info@khoj-bd.com</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Website:</strong> <a href="https://khoj-bd.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">https://khoj-bd.com</a>
                    </p>
                    <p className="text-gray-700">
                      To get an API key, log in with your Google account and visit the{" "}
                      <Link href="/get-api-key" className="text-primary-600 hover:underline">Get API Key</Link> page.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      <strong>ইমেইল:</strong> <a href="mailto:info@khoj-bd.com" className="text-primary-600 hover:underline">info@khoj-bd.com</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>ওয়েবসাইট:</strong> <a href="https://khoj-bd.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">https://khoj-bd.com</a>
                    </p>
                    <p className="text-gray-700">
                      API কী পেতে, আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন এবং{" "}
                      <Link href="/get-api-key" className="text-primary-600 hover:underline">API কী পান</Link> পৃষ্ঠায় যান।
                    </p>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {isLoggedIn ? (
            <Link
              href="/get-api-key"
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Key className="h-5 w-5" />
              <span>{t("getApiKey", language)}</span>
            </Link>
          ) : (
            <Link
              href="/auth/signin?callbackUrl=/get-api-key"
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              <span>{t("loginToGetKey", language)}</span>
            </Link>
          )}
          <a
            href="mailto:info@khoj-bd.com"
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="h-5 w-5" />
            <span>{t("contactSupport", language)}</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Code Examples Component
function CodeExamples({ language }: { language: Language }) {
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, lang, id }: { code: string; lang: string; id: string }) => (
    <div className="relative group">
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <pre className="text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copiedCode === id ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </button>
    </div>
  );

  const examples: { [key: string]: { code: string; id: string } } = {
    javascript: {
      id: "js-example",
      code: `async function factCheck(query, apiKey = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Only add API key if provided (optional for development)
  if (apiKey) {
    headers['Authorization'] = \`Bearer \${apiKey.trim()}\`;
  }
  
  const response = await fetch('https://khoj-bd.com/api/v1/factcheck', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Fact-check failed');
  }

  const data = await response.json();
  return data;
}

// Usage with API key (production)
factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে', 'your-api-key')
  .then(result => {
    console.log('Verdict:', result.data.verdict);
    console.log('Report:', result.data.report);
    console.log('Sources:', result.data.sources.length);
  })
  .catch(error => console.error('Error:', error));

// Usage without API key (development - requires API_AUTH_REQUIRED=false)
factCheck('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে')
  .then(result => {
    console.log('Verdict:', result.data.verdict);
  })
  .catch(error => console.error('Error:', error));`
    },
    python: {
      id: "python-example",
      code: `import requests

def fact_check(query, api_key=None):
    url = 'https://khoj-bd.com/api/v1/factcheck'
    headers = {
        'Content-Type': 'application/json',
    }
    
    # Only add API key if provided (optional for development)
    if api_key:
        headers['Authorization'] = f'Bearer {api_key.strip()}'
    
    data = {'query': query}
    
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    
    return response.json()

# Usage with API key (production)
result = fact_check('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে', 'your-api-key')
print(f"Verdict: {result['data']['verdict']}")
print(f"Report: {result['data']['report']}")
print(f"Sources: {len(result['data']['sources'])}")

# Usage without API key (development - requires API_AUTH_REQUIRED=false)
result = fact_check('বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে')
print(f"Verdict: {result['data']['verdict']}")`
    },
    powershell: {
      id: "powershell-example",
      code: `# PowerShell example for Windows
$apiKey = "YOUR_API_KEY"
$query = "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"
$url = "https://khoj-bd.com/api/v1/factcheck"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $apiKey"
}

$body = @{
    query = $query
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json"
    
    Write-Host "Verdict: $($response.data.verdict)"
    Write-Host "Report: $($response.data.report)"
    Write-Host "Sources: $($response.data.sources.Count)"
    
    # Save response to file
    $response | ConvertTo-Json -Depth 10 | Out-File -FilePath "response.json" -Encoding UTF8
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody"
    }
}`
    },
    curl: {
      id: "curl-example",
      code: `# Basic request
curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}'

# Save response to file
curl -X POST https://khoj-bd.com/api/v1/factcheck \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your-api-key" \\
  -d '{"query": "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া আছে"}' \\
  -o response.json`
    }
  };

  return (
    <div className="space-y-4">
      {language === "en" ? (
        <p className="text-gray-700">
          Select a programming language to see example code:
        </p>
      ) : (
        <p className="text-gray-700">
          উদাহরণ কোড দেখতে একটি প্রোগ্রামিং ভাষা নির্বাচন করুন:
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {Object.keys(examples).map((lang) => (
          <button
            key={lang}
            onClick={() => setSelectedLang(lang)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLang === lang
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {lang === "javascript" ? "JavaScript/Node.js" : lang.charAt(0).toUpperCase() + lang.slice(1)}
          </button>
        ))}
      </div>
      {examples[selectedLang] && (
        <CodeBlock
          code={examples[selectedLang].code}
          lang={selectedLang}
          id={examples[selectedLang].id}
        />
      )}
    </div>
  );
}

// FAQ Component
function FAQ({ language }: { language: Language }) {
  const faqs = language === "en" ? [
    {
      q: "How can media organizations use Khoj as an AI-powered fact-checking tool?",
      a: "Media organizations can integrate Khoj API into their content management systems to automatically fact-check claims in articles before publication. Journalists can use it to verify information from sources, and newsrooms can build automated fact-checking workflows to flag potentially false information for review."
    },
    {
      q: "How can government departments and civic tech initiatives use this API?",
      a: "Government departments can use Khoj API to monitor and verify public claims, track misinformation campaigns, and provide verified information to citizens. Civic tech initiatives can build applications that help citizens verify information they encounter online, creating more informed communities."
    },
    {
      q: "What is the rate limit?",
      a: "Default is 100 requests per hour per API key. Contact info@khoj-bd.com for higher limits based on your needs."
    },
    {
      q: "How do I manage my API key?",
      a: "Log in with your Google account and visit the Get API Key page to view or request your API key. Each user can have one API key assigned to them."
    },
    {
      q: "What languages are supported?",
      a: "The API supports Bengali and English queries. Reports are generated in Bengali."
    },
    {
      q: "How long does a fact-check take?",
      a: "Typically 10-30 seconds, depending on query complexity and source availability."
    },
    {
      q: "Can I cache the results?",
      a: "Yes! Results are deterministic for the same query, so caching is recommended to reduce API calls and improve response times."
    }
  ] : [
    {
      q: "মিডিয়া সংস্থাগুলি Khoj-কে AI-চালিত ফ্যাক্ট-চেকিং টুল হিসাবে কীভাবে ব্যবহার করতে পারে?",
      a: "মিডিয়া সংস্থাগুলি তাদের কন্টেন্ট ম্যানেজমেন্ট সিস্টেমে Khoj API একীভূত করতে পারে প্রকাশনার আগে নিবন্ধগুলিতে দাবিগুলি স্বয়ংক্রিয়ভাবে ফ্যাক্ট-চেক করার জন্য। সাংবাদিকরা এটি সূত্র থেকে তথ্য যাচাই করতে ব্যবহার করতে পারেন, এবং নিউজরুমগুলি পর্যালোচনার জন্য সম্ভাব্য মিথ্যা তথ্য চিহ্নিত করতে স্বয়ংক্রিয় ফ্যাক্ট-চেকিং ওয়ার্কফ্লো তৈরি করতে পারে।"
    },
    {
      q: "সরকারি বিভাগ এবং নাগরিক প্রযুক্তি উদ্যোগগুলি এই API কীভাবে ব্যবহার করতে পারে?",
      a: "সরকারি বিভাগগুলি Khoj API ব্যবহার করতে পারে জনসাধারণের দাবি নিরীক্ষণ এবং যাচাই করতে, ভুল তথ্য প্রচার ট্র্যাক করতে এবং নাগরিকদের যাচাইকৃত তথ্য প্রদান করতে। নাগরিক প্রযুক্তি উদ্যোগগুলি এমন অ্যাপ্লিকেশন তৈরি করতে পারে যা নাগরিকদের অনলাইনে যে তথ্যের মুখোমুখি হয় তা যাচাই করতে সাহায্য করে, আরও অবহিত সম্প্রদায় তৈরি করে।"
    },
    {
      q: "হার সীমা কত?",
      a: "ডিফল্ট হল প্রতি API কী প্রতি ঘন্টায় ১০০ অনুরোধ। আপনার প্রয়োজনের ভিত্তিতে উচ্চতর সীমার জন্য info@khoj-bd.com-এ যোগাযোগ করুন।"
    },
    {
      q: "আমি আমার API কী কীভাবে পরিচালনা করব?",
      a: "আপনার Google অ্যাকাউন্ট দিয়ে লগইন করুন এবং আপনার API কী দেখতে বা অনুরোধ করতে API কী পান পৃষ্ঠায় যান। প্রতিটি ব্যবহারকারীর একটি API কী বরাদ্দ করা যেতে পারে।"
    },
    {
      q: "কোন ভাষাগুলি সমর্থিত?",
      a: "API বাংলা এবং ইংরেজি ক্যোয়ারী সমর্থন করে। প্রতিবেদন বাংলায় তৈরি হয়।"
    },
    {
      q: "একটি ফ্যাক্ট-চেক করতে কত সময় লাগে?",
      a: "সাধারণত ১০-৩০ সেকেন্ড, ক্যোয়ারী জটিলতা এবং সূত্রের প্রাপ্যতার উপর নির্ভর করে।"
    },
    {
      q: "আমি ফলাফল ক্যাশ করতে পারি?",
      a: "হ্যাঁ! একই ক্যোয়ারীর জন্য ফলাফল নির্ধারিত, তাই API কল কমাতে এবং প্রতিক্রিয়া সময় উন্নত করতে ক্যাশিং সুপারিশ করা হয়।"
    }
  ];

  return (
    <div className="space-y-6">
      {faqs.map((faq, index) => (
        <div key={index} className="border-l-4 border-primary-500 pl-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {faq.q}
          </h3>
          <p className="text-gray-700">
            {faq.a}
          </p>
        </div>
      ))}
    </div>
  );
}
