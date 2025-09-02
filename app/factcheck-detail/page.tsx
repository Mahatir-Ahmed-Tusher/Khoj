'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2, Download, ExternalLink, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react'

interface FactCheckReport {
  claim: string
  report: string
  sources: Array<{
    id: number
    title: string
    url: string
    snippet: string
    language?: string
  }>
  relatedArticles?: {
    id: string
    title: string
    slug: string
    summary: string
    verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'debunk'
    publishedAt: string
    author: string
    tags: string[]
    thumbnail?: string
  }[]
  sourceInfo?: {
    hasBengaliSources: boolean
    hasEnglishSources: boolean
    totalSources: number
  }
  generatedAt: string
}

export default function FactCheckDetailPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  
  const [report, setReport] = useState<FactCheckReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query) {
      performFactCheck(query)
    }
  }, [query])

  const performFactCheck = async (searchQuery: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('ফ্যাক্ট চেকিং রিপোর্ট তৈরি করতে সমস্যা হয়েছে')
      }

      const data = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    if (!report) return

         const content = `
Khoj ফ্যাক্ট চেকার রিপোর্ট
========================

দাবি: ${report.claim}
তৈরির তারিখ: ${new Date(report.generatedAt).toLocaleString('bn-BD')}

${report.report}

উৎসসমূহ:
${report.sources.map(source => `${source.id}. ${source.title} - ${source.url}`).join('\n')}

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
     `

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fact-check-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getVerdictIcon = (reportText: string) => {
    const lowerText = reportText.toLowerCase()
    if (lowerText.includes('সত্য') || lowerText.includes('true')) {
      return <CheckCircle className="h-6 w-6 text-green-600" />
    } else if (lowerText.includes('মিথ্যা') || lowerText.includes('false')) {
      return <XCircle className="h-6 w-6 text-red-600" />
    } else if (lowerText.includes('ভ্রান্ত') || lowerText.includes('misleading')) {
      return <AlertCircle className="h-6 w-6 text-yellow-600" />
    } else {
      return <HelpCircle className="h-6 w-6 text-gray-600" />
    }
  }

  if (!query) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ফ্যাক্ট চেকিং এর জন্য একটি দাবি লিখুন
          </h1>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            বিস্তারিত ফ্যাক্ট চেকিং রিপোর্ট
          </h1>
          <p className="text-lg text-gray-600">
            "{query}" এর জন্য বিস্তারিত বিশ্লেষণ
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600">
              ফ্যাক্ট চেকিং রিপোর্ট তৈরি করা হচ্ছে...
            </p>
            <p className="text-sm text-gray-500 mt-2">
              এটি কয়েক মিনিট সময় নিতে পারে
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ত্রুটি ঘটেছে
            </h3>
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {/* Report */}
        {!isLoading && !error && report && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getVerdictIcon(report.report)}
                  <h2 className="text-xl font-bold text-gray-900">
                    ফ্যাক্ট চেকিং রিপোর্ট
                  </h2>
                </div>
                <button
                  onClick={downloadReport}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">দাবি:</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {report.claim}
                </p>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">তৈরির তারিখ:</h3>
                <p className="text-gray-600">
                  {new Date(report.generatedAt).toLocaleString('bn-BD')}
                </p>
              </div>
            </div>

            {/* Detailed Report */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">বিস্তারিত বিশ্লেষণ:</h3>
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {report.report}
                </div>
              </div>
            </div>

            {/* Sources */}
            {report.sources.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">উৎসসমূহ:</h3>
                
                {/* Source Info */}
                {report.sourceInfo && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-700 font-medium">মোট উৎস:</span>
                        <span className="text-blue-600">{report.sourceInfo.totalSources}টি</span>
                      </div>
                      {report.sourceInfo.hasBengaliSources && (
                        <div className="flex items-center space-x-2">
                          <span className="text-green-700 font-medium">বাংলা উৎস:</span>
                          <span className="text-green-600">✓ পাওয়া গেছে</span>
                        </div>
                      )}
                      {report.sourceInfo.hasEnglishSources && (
                        <div className="flex items-center space-x-2">
                          <span className="text-orange-700 font-medium">ইংরেজি উৎস:</span>
                          <span className="text-orange-600">✓ ব্যবহার করা হয়েছে</span>
                        </div>
                      )}
                    </div>
                    {report.sourceInfo.hasEnglishSources && (
                      <p className="text-blue-600 text-sm mt-2">
                        💡 বাংলায় পর্যাপ্ত তথ্য না থাকায় ইংরেজি উৎস থেকে তথ্য সংগ্রহ করে বাংলায় অনুবাদ করা হয়েছে।
                      </p>
                    )}
                  </div>
                )}
                
                <div className="space-y-3">
                  {report.sources.map((source) => (
                    <div key={source.id} className="border-l-4 border-primary-600 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {source.id}. {source.title}
                            </h4>
                            {source.language && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                source.language === 'English' 
                                  ? 'bg-orange-100 text-orange-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {source.language === 'English' ? 'ইংরেজি' : 'বাংলা'}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {source.snippet}
                          </p>
                        </div>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1 ml-4"
                        >
                          <span>উৎস দেখুন</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Articles */}
            {report.relatedArticles && report.relatedArticles.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 সম্পর্কিত নিবন্ধসমূহ:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {report.relatedArticles.map((article) => (
                    <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      {/* Thumbnail */}
                      <div className="relative h-32 mb-3 rounded overflow-hidden">
                        <img 
                          src={article.thumbnail || '/khoj.png'} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Title Overlay with Shadow - Mobile Only */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:hidden"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 md:hidden">
                          <h4 className="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            article.verdict === 'true' ? 'bg-green-100 text-green-800' :
                            article.verdict === 'false' ? 'bg-red-100 text-red-800' :
                            article.verdict === 'misleading' ? 'bg-yellow-100 text-yellow-800' :
                            article.verdict === 'debunk' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {article.verdict === 'true' ? 'সত্য' :
                             article.verdict === 'false' ? 'মিথ্যা' :
                             article.verdict === 'misleading' ? 'ভ্রান্তিমূলক' :
                             article.verdict === 'debunk' ? 'খন্ডন' : 'অযাচাইকৃত'}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm line-clamp-2 hidden md:block">
                          <a 
                            href={`/factchecks/${article.slug}`}
                            className="hover:text-primary-600 transition-colors"
                          >
                            {article.title}
                          </a>
                        </h4>
                        
                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{article.author}</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString('bn-BD')}</span>
                        </div>
                        
                        <div className="mt-2">
                          <a 
                            href={`/factchecks/${article.slug}`}
                            className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                          >
                            পড়ুন →
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
