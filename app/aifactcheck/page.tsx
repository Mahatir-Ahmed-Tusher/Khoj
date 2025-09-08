'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import { Loader2, Download, CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react'

interface FactCheckResult {
  claim: string
  report: string
  sources: Array<{
    id: number
    title: string
    url: string
    snippet: string
  }>
  generatedAt: string
}

export default function AIFactCheckPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<FactCheckResult | null>(null)
  const [error, setError] = useState('')

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery)
    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/factcheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('ফ্যাক্টচেক রিপোর্ট তৈরি করতে সমস্যা হয়েছে')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে')
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    if (!result) return

    const content = `
খোঁজ - AI ফ্যাক্টচেক রিপোর্ট

দাবি: ${result.claim}
তৈরির তারিখ: ${new Date(result.generatedAt).toLocaleDateString('bn-BD')}

${result.report}

---
উৎসসমূহ:
${result.sources.map(source => `${source.id}. ${source.title} - ${source.url}`).join('\n')}

---
খোঁজ - AI-চালিত বাংলা ফ্যাক্টচেকিং প্ল্যাটফর্ম
https://khoj.com
    `.trim()

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `khoj-factcheck-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getVerdictIcon = (report: string) => {
    if (report.includes('সত্য') || report.includes('true')) {
      return <CheckCircle className="h-6 w-6 text-green-600" />
    } else if (report.includes('মিথ্যা') || report.includes('false')) {
      return <XCircle className="h-6 w-6 text-red-600" />
    } else if (report.includes('ভ্রান্তিমূলক') || report.includes('misleading')) {
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />
    } else {
      return <HelpCircle className="h-6 w-6 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            AI ফ্যাক্টচেক
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-tiro-bangla">
            যেকোনো দাবি বা তথ্যের সত্যতা যাচাই করুন AI-এর সাহায্যে
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              placeholder="কি নিয়ে যাচাই করতে চান তা লিখে ফেলুন..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-lg text-gray-600 font-tiro-bangla">
              আপনার জন্য ফ্যাক্টচেক রিপোর্ট তৈরি হচ্ছে...
            </p>
            <p className="text-sm text-gray-500 mt-2 font-tiro-bangla">
              আপনার প্রশ্ন বা দাবি কতোটা জটিল, তার উপর ভিত্তি করে তা কয়েক সেকেন্ড থেকে অন্তত এক মিনিট সময় নিতে পারে, অনুগ্রহ পূর্বক অপেক্ষা করুন...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="card text-center py-8">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
              ত্রুটি ঘটেছে
            </h3>
            <p className="text-gray-600 font-tiro-bangla">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Report Card */}
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {getVerdictIcon(result.report)}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-tiro-bangla">
                      ফ্যাক্টচেক রিপোর্ট
                    </h2>
                    <p className="text-gray-600 font-tiro-bangla">
                      {new Date(result.generatedAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadReport}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>ডাউনলোড</span>
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
                  মূল দাবি:
                </h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg font-tiro-bangla">
                  {result.claim}
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                  বিশ্লেষণ:
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-tiro-bangla">
                  {result.report}
                </div>
              </div>
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                  উৎসসমূহ ({result.sources.length})
                </h3>
                <div className="space-y-4">
                  {result.sources.map((source) => (
                    <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {source.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {source.snippet}
                          </p>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            উৎস দেখুন →
                          </a>
                        </div>
                        <span className="text-gray-400 text-sm">
                          #{source.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {!isLoading && !result && !error && (
          <div className="card text-center py-12">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 font-tiro-bangla">
                কিভাবে কাজ করে?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 font-bold">১</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 font-tiro-bangla">দাবি লিখুন</h4>
                  <p className="text-sm text-gray-600 font-tiro-bangla">
                    যেকোনো দাবি বা তথ্য উপরে দেওয়া বাক্সে লিখুন
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 font-bold">২</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 font-tiro-bangla">AI যাচাই করে</h4>
                  <p className="text-sm text-gray-600 font-tiro-bangla">
                    AI বিশ্বাসযোগ্য উৎস থেকে তথ্য সংগ্রহ করে যাচাই করে
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 font-bold">৩</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2 font-tiro-bangla">রিপোর্ট পান</h4>
                  <p className="text-sm text-gray-600 font-tiro-bangla">
                    বিস্তারিত বিশ্লেষণ এবং উৎস সহ রিপোর্ট পান
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
