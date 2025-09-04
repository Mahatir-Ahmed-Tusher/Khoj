'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ChevronLeft, ChevronRight, History, Trash2, Clock } from 'lucide-react'
import { getMuktijuddhoArticles } from '@/lib/data'
import { FactCheckArticle } from '@/lib/utils'
import { SearchHistory } from '@/lib/types'

interface MuktiSidebarProps {
  className?: string
  searchHistory?: SearchHistory[]
  onLoadReport?: (report: SearchHistory) => void
  onClearHistory?: () => void
}

export default function MuktiSidebar({ className = '', searchHistory = [], onLoadReport, onClearHistory }: MuktiSidebarProps) {
  const [articles, setArticles] = useState<FactCheckArticle[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const articlesPerPage = 4

  useEffect(() => {
    const muktijuddhoArticles = getMuktijuddhoArticles()
    setArticles(muktijuddhoArticles)
  }, [])

  if (articles.length === 0) {
    return null
  }

  const totalPages = Math.ceil(articles.length / articlesPerPage)
  const startIndex = currentPage * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = articles.slice(startIndex, endIndex)

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

    return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-red-600 font-solaiman-lipi mb-2 animate-pulse bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-lg">
          মুক্তিযুদ্ধ সম্পর্কিত ফ্যাক্টচেক
        </h3>
        <p className="text-sm text-gray-600 font-solaiman-lipi">
          মুক্তিযুদ্ধ নিয়ে প্রচারিত বিভিন্ন দাবির সত্যতা যাচাই
        </p>
      </div>

      <div className="space-y-4">
        {currentArticles.map((article) => (
          <Link
            key={article.id}
            href={`/factchecks/${article.slug}`}
            className="block group hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
          >
            <div className="space-y-3">
              {/* Thumbnail with Title Overlay */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-200">
                <Image
                  src={article.thumbnail || '/khoj.png'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {/* Dark Gradient Overlay for Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white font-semibold text-sm font-solaiman-lipi line-clamp-2 group-hover:text-red-200 transition-colors duration-200">
                    {article.title}
                  </h4>
                </div>
              </div>
              
              {/* Date Only */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span className="font-solaiman-lipi">
                  {new Date(article.publishedAt).toLocaleDateString('bn-BD')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Buttons */}
      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium font-solaiman-lipi transition-colors duration-200 ${
                currentPage === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>পূর্ববর্তী</span>
            </button>
            
            <span className="text-sm text-gray-500 font-solaiman-lipi">
              {currentPage + 1} / {totalPages}
            </span>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium font-solaiman-lipi transition-colors duration-200 ${
                currentPage === totalPages - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
              }`}
            >
              <span>আরও দেখুন</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          href="/factchecks"
          className="block text-center text-red-600 hover:text-red-700 font-medium font-solaiman-lipi transition-colors duration-200"
        >
          সব ফ্যাক্টচেক দেখুন →
        </Link>
      </div>

      {/* Search History Section - Now below factcheck */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-blue-600 font-solaiman-lipi flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>সার্চ হিস্টরি</span>
          </h3>
          {searchHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-red-500 hover:text-red-700 p-1 rounded"
              title="হিস্টরি মুছুন"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {searchHistory.length === 0 ? (
          <p className="text-sm text-gray-500 font-solaiman-lipi">
            এখনও কোন সার্চ নেই
          </p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {searchHistory.slice(0, 5).map((report) => (
              <div
                key={report.id}
                onClick={() => onLoadReport?.(report)}
                className="cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 font-solaiman-lipi line-clamp-2">
                      {report.query}
                    </p>
                    <p className="text-xs text-gray-500 font-solaiman-lipi mt-1">
                      {new Date(report.timestamp).toLocaleDateString('bn-BD')} - {new Date(report.timestamp).toLocaleTimeString('bn-BD')}
                    </p>
                    <div className="mt-1 flex space-x-1">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                        {report.category}
                      </span>
                      {report.subcategory && (
                        <span className="inline-block bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">
                          {report.subcategory}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {searchHistory.length > 5 && (
              <p className="text-xs text-gray-500 text-center font-solaiman-lipi">
                আরও {searchHistory.length - 5}টি রিপোর্ট...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
