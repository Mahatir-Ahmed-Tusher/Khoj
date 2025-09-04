'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import FeatureWidget from '@/components/FeatureWidget'
import AIFactCheckWidget from '@/components/AIFactCheckWidget'
import Link from 'next/link'
import { getLatestArticles } from '@/lib/data'

export default function HomePage() {
  const allFactChecks = getLatestArticles(10)
  const [filter, setFilter] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState(allFactChecks)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Get the 3 latest articles for hero carousel
  const latestArticles = allFactChecks.slice(0, 3)

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % latestArticles.length)
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [latestArticles.length])

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    if (newFilter === 'all') {
      setFilteredArticles(allFactChecks)
    } else {
      const filtered = allFactChecks.filter(article => article.verdict === newFilter)
      setFilteredArticles(filtered)
    }
  }

  const getFilterText = (filterValue: string) => {
    switch (filterValue) {
      case 'true': return 'সত্য'
      case 'false': return 'মিথ্যা'
      case 'misleading': return 'ভ্রান্তিমূলক'
      default: return 'সব'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section with Grid Background */}
      <section className="relative bg-cover bg-center bg-no-repeat text-white py-12">
        {/* Grid Background - Behind the image */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
        
        {/* Main Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/khoj.png)' }}></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 font-solaiman-lipi" style={{
              textShadow: '0 0 4px rgba(255, 255, 255, 0.4), 0 0 8px rgba(255, 255, 255, 0.3)'
            }}>খোঁজ</h1>
            <p className="text-xl md:text-2xl text-white mb-6 font-solaiman-lipi animate-pulse" style={{
              textShadow: '0 0 3px rgba(255, 255, 255, 0.3), 0 0 6px rgba(255, 255, 255, 0.2)',
              animation: 'glow 2s ease-in-out infinite alternate'
            }}>
              কৃত্রিম বুদ্ধিমত্তা চালিত প্রথম বাংলা ফ্যাক্টচেকিং প্ল্যাটফর্ম
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              placeholder="যেকোনো দাবি বা তথ্য লিখুন..."
              className="mb-4"
            />
            <p className="text-white text-sm mb-6">
              সত্যের সন্ধান, তথ্যের শুদ্ধি
            </p>
            
            {/* Floating Feature Buttons */}
            <div className="flex justify-center space-x-2 md:space-x-4 flex-wrap">
              <Link href="/image-check" className="px-4 md:px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">ছবি যাচাই</span>
              </Link>
              <Link href="/text-check" className="px-4 md:px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">লেখা যাচাই</span>
              </Link>
              <Link href="/source-search" className="px-4 md:px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">উৎস সন্ধান</span>
              </Link>
              <Link href="/mythbusting" className="px-4 md:px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">মিথবাস্টিং</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Fact Checks */}
      <section className="py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* AI FactCheck Widget - Left Side */}
          <div className="hidden lg:block absolute -left-12 top-16 w-80">
            <AIFactCheckWidget />
          </div>
          
          {/* Right Widget - Fixed Position */}
          <div className="hidden lg:block absolute -right-12 top-16 w-80">
            <FeatureWidget />
          </div>
          
          {/* Mobile Widgets */}
          <div className="lg:hidden">
            <AIFactCheckWidget />
            <FeatureWidget />
          </div>
          
          {/* Main Content - Centered */}
          <div className="flex flex-col items-center max-w-4xl mx-auto">
              <div className="text-center mb-4 w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-2 font-solaiman-lipi">
                  আমাদের সাম্প্রতিক ফ্যাক্টচেক সমূহ
                </h2>
                <p className="text-base text-gray-600 font-solaiman-lipi">
                  সর্বশেষ যাচাইকৃত দাবি এবং তথ্য
                </p>
              </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-4 w-full">
            <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-md">
              {[
                { value: 'all', label: 'সব', color: 'bg-gray-100 text-gray-700' },
                { value: 'true', label: 'সত্য', color: 'bg-green-100 text-green-700' },
                { value: 'false', label: 'মিথ্যা', color: 'bg-red-100 text-red-700' },
                { value: 'misleading', label: 'ভ্রান্তিমূলক', color: 'bg-yellow-100 text-yellow-700' },
                { value: 'debunk', label: 'খন্ডন', color: 'bg-purple-100 text-purple-700' }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => handleFilterChange(filterOption.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    filter === filterOption.value
                      ? filterOption.color
                      : 'text-gray-600 hover:text-gray-800'
                  } font-solaiman-lipi`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Hero Carousel */}
          <div className="mb-4 w-full">
            <div className="relative">
              {/* Main Carousel Container */}
              <div className="relative h-96 overflow-hidden">
                <div className="flex items-center justify-center h-full">
                  {latestArticles.map((article, index) => (
                    <div 
                      key={article.id}
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
          
          <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
            {filteredArticles.map((article) => (
              <article key={article.id} className="bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer rounded-xl" onClick={() => window.location.href = `/factchecks/${article.slug}`}>
                {/* Thumbnail */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={article.thumbnail || '/khoj.png'} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Verdict Badge - Top Right */}
                  <div className="absolute top-1 right-1">
                    <span className={`inline-block px-1 py-0.5 rounded text-xs font-bold text-white ${
                      article.verdict === 'true' ? 'bg-green-600' :
                      article.verdict === 'false' ? 'bg-red-600' :
                      article.verdict === 'misleading' ? 'bg-yellow-600' :
                      article.verdict === 'debunk' ? 'bg-purple-600' :
                      'bg-gray-600'
                    }`}>
                      {article.verdict === 'true' ? 'TRUE' :
                       article.verdict === 'false' ? 'FALSE' :
                       article.verdict === 'misleading' ? 'MISLEADING' :
                       article.verdict === 'debunk' ? 'DEBUNK' : 'UNVERIFIED'}
                    </span>
                  </div>
                  {/* FACT CHECK Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <span className="text-white text-2xl font-bold">FACT CHECK</span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-2">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 font-solaiman-lipi line-clamp-3 leading-tight">
                    {article.title}
                  </h3>
                  
                  {/* Tags - Desktop Only */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex space-x-1 mb-2 hidden md:flex">
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-solaiman-lipi">
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-solaiman-lipi">
                          +{article.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Preview - Desktop Only */}
                  <p className="text-gray-600 mb-2 line-clamp-1 hidden md:block font-solaiman-lipi text-sm">
                    {article.summary}
                  </p>
                  
                  {/* Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-solaiman-lipi">
                      {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-6 w-full">
            <Link 
              href="/factchecks"
              className="btn-primary inline-flex items-center"
            >
              সব ফ্যাক্টচেক দেখুন
            </Link>
          </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
