'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { getLatestArticles } from '@/lib/data'

export default function HomePage() {
  const allFactChecks = getLatestArticles(9)
  const [filter, setFilter] = useState('all')
  const [filteredArticles, setFilteredArticles] = useState(allFactChecks)

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
      <section className="relative bg-cover bg-center bg-no-repeat text-white py-20">
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
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-solaiman-lipi">খোঁজ</h1>
            <p className="text-xl md:text-2xl text-white mb-8 font-solaiman-lipi">
              কৃত্রিম বুদ্ধিমত্তা চালিত বাংলা ফ্যাক্টচেকিং প্ল্যাটফর্ম
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              placeholder="যেকোনো দাবি বা তথ্য লিখুন..."
              className="mb-6"
            />
            <p className="text-white text-sm mb-8">
              সত্যের সন্ধান, তথ্যের শুদ্ধি
            </p>
            
            {/* Floating Feature Buttons */}
            <div className="flex justify-center space-x-4">
              <Link href="/image-check" className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">ছবি যাচাই</span>
              </Link>
              <Link href="/text-check" className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">লেখা যাচাই</span>
              </Link>
              <Link href="/source-search" className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-white border-opacity-30 shadow-lg">
                <span className="text-white text-sm font-medium font-solaiman-lipi">উৎস সন্ধান</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Fact Checks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              আমাদের সাম্প্রতিক ফ্যাক্টচেক সমূহ
            </h2>
            <p className="text-lg text-gray-600 font-solaiman-lipi">
              সর্বশেষ যাচাইকৃত দাবি এবং তথ্য
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex justify-center mb-8">
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
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                    </span>
                    <Link 
                      href={`/factchecks/${article.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      আরও পড়ুন →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/factchecks"
              className="btn-primary inline-flex items-center"
            >
              সব ফ্যাক্টচেক দেখুন
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
