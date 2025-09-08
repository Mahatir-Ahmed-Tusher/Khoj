'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { factCheckArticles } from '@/lib/data'

export default function FactChecksPage() {
  // Sort articles by date (newest first)
  const sortedArticles = [...factCheckArticles].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState(sortedArticles)
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Get the 3 latest articles for hero carousel
  const latestArticles = sortedArticles.slice(0, 3)

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % latestArticles.length)
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [latestArticles.length])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterArticles(query, filter)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    filterArticles(searchQuery, newFilter)
  }

  const filterArticles = (query: string, verdictFilter: string) => {
    let filtered = sortedArticles

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

    // Ensure no duplicates by using a Map
    const uniqueArticles = Array.from(
      new Map(filtered.map(article => [article.id, article])).values()
    )

    setFilteredArticles(uniqueArticles)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-tiro-bangla">
            ফ্যাক্টচেক সমূহ
          </h1>
          <p className="text-lg text-gray-600 font-tiro-bangla">
            যাচাইকৃত দাবি এবং তথ্যের সম্পূর্ণ তালিকা
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="ফ্যাক্টচেক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-tiro-bangla"
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
        <div className="mb-6">
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
                } font-tiro-bangla`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-4">
          <p className="text-gray-600 font-tiro-bangla">
            {filteredArticles.length} টি ফলাফল পাওয়া গেছে
          </p>
        </div>

        {/* Hero Section with Carousel */}
        <div className="mb-6">
          <div className="relative">
            {/* Main Carousel Container */}
            <div className="relative h-96 overflow-hidden">
              <div className="flex items-center justify-center h-full">
                {latestArticles.map((article, index) => (
                  <div 
                    key={`carousel-${article.id}-${index}`}
                    className={`absolute transition-all duration-1000 ease-in-out ${
                      index === currentSlide 
                        ? 'z-20 scale-100 opacity-100 transform translate-x-0' 
                        : index === (currentSlide + 1) % latestArticles.length
                        ? 'z-10 scale-75 opacity-60 transform translate-x-32' // Right side
                        : 'z-10 scale-75 opacity-60 transform -translate-x-32' // Left side
                    }`}
                    style={{
                      left: index === currentSlide ? '50%' : 
                            index === (currentSlide + 1) % latestArticles.length ? '70%' : '30%',
                      transform: index === currentSlide ? 'translateX(-50%)' : 
                                index === (currentSlide + 1) % latestArticles.length ? 'translateX(-50%) scale(0.75)' : 
                                'translateX(-50%) scale(0.75)'
                    }}
                  >
                    <article className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-800 w-80">
                      {/* Thumbnail with Title Overlay */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={article.thumbnail || '/khoj.png'} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Dark Gradient Overlay for Title */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                        
                        {/* Verdict Badge - Top Right */}
                        <div className="absolute top-3 right-3">
                          <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                            {article.verdict === 'true' ? 'TRUE' :
                             article.verdict === 'false' ? 'FALSE' :
                             article.verdict === 'misleading' ? 'MISLEADING' :
                             article.verdict === 'debunk' ? 'DEBUNK' : 'UNVERIFIED'}
                          </div>
                        </div>
                        
                        {/* Category Badge - Bottom Center */}
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
                            ফ্যাক্টচেক
                          </div>
                        </div>
                        
                        {/* Title Overlay - Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Content Below Thumbnail */}
                      <div className="p-4 bg-gray-900">
                        <p className="text-gray-300 mb-3 line-clamp-2 text-xs">
                          {article.summary}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-gray-400 text-xs">
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString('bn-BD')}</span>
                          </div>
                          <Link 
                            href={`/factchecks/${article.slug}`}
                            className="text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors"
                          >
                            আরও পড়ুন →
                          </Link>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {latestArticles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-400 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid - Horizontal Layout */}
        <div className="space-y-2">
          {filteredArticles.map((article, index) => (
            <article key={`${article.id}-${index}`} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col md:flex-row">
                {/* Thumbnail - Left Side */}
                <div className="relative h-48 md:h-32 md:w-48 mb-2 md:mb-0 rounded-t-lg md:rounded-l-lg md:rounded-t-none overflow-hidden flex-shrink-0">
                  <img 
                    src={article.thumbnail || '/khoj.png'} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Title Overlay with Shadow - Mobile Only */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:hidden"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
                    <h3 className="text-white font-bold text-lg leading-tight drop-shadow-lg font-tiro-bangla">
                      {article.title}
                    </h3>
                  </div>
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
                
                {/* Content - Right Side */}
                <div className="p-2 md:p-3 flex-1">
                  <Link href={`/factchecks/${article.slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla hidden md:block hover:text-primary-600 cursor-pointer">
                      {article.title}
                    </h3>
                  </Link>
                  
                  {/* Summary - Desktop Only */}
                  <p className="text-gray-600 mb-2 line-clamp-2 md:line-clamp-3 font-tiro-bangla hidden md:block">
                    {article.summary}
                  </p>
                  
                  {/* Claim - Desktop Only */}
                  <div className="mb-2 hidden md:block">
                    <p className="text-sm text-gray-500 mb-1 font-tiro-bangla">
                      <strong>দাবি:</strong> {article.claim}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                      </span>
                      <span className="text-gray-300 hidden md:inline">•</span>
                      <span className="text-sm text-gray-500 font-tiro-bangla hidden md:inline">
                        {article.author}
                      </span>
                      {/* Tags - Mobile Only */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex space-x-1 md:hidden">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                              {tag}
                            </span>
                          ))}
                          {article.tags.length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                              +{article.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Link 
                      href={`/factchecks/${article.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm font-tiro-bangla"
                    >
                      আরও পড়ুন →
                    </Link>
                  </div>
                  
                  {/* Tags - Desktop Only */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 hidden md:flex">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Results Message */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-tiro-bangla">
              কোনো ফলাফল পাওয়া যায়নি
            </h3>
            <p className="text-gray-600 font-tiro-bangla">
              আপনার অনুসন্ধানের সাথে মিলে এমন কোনো ফ্যাক্টচেক নেই। অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন।
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
