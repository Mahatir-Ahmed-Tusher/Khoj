'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'
import { Loader2, ExternalLink } from 'lucide-react'

interface SearchResult {
  title: string
  url: string
  content: string
  score: number
  published_date?: string
  source: string
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (!response.ok) {
        throw new Error('অনুসন্ধান করতে সমস্যা হয়েছে')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে')
    } finally {
      setIsLoading(false)
    }
  }

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          অনুসন্ধানের জন্য একটি প্রশ্ন লিখুন
        </h1>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          অনুসন্ধানের ফলাফল
        </h1>
        <p className="text-lg text-gray-600">
          "{query}" এর জন্য {results.length} টি ফলাফল পাওয়া গেছে
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            অনুসন্ধান করা হচ্ছে...
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

      {/* Results */}
      {!isLoading && !error && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <div className="card text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                কোন ফলাফল পাওয়া যায়নি
              </h3>
              <p className="text-gray-600">
                আপনার অনুসন্ধানের সাথে মিলে এমন কোন ফলাফল পাওয়া যায়নি
              </p>
            </div>
          ) : (
            results.map((result, index) => (
              <article key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary-600 transition-colors"
                      >
                        {result.title}
                      </a>
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-3">
                      {result.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{result.source}</span>
                        {result.published_date && (
                          <span>
                            {new Date(result.published_date).toLocaleDateString('bn-BD')}
                          </span>
                        )}
                        <span>স্কোর: {Math.round(result.score * 100)}%</span>
                      </div>
                      
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <span>উৎস দেখুন</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
<Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">লোড হচ্ছে...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
      <Footer />
    </div>
  )
}
