"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Link from "next/link";
import { Key, CheckCircle, XCircle, Copy, ExternalLink, AlertCircle } from "lucide-react";

export default function GetAPIKeyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Redirect if not logged in
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/get-api-key");
      return;
    }

    // Load existing API key if user is authenticated
    if (status === "authenticated") {
      fetchUserAPIKey();
    }
  }, [status, router]);

  const fetchUserAPIKey = async () => {
    try {
      const response = await fetch("/api/api-keys/assign");
      const data = await response.json();

      if (data.success && data.hasKey) {
        setApiKey(data.apiKey);
      }
    } catch (err) {
      console.error("Error fetching API key:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestKey = async () => {
    setRequesting(true);
    setError(null);

    try {
      const response = await fetch("/api/api-keys/assign", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setApiKey(data.apiKey);
      } else {
        setError(data.message || "Failed to assign API key");
      }
    } catch (err) {
      setError("An error occurred while requesting your API key");
      console.error("Error requesting API key:", err);
    } finally {
      setRequesting(false);
    }
  };

  const handleCopyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Show loading while checking auth
  if (status === "loading" || loading) {
    return <Loading />;
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-100 p-4 rounded-full">
              <Key className="h-12 w-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Your API Key
          </h1>
          <p className="text-gray-600">
            Request your unique API key to access the Khoj Fact-Checking API
          </p>
        </div>

        {/* User Info */}
        {session?.user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900">
                  {session.user.name}
                </p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* API Key Display */}
        {apiKey ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Your API Key
              </h2>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono text-gray-900 break-all">
                  {apiKey}
                </code>
                <button
                  onClick={handleCopyKey}
                  className="ml-4 flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-800 font-semibold mb-1">
                    Keep Your API Key Secure
                  </h3>
                  <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                    <li>Never share your API key publicly</li>
                    <li>Don't commit it to version control</li>
                    <li>Store it securely in environment variables</li>
                    <li>If compromised, contact support immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Next Steps:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  Review the{" "}
                  <Link
                    href="/api-docs"
                    className="text-primary-600 hover:underline"
                  >
                    API Documentation
                  </Link>{" "}
                  for usage examples
                </li>
                <li>Start making API requests with your key</li>
                <li>
                  Use the{" "}
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    Authorization: Bearer {apiKey.substring(0, 8)}...
                  </code>{" "}
                  header in your requests
                </li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No API Key Assigned
              </h2>
              <p className="text-gray-600 mb-6">
                You don't have an API key yet. Click the button below to request
                one.
              </p>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 text-left">
                  <div className="flex items-start">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-red-800 font-semibold mb-1">
                        Error
                      </h3>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleRequestKey}
                disabled={requesting}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                {requesting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Requesting...</span>
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5" />
                    <span>Request API Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Important Information
          </h3>
          <ul className="text-blue-700 space-y-2 text-sm">
            <li>
              • <strong>Google Authentication Required:</strong> You must be logged in with Google to get an API key
            </li>
            <li>
              • Each user can only have <strong>one API key</strong>
            </li>
            <li>
              • API keys are <strong>unique 11-character strings</strong>
            </li>
            <li>
              • Default rate limit: <strong>100 requests per hour</strong>
            </li>
            <li>
              • Read the{" "}
              <Link href="/api-docs" className="underline font-medium">
                API Documentation
              </Link>{" "}
              for usage guidelines
            </li>
            <li>
              • For support, contact{" "}
              <a
                href="mailto:support@khoj-bd.com"
                className="underline font-medium"
              >
                support@khoj-bd.com
              </a>
            </li>
          </ul>
        </div>

        {/* Back to Docs */}
        <div className="mt-6 text-center">
          <Link
            href="/api-docs"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to API Documentation
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

