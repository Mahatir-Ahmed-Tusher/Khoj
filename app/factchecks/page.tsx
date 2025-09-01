'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { factCheckArticles } from '@/lib/data'

export default function FactChecksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState(factCheckArticles)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterArticles(query, filter)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    filterArticles(searchQuery, newFilter)
  }

  const filterArticles = (query: string, verdictFilter: string) => {
    let filtered = factCheckArticles

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.summary.toLowerCase().includes(query.toLowerCase()) ||
        article.claim.toLowerCase().includes(query.toLowerCase()) ||
        article.author.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by verdict
    if (verdictFilter !== 'all') {
      filtered = filtered.filter(article => article.verdict === verdictFilter)
    }

    setFilteredArticles(filtered)
  }

  const getFilterText = (filterValue: string) => {
    switch (filterValue) {
      case 'true': return 'সত্য'
      case 'false': return 'মিথ্যা'
      case 'misleading': return 'ভ্রান্তিমূলক'
      case 'unverified': return 'অযাচাইকৃত'
      default: return 'সব'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            ফ্যাক্টচেক সমূহ
          </h1>
          <p className="text-lg text-gray-600 font-solaiman-lipi">
            যাচাইকৃত দাবি এবং তথ্যের সম্পূর্ণ তালিকা
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ফ্যাক্টচেক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-solaiman-lipi"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { value: 'all', label: 'সব', color: 'bg-gray-100 text-gray-700' },
              { value: 'true', label: 'সত্য', color: 'bg-green-100 text-green-700' },
              { value: 'false', label: 'মিথ্যা', color: 'bg-red-100 text-red-700' },
              { value: 'misleading', label: 'ভ্রান্তিমূলক', color: 'bg-yellow-100 text-yellow-700' },
              { value: 'unverified', label: 'অযাচাইকৃত', color: 'bg-blue-100 text-blue-700' },
              { value: 'debunk', label: 'খন্ডন', color: 'bg-purple-100 text-purple-700' }
            ].map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => handleFilterChange(filterOption.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === filterOption.value
                    ? filterOption.color
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } font-solaiman-lipi`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600 font-solaiman-lipi">
            {filteredArticles.length} টি ফলাফল পাওয়া গেছে
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="card hover:shadow-lg transition-shadow duration-200">
              {/* Thumbnail */}
              <div className="relative h-48 mb-4 rounded-t-lg overflow-hidden">
                <img 
                  src={article.thumbnail || '/khoj.png'} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
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
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 font-solaiman-lipi">
                  {article.summary}
                </p>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2 font-solaiman-lipi">
                    <strong>দাবি:</strong> {article.claim}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500 font-solaiman-lipi">
                      {article.author}
                    </span>
                  </div>
                  <Link 
                    href={`/factchecks/${article.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm font-solaiman-lipi"
                  >
                    আরও পড়ুন →
                  </Link>
                </div>
                
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-solaiman-lipi">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-solaiman-lipi">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* No Results Message */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-solaiman-lipi">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="text-gray-600 font-solaiman-lipi">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ফ্যাক্টচেক নেই। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
