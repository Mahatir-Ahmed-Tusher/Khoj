'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface NewsVerificationResult {
  success: boolean
  verdict: 'true' | 'false' | 'misleading'
  confidence: number
  claim: string
  report: string
  sources: Array<{
    id: number
    title: string
    url: string
    snippet: string
  }>
  originalUrl: string
  scrapedTitle: string
  scrapedDomain: string
}

export default function NewsVerificationV2Page() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<NewsVerificationResult | null>(null)
  const [error, setError] = useState('')

  // Get URL from query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlFromParams = urlParams.get('url')
    
    if (urlFromParams) {
      setUrl(decodeURIComponent(urlFromParams))
      // Auto-start verification
      setTimeout(() => {
        handleVerification(decodeURIComponent(urlFromParams))
      }, 500)
    }
  }, [])

  const handleVerification = async (urlToCheck?: string) => {
    const urlToVerify = urlToCheck || url.trim()
    
    if (!urlToVerify) {
      setError('দয়া করে একটি নিউজ URL দিন')
      return
    }

    // Validate URL
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    if (!urlPattern.test(urlToVerify)) {
      setError('দয়া করে একটি বৈধ URL দিন')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/news-verification-v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToVerify }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'নিউজ যাচাই করতে সমস্যা হয়েছে')
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleVerification()
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'false':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'misleading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'সত্য'
      case 'false':
        return 'মিথ্যা'
      case 'misleading':
        return 'ভ্রান্তিমূলক'
      default:
        return 'অযাচাইকৃত'
    }
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 80) return 'উচ্চ'
    if (confidence >= 60) return 'মাঝারি'
    return 'নিম্ন'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-200">
            <span className="text-blue-600 text-3xl">📰</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-tiro-bangla tracking-tight">
            নিউজ যাচাই (ভার্সন ২)
          </h1>
          <p className="text-lg text-gray-600 font-tiro-bangla">
            উন্নত প্রযুক্তি দিয়ে নিউজের সত্যতা যাচাই করুন
          </p>
        </div>

        {/* Auto-check Status */}
        {isLoading && (
          <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 p-6 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 font-tiro-bangla font-medium">
                নিউজ যাচাই হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন
              </p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-tiro-bangla">
                নিউজ আর্টিকেলের URL দিন
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 bg-white/50 backdrop-blur-sm"
              />
              <p className="text-sm text-gray-500 mt-2 font-tiro-bangla">
                যে নিউজ আর্টিকেল যাচাই করতে চান তার লিংক দিন
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-tiro-bangla font-medium transition-all duration-200"
            >
              {isLoading ? 'যাচাই হচ্ছে...' : 'নিউজ যাচাই করুন'}
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
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl border border-gray-200/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-tiro-bangla">
                যাচাইকরণ ফলাফল
              </h3>
              
              <div className="space-y-4">
                {/* Original Article Info */}
                <div className="bg-white/50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-2 font-tiro-bangla">মূল নিউজ আর্টিকেল:</h4>
                  <p className="text-sm text-gray-700 font-tiro-bangla mb-1">
                    <strong>শিরোনাম:</strong> {result.scrapedTitle}
                  </p>
                  <p className="text-sm text-gray-700 font-tiro-bangla mb-1">
                    <strong>ডোমেইন:</strong> {result.scrapedDomain}
                  </p>
                  <a 
                    href={result.originalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 font-tiro-bangla"
                  >
                    মূল আর্টিকেল দেখুন →
                  </a>
                </div>

                {/* Claim */}
                <div>
                  <span className="text-gray-700 font-tiro-bangla text-sm">মূল দাবি:</span>
                  <p className="text-gray-800 mt-1 font-tiro-bangla text-sm font-medium">
                    {result.claim}
                  </p>
                </div>

                {/* Verdict */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-tiro-bangla text-sm">ফলাফল:</span>
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getVerdictColor(result.verdict)}`}>
                    {getVerdictText(result.verdict)}
                  </span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-tiro-bangla text-sm">আত্মবিশ্বাস:</span>
                  <span className="text-gray-800 font-medium text-sm">
                    {getConfidenceText(result.confidence)} ({result.confidence}%)
                  </span>
                </div>

                {/* Report */}
                <div>
                  <span className="text-gray-700 font-tiro-bangla text-sm">বিস্তারিত রিপোর্ট:</span>
                  <div className="mt-2 p-4 bg-white/50 rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-tiro-bangla text-sm leading-relaxed">
                      {result.report}
                    </p>
                  </div>
                </div>

                {/* Sources */}
                {result.sources && result.sources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 font-tiro-bangla">
                      উৎসসমূহ:
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {result.sources.map((source) => (
                        <div key={source.id} className="bg-white/50 border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate flex-1"
                            >
                              {source.title}
                            </a>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 font-tiro-bangla">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 font-tiro-bangla">
            কিভাবে কাজ করে (ভার্সন ২)
          </h2>
          <p className="text-gray-600 mb-6 font-tiro-bangla text-sm">
            এই উন্নত সংস্করণ সরাসরি HTTP requests ব্যবহার করে নিউজ কনটেন্ট ফেচ করে এবং AI দিয়ে বিশ্লেষণ করে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-blue-200">
                <span className="text-blue-600 text-lg">🌐</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">HTTP Request</h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">সরাসরি নিউজ সাইট থেকে কনটেন্ট নেয়</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-200">
                <span className="text-green-600 text-lg">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">AI বিশ্লেষণ</h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">Gemini AI দিয়ে কনটেন্ট বিশ্লেষণ</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-purple-200">
                <span className="text-purple-600 text-lg">🔎</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">অনুসন্ধান</h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">Tavily দিয়ে অতিরিক্ত তথ্য খোঁজা</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center mx-auto mb-3 border border-orange-200">
                <span className="text-orange-600 text-lg">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2 font-tiro-bangla text-sm">রিপোর্ট</h3>
              <p className="text-xs text-gray-600 font-tiro-bangla">চূড়ান্ত ফ্যাক্ট চেক রিপোর্ট</p>
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
  )
}
