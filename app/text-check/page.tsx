'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface TextCheckResult {
  success: boolean
  type: 'ai-detection' | 'plagiarism'
  verdict: 'ai-generated' | 'human-written' | 'plagiarized' | 'original' | 'unverified'
  confidence: 'high' | 'medium' | 'low'
  explanation: string
  score: number
  details?: {
    // AI Detection details
    humanScore?: number
    readabilityScore?: number
    creditsUsed?: number
    creditsRemaining?: number
    version?: string
    language?: string
    attackDetected?: {
      zero_width_space?: boolean
      homoglyph_attack?: boolean
    }
    // Plagiarism details
    plagiarismScore?: number
    sourceCounts?: number
    textWordCounts?: number
    totalPlagiarismWords?: number
    identicalWordCounts?: number
    similarWordCounts?: number
    sources?: Array<{
      score: number
      url: string
      title: string
      author?: string
      description?: string
      plagiarismWords: number
      identicalWordCounts: number
      similarWordCounts: number
      totalNumberOfWords: number
      publishedDate?: number
      source: string
      citation: boolean
      plagiarismFound?: Array<{
        startIndex: number
        endIndex: number
        sequence: string
      }>
      is_excluded: boolean
    }>
  }
}

export default function TextCheckPage() {
  const [text, setText] = useState('')
  const [checkType, setCheckType] = useState<'ai-detection' | 'plagiarism'>('ai-detection')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<TextCheckResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('দয়া করে কিছু লেখা দিন')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/text-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: text.trim(),
          type: checkType
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'লেখা যাচাই করতে সমস্যা হয়েছে')
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।')
    } finally {
      setIsLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'ai-generated':
      case 'plagiarized':
        return 'bg-red-100 text-red-800'
      case 'human-written':
      case 'original':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerdictText = (verdict: string, type: string) => {
    if (type === 'ai-detection') {
      switch (verdict) {
        case 'ai-generated':
          return 'AI দ্বারা তৈরি'
        case 'human-written':
          return 'মানুষের লেখা'
        default:
          return 'অযাচাইকৃত'
      }
    } else {
      switch (verdict) {
        case 'plagiarized':
          return 'চুরি করা লেখা'
        case 'original':
          return 'মূল লেখা'
        default:
          return 'অযাচাইকৃত'
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-600 text-4xl">📝</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            লেখা যাচাই
          </h1>
          <p className="text-xl text-gray-600 font-solaiman-lipi">
            AI দ্বারা তৈরি লেখা এবং চুরি করা লেখা সনাক্ত করুন
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Check Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-solaiman-lipi">
                যাচাইয়ের ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCheckType('ai-detection')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    checkType === 'ai-detection'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🤖</span>
                    <h3 className="font-semibold font-solaiman-lipi">AI ডিটেকশন</h3>
                    <p className="text-sm text-gray-600 font-solaiman-lipi">লেখা AI দ্বারা তৈরি কিনা যাচাই করুন</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckType('plagiarism')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    checkType === 'plagiarism'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🔍</span>
                    <h3 className="font-semibold font-solaiman-lipi">প্লেজিয়ারিজম চেক</h3>
                    <p className="text-sm text-gray-600 font-solaiman-lipi">লেখা চুরি করা কিনা যাচাই করুন</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-solaiman-lipi">
                যাচাই করার জন্য লেখা দিন
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="এখানে আপনার লেখা পেস্ট করুন..."
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1 font-solaiman-lipi">
                {checkType === 'ai-detection' 
                  ? 'সর্বনিম্ন ৩০০ অক্ষর প্রয়োজন (প্রতিশ্রুতিমূলক ফলাফলের জন্য)'
                  : 'সর্বনিম্ন ১০০ অক্ষর প্রয়োজন (প্লেজিয়ারিজম সনাক্তকরণের জন্য)'
                }
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || text.trim().length < (checkType === 'ai-detection' ? 300 : 100)}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-solaiman-lipi"
            >
              {isLoading ? 'যাচাই হচ্ছে...' : `${checkType === 'ai-detection' ? 'AI ডিটেকশন' : 'প্লেজিয়ারিজম'} যাচাই করুন`}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-solaiman-lipi">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-solaiman-lipi">
                যাচাইকরণ ফলাফল
              </h3>
              
              <div className="space-y-4">
                {/* Verdict */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">ফলাফল:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(result.verdict)}`}>
                    {getVerdictText(result.verdict, result.type)}
                  </span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">আত্মবিশ্বাস:</span>
                  <span className="text-gray-900 font-medium">
                    {result.confidence === 'high' ? 'উচ্চ' : 
                     result.confidence === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">
                    {result.type === 'ai-detection' ? 'AI স্কোর:' : 'প্লেজিয়ারিজম স্কোর:'}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {(result.score * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Winston AI Details for AI Detection */}
                {result.type === 'ai-detection' && result.details && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">মানুষের লেখার স্কোর:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.humanScore}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">পঠনযোগ্যতা স্কোর:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.readabilityScore}%
                      </span>
                    </div>

                    {result.details.attackDetected && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2 font-solaiman-lipi">
                          সুরক্ষা সতর্কতা:
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1 font-solaiman-lipi">
                          {result.details.attackDetected.zero_width_space && (
                            <li>• লুকানো অক্ষর সনাক্ত হয়েছে</li>
                          )}
                          {result.details.attackDetected.homoglyph_attack && (
                            <li>• প্রতারণামূলক অক্ষর প্রতিস্থাপন সনাক্ত হয়েছে</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Winston Plagiarism Details for Plagiarism Detection */}
                {result.type === 'plagiarism' && result.details && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">প্লেজিয়ারিজম স্কোর:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.plagiarismScore}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">মিল পাওয়া উৎস:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.sourceCounts}টি
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">মোট শব্দ:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.textWordCounts}টি
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">প্লেজিয়ারাইজড শব্দ:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.totalPlagiarismWords}টি
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">অভিন্ন শব্দ:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.identicalWordCounts}টি
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-solaiman-lipi">সদৃশ শব্দ:</span>
                      <span className="text-gray-900 font-medium">
                        {result.details.similarWordCounts}টি
                      </span>
                    </div>

                    {/* Sources List */}
                    {result.details.sources && result.details.sources.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 font-solaiman-lipi">
                          মিল পাওয়া উৎসসমূহ:
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {result.details.sources.slice(0, 5).map((source, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-md p-3">
                              <div className="flex justify-between items-start mb-1">
                                <a 
                                  href={source.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate"
                                >
                                  {source.title}
                                </a>
                                <span className="text-xs text-gray-500 ml-2">
                                  {source.score}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {source.source} • {source.plagiarismWords}টি শব্দ মিলেছে
                              </p>
                              {source.author && (
                                <p className="text-xs text-gray-500">
                                  লেখক: {source.author}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                        {result.details.sources.length > 5 && (
                          <p className="text-xs text-gray-500 mt-2 font-solaiman-lipi">
                            এবং আরও {result.details.sources.length - 5}টি উৎস...
                          </p>
                        )}
                      </div>
                    )}

                    {result.details.attackDetected && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2 font-solaiman-lipi">
                          সুরক্ষা সতর্কতা:
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-1 font-solaiman-lipi">
                          {result.details.attackDetected.zero_width_space && (
                            <li>• লুকানো অক্ষর সনাক্ত হয়েছে</li>
                          )}
                          {result.details.attackDetected.homoglyph_attack && (
                            <li>• প্রতারণামূলক অক্ষর প্রতিস্থাপন সনাক্ত হয়েছে</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* Explanation */}
                <div>
                  <span className="text-gray-700 font-solaiman-lipi">ব্যাখ্যা:</span>
                  <p className="text-gray-900 mt-1 font-solaiman-lipi">{result.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            কিভাবে কাজ করে
          </h2>
          <p className="text-gray-600 mb-6 font-solaiman-lipi">
            আমাদের AI সিস্টেম লেখার বিভিন্ন বৈশিষ্ট্য বিশ্লেষণ করে AI দ্বারা তৈরি কিনা বা চুরি করা কিনা তা সনাক্ত করে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📝</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">লেখা আপলোড</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">যাচাই করার জন্য লেখা দিন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">AI বিশ্লেষণ</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">AI লেখা বিশ্লেষণ করে</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">ফলাফল</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">বিস্তারিত রিপোর্ট পান</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/"
            className="btn-primary inline-flex items-center"
          >
            ← মূল পৃষ্ঠায় ফিরে যান
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
