'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

function NewsVerificationContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const url = searchParams.get('url')

  useEffect(() => {
    if (!url) {
      router.push('/')
      return
    }

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 10
      })
    }, 500)

    // Simulate step updates
    const steps = [
      'খবরের লিংক যাচাই করা হচ্ছে...',
      'নিউজ আর্টিকেল স্ক্র্যাপ করা হচ্ছে...',
      'কনটেন্ট বিশ্লেষণ করা হচ্ছে...',
      'ফ্যাক্ট-চেকিং করা হচ্ছে...',
      'রিপোর্ট তৈরি করা হচ্ছে...'
    ]

    let stepIndex = 0
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex])
        stepIndex++
      } else {
        clearInterval(stepInterval)
      }
    }, 2000)

    // Call the verification API
    verifyNews(url)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [url, router])

  const verifyNews = async (newsUrl: string) => {
    try {
      const response = await fetch('/api/news-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newsUrl }),
      })

      if (!response.ok) {
        throw new Error('Verification failed')
      }

      const data = await response.json()
      setResult(data)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-800 mb-4 font-tiro-bangla">
              ভেরিফিকেশন ব্যর্থ
            </h1>
            <p className="text-red-700 mb-6 font-tiro-bangla">
              {error}
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium font-tiro-bangla transition-colors"
            >
              হোম পেজে ফিরে যান
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-tiro-bangla">
              নিউজ ভেরিফিকেশন রিপোর্ট
            </h1>
            <p className="text-gray-600 font-tiro-bangla">
              আপনার প্রদত্ত নিউজের বিশ্লেষণ
            </p>
          </div>

          {/* Verdict Card */}
          <div className={`rounded-xl p-6 mb-8 ${
            result.verdict === 'true' ? 'bg-green-50 border-green-200' :
            result.verdict === 'false' ? 'bg-red-50 border-red-200' :
            'bg-yellow-50 border-yellow-200'
          } border-2`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-tiro-bangla">
                  {result.verdict === 'true' ? 'সত্য' :
                   result.verdict === 'false' ? 'মিথ্যা' :
                   'ভ্রান্তিমূলক'}
                </h2>
                <p className="text-sm text-gray-600 font-tiro-bangla">
                  আস্থার মাত্রা: {result.confidence}%
                </p>
              </div>
              <div className={`text-4xl ${
                result.verdict === 'true' ? 'text-green-600' :
                result.verdict === 'false' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {result.verdict === 'true' ? '✅' :
                 result.verdict === 'false' ? '❌' :
                 '⚠️'}
              </div>
            </div>
          </div>

          {/* Claim */}
          {result.claim && (
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-tiro-bangla">
                মূল দাবি
              </h3>
              <p className="text-gray-700 leading-relaxed font-tiro-bangla">
                {result.claim}
              </p>
            </div>
          )}

          {/* Detailed Report */}
          <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-tiro-bangla">
              বিস্তারিত বিশ্লেষণ
            </h3>
            <div className="text-gray-700 leading-relaxed font-tiro-bangla whitespace-pre-line">
              {result.report || result.analysis}
            </div>
          </div>

          {/* Sources */}
          {result.sources && result.sources.length > 0 && (
            <div className="bg-white rounded-xl p-6 mb-8 shadow-sm border">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-tiro-bangla">
                উৎসসমূহ
              </h3>
              <div className="space-y-4">
                {result.sources.map((source: any, index: number) => (
                  <div key={source.id || index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                        [{source.id || index + 1}]
                      </span>
                      <div className="flex-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium font-tiro-bangla"
                        >
                          {source.title}
                        </a>
                        <p className="text-sm text-gray-600 mt-1 font-tiro-bangla">
                          {source.snippet}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Source Info */}
              {result.sourceInfo && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-tiro-bangla">
                    <span className="font-medium">মোট উৎস:</span> {result.sourceInfo.totalSources}টি
                    {result.sourceInfo.hasBengaliSources && " (বাংলা উৎস সহ)"}
                    {result.sourceInfo.hasEnglishSources && " (ইংরেজি উৎস সহ)"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="text-center">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium font-tiro-bangla transition-colors mr-4"
            >
              নতুন নিউজ যাচাই করুন
            </button>
            <button
              onClick={() => window.print()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium font-tiro-bangla transition-colors"
            >
              রিপোর্ট প্রিন্ট করুন
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Loading Animation */}
        <div className="text-center">
          {/* Spinner */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl">🔍</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 font-tiro-bangla">
              {Math.round(progress)}% সম্পূর্ণ
            </p>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            আপনার দেয়া নিউজটা ভেরিফাই হচ্ছে
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-tiro-bangla">
            একটু ধৈর্য্য ধরে অপেক্ষা করুন
          </p>

          {/* Current Step */}
          {currentStep && (
            <div className="bg-white rounded-lg p-4 shadow-sm border max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700 font-medium font-tiro-bangla">
                  {currentStep}
                </p>
              </div>
            </div>
          )}

          {/* URL Display */}
          {url && (
            <div className="mt-8 bg-gray-100 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-gray-600 font-tiro-bangla mb-2">
                যাচাই করা হচ্ছে:
              </p>
              <p className="text-blue-600 font-medium break-all font-tiro-bangla">
                {url}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default function NewsVerificationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 font-tiro-bangla">লোড হচ্ছে...</p>
        </div>
      </div>
    }>
      <NewsVerificationContent />
    </Suspense>
  )
}
