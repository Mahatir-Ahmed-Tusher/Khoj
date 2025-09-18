'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Footer from '@/components/Footer'
import MuktiSidebar from '@/components/MuktiSidebar'
import { Send, Loader2, Search, Copy, Download, ChevronDown, ChevronUp, Clock, PanelLeftClose, PanelLeftOpen, Share2Icon } from 'lucide-react'
import { parseMarkdown, sanitizeHtml } from '@/lib/markdown'
import { SearchHistory, Source } from '@/lib/types'
import { useSearchLimit } from '@/lib/hooks/useSearchLimit'
import SearchLimitModal from '@/components/SearchLimitModal'
import { useVoiceSearch } from '@/lib/hooks/useVoiceSearch'
import Image from 'next/image'
import ShareModal from '@/components/ShareModal'
// Convex client for on-demand queries/mutations
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  sources?: Source[]
  category?: string | null
  subcategory?: string | null
  verdict?: string
  summary?: string
  ourSiteArticles?: Array<{
    title: string
    url: string
    snippet: string
  }>
}

interface Category {
  id: string
  name: string
  description: string
  subcategories?: Array<{
    id: string
    name: string
  }>
}

export default function MuktiCornerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [currentReport, setCurrentReport] = useState<SearchHistory | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [showSubcategories, setShowSubcategories] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true) // Default collapsed
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [slugId, setSlugId] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Voice search functionality
  const { 
    isRecording, 
    isListening, 
    error: voiceError, 
    startVoiceSearch, 
    stopVoiceSearch, 
    isSupported 
  } = useVoiceSearch()
  
  const { canSearch, recordSearch, loginWithGoogle, remainingSearches } = useSearchLimit()
  
  // Initialize Convex client
  const convex = useConvex()

  // Save to Convex database
  const saveToConvex = useCallback(async (report: SearchHistory) => {
    console.log('[Mukti Corner] saveToConvex called with id:', report.id)
    try {
      // Prepare payload in server schema shape (exactly like Mythbusting)
      const payload = {
        id: report.id,
        query: report.query,
        result: report.response,
        timestamp: report.timestamp.getTime(),
        verdict: (() => {
          const verdict = report.verdict || 'unverified'
          // Map unsupported verdicts to supported ones
          if (verdict === 'partially_true' || verdict === 'context_dependent') {
            return 'misleading' // Map to misleading as closest match
          }
          return verdict as 'true' | 'false' | 'misleading' | 'unverified'
        })(),
        sources: (report.sources || []).map((source: any) => ({
          id: Number(source.id ?? 0),
          title: source.book_title || source.title || '',
          url: source.url || '',
          snippet: source.content_preview || source.snippet || '',
          language: source.language,
        })),
        generatedAt: report.timestamp.toISOString(),
        pageUrl: typeof window !== 'undefined' ? window.location.href : ''
      }
      
      await convex.mutation(api.factChecks.create, payload)
      console.log('[Mukti Corner] Saved successfully')
    } catch (error) {
      console.error('[Mukti Corner] Error saving:', error)
    }
  }, [convex])

  // Initialize messages and fetch categories
  useEffect(() => {
    setIsClient(true)
    setMessages([])
    loadSearchHistory()
    fetchCategories()
  }, [])

  // Listen for voice search results
  useEffect(() => {
    const handleVoiceResult = (event: CustomEvent) => {
      const transcript = event.detail.transcript
      setInputMessage(transcript)
    }

    window.addEventListener('voiceSearchResult', handleVoiceResult as EventListener)
    return () => {
      window.removeEventListener('voiceSearchResult', handleVoiceResult as EventListener)
    }
  }, [])

  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    
    // Set default categories directly
      setCategories([
        {
          id: "general",
          name: "একাত্তোর",
          description: "বাংলাদেশের মুক্তিযুদ্ধ সম্পর্কে সাধারণ প্রশ্ন"
        },
        {
          id: "genocide",
          name: "গণহত্যা",
          description: "১৯৭১ সালের গণহত্যা সম্পর্কে বিস্তারিত তথ্য",
          subcategories: [
            {"id": "statistical", "name": "স্ট্যাটিস্টিক্যাল প্রমাণ"},
            {"id": "historical", "name": "ঐতিহাসিক প্রমাণ"}
          ]
        },
        {
          id: "rape",
          name: "ধর্ষণ",
          description: "পাকিস্তানি সেনাবাহিনীর দ্বারা সংঘটিত ধর্ষণের বিবরণ"
        }
      ])
    
      setIsLoadingCategories(false)
  }

  // Load search history from localStorage
  const loadSearchHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('muktiCornerHistory')
        if (saved) {
          const history = JSON.parse(saved).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp)
          }))
          setSearchHistory(history)
        }
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    }
  }

  // Save search history to localStorage
  const saveSearchHistory = (history: SearchHistory[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('muktiCornerHistory', JSON.stringify(history))
      } catch (error) {
        console.error('Error saving search history:', error)
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return

    // Check if user can search
    if (!canSearch()) {
      setShowLimitModal(true)
      return
    }

    // Record the search
    const searchRecorded = recordSearch(inputMessage, 'mukti-corner')
    if (!searchRecorded) {
      setShowLimitModal(true)
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    // Clear previous messages and set new user message
    setMessages([userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Call enhanced Mukti-Corner API
      const response = await fetch('/api/mukti-corner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: inputMessage,
          category: selectedCategory,
          subcategory: selectedSubcategory
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.detailedAnalysis || data.response,
        isUser: false,
        timestamp: new Date(),
        sources: data.evidenceSources ? data.evidenceSources.map((source: any, index: number) => ({
          id: index + 1,
          book_title: source.title,
          page: 1,
          category: selectedCategory,
          language: 'English',
          content_preview: source.snippet,
          url: source.url
        })) : [],
        category: selectedCategory,
        subcategory: selectedSubcategory,
        verdict: data.verdict,
        summary: data.summary,
        ourSiteArticles: data.ourSiteArticles || []
      }

      // Set new messages with only current conversation
      setMessages([userMessage, botMessage])

      // Create new report and save to history
      const newReport: SearchHistory = {
        id: Date.now().toString(),
        query: inputMessage,
        response: data.detailedAnalysis || data.response,
        timestamp: new Date(),
        category: selectedCategory,
        subcategory: selectedSubcategory,
        sources: data.evidenceSources ? data.evidenceSources.map((source: any, index: number) => ({
          id: index + 1,
          book_title: source.title,
          page: 1,
          category: selectedCategory,
          language: 'English',
          content_preview: source.snippet,
          url: source.url
        })) : [],
        verdict: data.verdict,
        summary: data.summary,
        ourSiteArticles: data.ourSiteArticles || []
      }

      setCurrentReport(newReport)
      
      // Add to search history
      const updatedHistory = [newReport, ...searchHistory].slice(0, 50) // Keep last 50 reports
      setSearchHistory(updatedHistory)
      saveSearchHistory(updatedHistory)

      // Save to Convex database
      await saveToConvex(newReport)
      console.log('[Mukti Corner] Saved report to localStorage and Convex', newReport)
      setSlugId(newReport.id)
      console.log("slug id:", slugId)

    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'দুঃখিত, আপনার প্রশ্নের উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        isUser: false,
        timestamp: new Date(),
        category: selectedCategory,
        subcategory: selectedSubcategory
      }
      setMessages([userMessage, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, isLoading, canSearch, recordSearch, selectedCategory, selectedSubcategory, searchHistory, saveSearchHistory, saveToConvex])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleMicClick = useCallback(async () => {
    if (isRecording) {
      stopVoiceSearch()
    } else {
      await startVoiceSearch()
    }
  }, [isRecording, stopVoiceSearch, startVoiceSearch])

  const copyBotResponse = useCallback(async (messageText: string) => {
    try {
      await navigator.clipboard.writeText(messageText)
      alert('উত্তর কপি করা হয়েছে!')
    } catch (error) {
      console.error('Copy failed:', error)
      alert('কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
  }, [])

  const downloadBotResponse = useCallback((messageText: string) => {
    const textContent = `
মুক্তিযুদ্ধ কর্নার - সার্চ ইঞ্জিনের উত্তর
==========================================

${messageText}

যাচাইকৃত: ${new Date().toLocaleString('bn-BD')}
    `.trim()

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mukti-corner-response-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(null)
    setShowSubcategories(false)
  }, [])

  const handleSubcategoryChange = useCallback((subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    setShowSubcategories(false)
  }, [])

  // Load a report from history
  const loadReportFromHistory = useCallback((report: SearchHistory) => {
    setCurrentReport(report)
    setMessages([
      {
        id: report.id + '-user',
        text: report.query,
        isUser: true,
        timestamp: report.timestamp
      },
      {
        id: report.id + '-bot',
        text: report.response,
        isUser: false,
        timestamp: report.timestamp,
        sources: report.sources,
        category: report.category,
        subcategory: report.subcategory,
        verdict: report.verdict,
        summary: report.summary,
        ourSiteArticles: report.ourSiteArticles
      }
    ])
  }, [])

  // Clear search history
  const clearSearchHistory = useCallback(() => {
    setSearchHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('muktiCornerHistory')
    }
  }, [])

  // Clear current report
  const clearCurrentReport = useCallback(() => {
    setMessages([])
    setCurrentReport(null)
  }, [])

  const getCategoryName = useCallback((categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'একাত্তোর'
  }, [categories])

  const getSubcategoryName = useCallback((categoryId: string, subcategoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId)
    return subcategory ? subcategory.name : ''
  }, [categories])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <img 
                src="/mukti.png" 
                alt="মুক্তিযুদ্ধ কর্নার" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-tiro-bangla">
              মুক্তিযুদ্ধ কর্নার
            </h1>
          </div>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
        {/* Search Engine Style Interface */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="max-w-3xl mx-auto">
            {/* Sidebar Toggle Button - Only visible on mobile */}
            <div className="flex justify-end mb-4 lg:hidden">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors duration-200 font-tiro-bangla text-sm"
                title={isSidebarCollapsed ? "সাইডবার খুলুন" : "সাইডবার বন্ধ করুন"}
              >
                {isSidebarCollapsed ? (
                  <>
                    <PanelLeftOpen className="h-4 w-4" />
                    <span>সার্চ হিস্টরি দেখুন</span>
                  </>
                ) : (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span>সাইডবার বন্ধ করুন</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Instructions */}
            <p className="text-center text-gray-600 mb-6 font-tiro-bangla">
              মুক্তিযুদ্ধ নিয়ে আপনার সমস্ত প্রশ্নের উত্তর পেতে কৃত্রিম বুদ্ধিমত্তা সম্পন্ন এই সার্চ ইঞ্জিন ব্যবহার করুন। আপনি "একাত্তোর", "গণহত্যা" বা "ধর্ষণ" ক্যাটাগরি বেছে নিয়ে নির্দিষ্ট তথ্য খুঁজে পেতে পারেন।
            </p>
            
            {/* Search Bar */}
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="মুক্তিযুদ্ধ সম্পর্কে আপনার প্রশ্ন লিখুন..."
                  className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent font-tiro-bangla text-lg"
                  disabled={isLoading}
                />
                
                {/* Mic Icon */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 transition-all duration-200 ${
                    isRecording 
                      ? 'animate-pulse' 
                      : 'hover:opacity-70'
                  }`}
                  title={isRecording ? "Recording... Click to stop" : "Voice Search"}
                  disabled={!isClient || !isSupported || isLoading}
                >
                  {!isClient ? (
                    // Server-side fallback
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  ) : isSupported ? (
                    <Image
                      src="/mic.png"
                      alt="Voice Search"
                      width={20}
                      height={20}
                      className={`w-5 h-5 transition-all duration-200 ${
                        isRecording 
                          ? 'filter-none' 
                          : 'filter grayscale hover:grayscale-0'
                      }`}
                    />
                  ) : (
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  )}
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-[60px]"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
            
            {/* Voice Search Status Messages */}
            {voiceError && (
              <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-tiro-bangla">
                {voiceError}
              </div>
            )}
            
            {isListening && (
              <div className="mb-4 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded-lg text-sm font-tiro-bangla">
                🎤 শুনছি... কথা বলুন
              </div>
            )}

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {isLoadingCategories ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                  <span className="text-gray-600 font-tiro-bangla">ক্যাটাগরি লোড হচ্ছে...</span>
                </div>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="relative">
                    <button
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 font-tiro-bangla ${
                        selectedCategory === category.id
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                      {category.subcategories && (
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowSubcategories(!showSubcategories)
                          }}
                          className="ml-2 cursor-pointer inline-flex items-center"
                        >
                          {showSubcategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </button>
                    
                    {/* Subcategories Dropdown */}
                    {category.subcategories && showSubcategories && selectedCategory === category.id && (
                      <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[200px]">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            onClick={() => handleSubcategoryChange(subcategory.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-tiro-bangla ${
                              selectedSubcategory === subcategory.id ? 'bg-red-50 text-red-700' : 'text-gray-700'
                            }`}
                          >
                            {subcategory.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 font-tiro-bangla">
                  <p>ক্যাটাগরি লোড করতে সমস্যা হয়েছে</p>
                </div>
              )}
            </div>

            {/* Selected Category Info */}
            {selectedCategory && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 font-tiro-bangla">
                  বর্তমান ক্যাটাগরি: {getCategoryName(selectedCategory)}
                  {selectedSubcategory && (
                    <span> → {getSubcategoryName(selectedCategory, selectedSubcategory)}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col overflow-hidden">
          {/* Report Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {!isClient ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  <span className="text-gray-600 font-tiro-bangla">লোড হচ্ছে...</span>
                </div>
              </div>
            ) : (
              <>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 font-tiro-bangla">
                    <div className="mb-4">
                      <Search className="h-16 w-16 mx-auto text-gray-300" />
                    </div>
                    <p className="text-lg">আপনার প্রশ্নের উত্তর এখানে প্রদর্শিত হবে</p>
                    <p className="text-sm mt-2">উপরের সার্চ বক্সে আপনার প্রশ্ন লিখুন</p>
                    {searchHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400">অথবা সাইডবার থেকে আগের রিপোর্ট লোড করুন</p>
                        <button
                          onClick={() => setIsSidebarCollapsed(false)}
                          className="mt-2 flex items-center space-x-2 mx-auto bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors duration-200 font-tiro-bangla text-sm lg:hidden"
                        >
                          <PanelLeftOpen className="h-4 w-4" />
                          <span>সার্চ হিস্টরি দেখুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="mb-8">
                      {message.isUser ? (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">আপনার প্রশ্ন:</h3>
                          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                            <p className="text-gray-800 font-tiro-bangla">{message.text}</p>
                            <p className="text-xs text-gray-500 mt-2" suppressHydrationWarning>
                              {typeof window !== 'undefined' ? message.timestamp.toLocaleString('bn-BD') : message.timestamp.toISOString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                          {/* Report Header */}
                          <div className="bg-gradient-to-r from-red-50 to-green-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h2 className="text-xl font-bold text-gray-900 font-tiro-bangla">মুক্তিযুদ্ধ কর্নার - প্রতিবেদন</h2>
                                <p className="text-sm text-gray-600 font-tiro-bangla">
                                  ক্যাটাগরি: {getCategoryName(message.category || selectedCategory)}
                                  {message.subcategory && (
                                    <span> → {getSubcategoryName(message.category || selectedCategory, message.subcategory)}</span>
                                  )}
                                </p>
                                {message.verdict && (
                                  <div className="mt-2">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                      message.verdict === 'accurate' ? 'bg-green-100 text-green-800' :
                                      message.verdict === 'misleading' ? 'bg-red-100 text-red-800' :
                                      message.verdict === 'partially_accurate' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {message.verdict === 'accurate' ? 'সঠিক' :
                                       message.verdict === 'misleading' ? 'ভুল' :
                                       message.verdict === 'partially_accurate' ? 'আংশিক সঠিক' :
                                       'যাচাইকৃত নয়'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => copyBotResponse(message.text)}
                                  className="flex items-center space-x-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded border border-gray-300 transition-colors duration-200 font-tiro-bangla text-sm"
                                >
                                  <Copy className="h-4 w-4" />
                                  <span>কপি</span>
                                </button>
                                <button
                                  onClick={() => downloadBotResponse(message.text)}
                                  className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm"
                                >
                                  <Download className="h-4 w-4" />
                                  <span>ডাউনলোড</span>
                                </button>
                                <button
                                  onClick={() => setShowShareModal(true)}
                                  className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm"
                                >
                                  <Share2Icon className="h-4 w-4" />
                                  <span>শেয়ার</span>
                                </button>
                                     <button
                                       onClick={clearCurrentReport}
                                       className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors duration-200 font-tiro-bangla text-sm"
                                     >
                                       <Search className="h-4 w-4" />
                                       <span>নতুন সার্চ</span>
                                     </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Report Content */}
                          <div className="p-6">
                            {message.summary && (
                              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2 font-tiro-bangla">সংক্ষিপ্ত সারাংশ:</h3>
                                <p className="text-blue-800 font-tiro-bangla leading-relaxed">{message.summary}</p>
                              </div>
                            )}
                            
                            <div className="prose prose-lg max-w-none font-tiro-bangla">
                              <div 
                                className="leading-relaxed text-gray-800"
                                dangerouslySetInnerHTML={{ 
                                  __html: sanitizeHtml(parseMarkdown(message.text)) 
                                }}
                              />
                            </div>
                                
                                {/* Article Metadata Widget */}
                                {currentReport && (
                                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-3 font-tiro-bangla flex items-center space-x-2">
                                      <Clock className="h-4 w-4" />
                                      <span>রিপোর্ট মেটাডাটা</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">প্রশ্ন:</p>
                                        <p className="text-blue-900 font-tiro-bangla">{currentReport.query}</p>
                                      </div>
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">ক্যাটাগরি:</p>
                                        <p className="text-blue-900 font-tiro-bangla">
                                          {getCategoryName(currentReport.category || 'general')}
                                          {currentReport.subcategory && (
                                            <span> → {getSubcategoryName(currentReport.category || 'general', currentReport.subcategory)}</span>
                                          )}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">তৈরির তারিখ:</p>
                                        <p className="text-blue-900 font-tiro-bangla" suppressHydrationWarning>
                                          {typeof window !== 'undefined' ? currentReport.timestamp.toLocaleString('bn-BD') : currentReport.timestamp.toISOString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">উৎস সংখ্যা:</p>
                                        <p className="text-blue-900 font-tiro-bangla">{currentReport.sources?.length || 0}টি</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            
                                                         {/* Sources Section */}
                             {message.sources && message.sources.length > 0 && (
                               <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                      <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                                        রেফারেন্স:
                                      </h4>
                                 <div className="space-y-3">
                                        {message.sources.map((source, index) => (
                                    <div key={index} className="bg-white p-3 rounded border border-gray-200">
                                      <div className="flex justify-between items-start mb-2">
                                             <h5 className="font-semibold text-gray-900 font-tiro-bangla">
                                               <a 
                                                 href={source.url} 
                                                 target="_blank" 
                                                 rel="noopener noreferrer"
                                                 className="text-blue-600 hover:text-blue-800 underline"
                                               >
                                                 {source.book_title || source.title}
                                               </a>
                                             </h5>
                                      </div>
                                      <p className="text-sm text-gray-600 font-tiro-bangla leading-relaxed">
                                        {source.content_preview || source.snippet}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Our Site Recommendations */}
                            {message.ourSiteArticles && message.ourSiteArticles.length > 0 && (
                              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="text-lg font-semibold text-green-900 mb-4 font-tiro-bangla flex items-center space-x-2">
                                  <span>📚 আমাদের সাইটের প্রস্তাবিত নিবন্ধসমূহ:</span>
                                </h4>
                                <div className="space-y-3">
                                  {message.ourSiteArticles.map((article, index) => (
                                    <div key={index} className="bg-white p-3 rounded border border-green-200">
                                      <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-semibold text-green-900 font-tiro-bangla">
                                          <a 
                                            href={article.url} 
                                            className="text-green-600 hover:text-green-800 underline"
                                          >
                                            {article.title}
                                          </a>
                                        </h5>
                                        <span className="text-sm text-green-600 font-tiro-bangla">আমাদের সাইট</span>
                                      </div>
                                      <p className="text-sm text-green-800 font-tiro-bangla leading-relaxed">
                                        {article.snippet}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Report Footer */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <p className="text-xs text-gray-500 font-tiro-bangla" suppressHydrationWarning>
                                প্রতিবেদন তৈরি: {typeof window !== 'undefined' ? message.timestamp.toLocaleString('bn-BD') : message.timestamp.toISOString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {isLoading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
                      <p className="text-lg text-gray-600 font-tiro-bangla">প্রতিবেদন তৈরি হচ্ছে...</p>
                      <p className="text-sm text-gray-500 font-tiro-bangla mt-2">অনুগ্রহ করে অপেক্ষা করুন</p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-3 font-tiro-bangla">
            এই সার্চ ইঞ্জিন সম্পর্কে
          </h3>
          <p className="text-red-800 font-tiro-bangla leading-relaxed">
            এই সার্চ ইঞ্জিন বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সম্পর্কে বিস্তারিত তথ্য প্রদান করে। 
            আপনি মুক্তিযুদ্ধের ইতিহাস, গণহত্যা, যুদ্ধাপরাধ, গুরুত্বপূর্ণ ব্যক্তিত্ব, 
            যুদ্ধের সময়কাল, আন্তর্জাতিক প্রতিক্রিয়া এবং অন্যান্য বিষয়ে প্রশ্ন করতে পারেন।
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
              গণহত্যা
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              মুক্তি বাহিনী
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              যুদ্ধাপরাধ
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              শহীদ সংখ্যা
            </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <MuktiSidebar 
              searchHistory={searchHistory}
              onLoadReport={loadReportFromHistory}
              onClearHistory={clearSearchHistory}
            />
          </div>
        </div>
      </div>
      
      {/* Floating Sidebar Toggle for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title={isSidebarCollapsed ? "সার্চ হিস্টরি দেখুন" : "সার্চ হিস্টরি বন্ধ করুন"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!isSidebarCollapsed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsSidebarCollapsed(true)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 lg:hidden ${isSidebarCollapsed ? 'translate-x-full' : 'translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-red-600 font-tiro-bangla">সার্চ হিস্টরি</h3>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <PanelLeftClose className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <MuktiSidebar 
              searchHistory={searchHistory}
              onLoadReport={(report) => {
                loadReportFromHistory(report)
                setIsSidebarCollapsed(true) // Close sidebar after loading report
              }}
              onClearHistory={clearSearchHistory}
            />
          </div>
        </div>
      </div>
      
      <Footer />
      
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        url={`${typeof window !== "undefined" ? window.location.origin : ""}/mukti-corner/${slugId}`}
      />
      
      <SearchLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onLogin={loginWithGoogle}
        remainingSearches={remainingSearches}
      />
    </div>
  )
}
