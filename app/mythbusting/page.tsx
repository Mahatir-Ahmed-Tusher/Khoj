'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'
import MythbustingSidebar from '@/components/MythbustingSidebar'
import { Send, Loader2, Search, Copy, Download, PanelLeftClose, PanelLeftOpen, Share, Share2Icon } from 'lucide-react'
import { parseMarkdown, sanitizeHtml } from '@/lib/markdown'
import { SearchHistory, Source } from '@/lib/types'
import { useSearchLimit } from '@/lib/hooks/useSearchLimit'
import SearchLimitModal from '@/components/SearchLimitModal'
import { useVoiceSearch } from '@/lib/hooks/useVoiceSearch'
import Image from 'next/image'
// Convex client for on-demand queries/mutations
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import ShareModal from '@/components/ShareModal'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  sources?: Source[]
  verdict?: string
  summary?: string
  conclusion?: string
  keyTakeaways?: string[]
  ourSiteArticles?: Array<{
    title: string
    url: string
    snippet: string
  }>
}

function MythbustingContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [currentReport, setCurrentReport] = useState<SearchHistory | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [isFromUrl, setIsFromUrl] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const convex = useConvex()

  // Control show modal
    const [showShareModal, setShowShareModal] = useState(false);
    const [slugId, setSlugId] = useState("");

    // set the url
    const [url, setUrl] = useState("");


  // Save to Convex database
  const saveToConvex = async (report: SearchHistory) => {
    console.log('[Convex] saveToConvex called with id:', report.id)
    // setSlugId(report.id)
    try {
      // Prepare payload in server schema shape
      const payload = {
        id: report.id,
        query: report.query,
        result: report.response,
        timestamp: report.timestamp.getTime(),
        verdict: (report.verdict as 'true' | 'false' | 'misleading' | 'unverified' | 'partially_true' | 'context_dependent') || 'unverified',
        sources: (report.sources || []).map((source: Source) => ({
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
      console.log('[Convex] Saved successfully')
    } catch (error) {
      console.error('[Convex] Error saving:', error)
    }
  }

  // Check if data exists in localStorage or Convex
  const checkExistingData = async (query: string): Promise<SearchHistory | null> => {
    console.log('[Check] Checking existing data for query:', query)
    // 1) Local cache first
    const localHistory = searchHistory.find((item) => item.query.toLowerCase() === query.toLowerCase())
    if (localHistory) {
      console.log('[Check] Found in localStorage by query')
      return localHistory
    }
    // 2) Convex database
    try {
      const convexResult = await convex.query(api.factChecks.getByQuery, { query })
      if (convexResult) {
        console.log('[Check] Found in Convex by query')
        const mapped: SearchHistory = {
          id: convexResult.id,
          query: convexResult.query,
          response: convexResult.result,
          timestamp: new Date(convexResult.timestamp),
          sources: (convexResult.sources || []).map((source: any) => ({
            id: source.id,
            title: source.title || '',
            book_title: source.title,
            page: 1,
            category: 'mythbusting',
            language: source.language || 'English',
            snippet: source.snippet || '',
            content_preview: source.snippet,
            url: source.url,
          } as Source)),
          verdict: convexResult.verdict,
          // Optional fields may not exist on DB record; keep undefined if missing
          summary: (convexResult as any).summary,
          conclusion: (convexResult as any).conclusion,
          keyTakeaways: (convexResult as any).keyTakeaways,
          ourSiteArticles: (convexResult as any).ourSiteArticles,
        }
        return mapped
      }
    } catch (error) {
      console.error('[Convex] Error querying by query:', error)
    }
    console.log('[Check] No existing data found')
    return null
  }
  
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

  const saveSearchHistory = (history: SearchHistory[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mythbustingHistory', JSON.stringify(history))
      } catch (error) {
        console.error('Error saving search history:', error)
      }
    }
  }

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return

    console.log('handleSendMessage called, isFromUrl:', isFromUrl)

    // First try: check localStorage + Convex by query
    try {
      const existingData = await checkExistingData(inputMessage)
      if (existingData) {
        console.log('[Flow] Using existing data (cache/db). Skipping generation.')
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          text: inputMessage,
          isUser: true,
          timestamp: new Date(),
        }
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: existingData.response,
          isUser: false,
          timestamp: existingData.timestamp,
          sources: existingData.sources,
          verdict: existingData.verdict,
          summary: existingData.summary,
          conclusion: existingData.conclusion,
          keyTakeaways: existingData.keyTakeaways,
          ourSiteArticles: existingData.ourSiteArticles,
        }
        setMessages([userMessage, botMessage])
        setCurrentReport(existingData)
        return
      }
    } catch (e) {
      console.warn('[Flow] Existing data check failed, proceeding to generate.', e)
    }

    if (!isFromUrl) {
      console.log('Manual search - checking permissions')
      if (!canSearch()) {
        console.log('Permission denied for manual search')
        setShowLimitModal(true)
        return
      }

      const searchRecorded = recordSearch(inputMessage, 'mythbusting')
      if (!searchRecorded) {
        console.log('Search recording failed')
        setShowLimitModal(true)
        return
      }
    } else {
      console.log('URL search - bypassing permissions')
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages([userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/mythbusting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: inputMessage
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
          title: source.title || '',
          book_title: source.title,
          page: 1,
          category: 'mythbusting',
          language: 'English',
          snippet: source.snippet || '',
          content_preview: source.snippet,
          url: source.url
        })) : [],
        verdict: data.verdict,
        summary: data.summary,
        conclusion: data.conclusion,
        keyTakeaways: data.keyTakeaways,
        ourSiteArticles: data.ourSiteArticles || []
      }

      setMessages([userMessage, botMessage])

      const newReport: SearchHistory = {
        id: Date.now().toString(),
        query: inputMessage,
        response: data.detailedAnalysis || data.response,
        timestamp: new Date(),
        sources: data.evidenceSources ? data.evidenceSources.map((source: any, index: number) => ({
          id: index + 1,
          title: source.title || '',
          book_title: source.title,
          page: 1,
          category: 'mythbusting',
          language: 'English',
          snippet: source.snippet || '',
          content_preview: source.snippet,
          url: source.url
        })) : [],
        verdict: data.verdict,
        summary: data.summary,
        conclusion: data.conclusion,
        keyTakeaways: data.keyTakeaways,
        ourSiteArticles: data.ourSiteArticles || []
      }

      setCurrentReport(newReport)
      
      const updatedHistory = [newReport, ...searchHistory].slice(0, 50)
      setSearchHistory(updatedHistory)
      saveSearchHistory(updatedHistory)

      // Save to Convex as well
      await saveToConvex(newReport)
      console.log('[Flow] Saved report to localStorage and Convex', newReport)
      setSlugId(newReport.id)
      console.log("slug id:" , slugId)


    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'দুঃখিত, আপনার প্রশ্নের উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        isUser: false,
        timestamp: new Date()
      }
      setMessages([userMessage, errorMessage])
    } finally {
      setIsLoading(false)
      if (isFromUrl) {
        setIsFromUrl(false)
      }
    }
  }, [inputMessage, isLoading, canSearch, recordSearch, searchHistory, saveSearchHistory, isFromUrl])

  useEffect(() => {
    setIsClient(true)
    setMessages([])
    loadSearchHistory()
    
    const query = searchParams.get('query')
    console.log('URL query found:', query)
    if (query) {
      setInputMessage(query)
      setIsFromUrl(true)
      console.log('Set isFromUrl to true')
    }
  }, [searchParams])

  useEffect(() => {
    console.log('isFromUrl changed:', isFromUrl, 'inputMessage:', inputMessage)
    if (isFromUrl && inputMessage.trim()) {
      setTimeout(() => {
        handleSendMessage()
      }, 100)
    }
  }, [isFromUrl, inputMessage, handleSendMessage])

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

  // get window url
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  // Load search history from localStorage
  const loadSearchHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mythbustingHistory')
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleMicClick = async () => {
    if (isRecording) {
      stopVoiceSearch()
    } else {
      await startVoiceSearch()
    }
  }

  const copyBotResponse = async (messageText: string) => {
    try {
      await navigator.clipboard.writeText(messageText)
      alert('উত্তর কপি করা হয়েছে!')
    } catch (error) {
      console.error('Copy failed:', error)
      alert('কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
  }

  const downloadBotResponse = (messageText: string) => {
    const textContent = `
মিথবাস্টিং - সার্চ ইঞ্জিনের উত্তর
====================================

${messageText}

যাচাইকৃত: ${new Date().toLocaleString('bn-BD')}
    `.trim()

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mythbusting-response-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Load a report from history
  const loadReportFromHistory = async (report: SearchHistory) => {
    console.log('[Flow] Loading report from history. Attempting Convex getByID for latest:', report.id)
    try {
      // Try to fetch the freshest version from Convex by id
      const latest = await convex.query(api.factChecks.getByID, { id: report.id })
      if (latest) {
        console.log('[Convex] Found latest by id. Using DB version for render.')
        const updated: SearchHistory = {
          id: latest.id,
          query: latest.query,
          response: latest.result,
          timestamp: new Date(latest.timestamp),
          sources: (latest.sources || []).map((source: any) => ({
            id: source.id,
            title: source.title || '',
            book_title: source.title,
            page: 1,
            category: 'mythbusting',
            language: source.language || 'English',
            snippet: source.snippet || '',
            content_preview: source.snippet,
            url: source.url,
          } as Source)),
          verdict: latest.verdict,
          summary: (latest as any).summary,
          conclusion: (latest as any).conclusion,
          keyTakeaways: (latest as any).keyTakeaways,
          ourSiteArticles: (latest as any).ourSiteArticles,
        }
        setCurrentReport(updated)
        setMessages([
          { id: updated.id + '-user', text: updated.query, isUser: true, timestamp: updated.timestamp },
          { id: updated.id + '-bot', text: updated.response, isUser: false, timestamp: updated.timestamp, sources: updated.sources, verdict: updated.verdict, summary: updated.summary, ourSiteArticles: updated.ourSiteArticles }
        ])
        return
      }
      console.log('[Convex] No DB version found; falling back to local copy.')
    } catch (error) {
      console.warn('[Convex] getByID failed; using local copy.', error)
    }
    // Fallback to provided local report
    setCurrentReport(report)
    setMessages([
      { id: report.id + '-user', text: report.query, isUser: true, timestamp: report.timestamp },
      { id: report.id + '-bot', text: report.response, isUser: false, timestamp: report.timestamp, sources: report.sources, verdict: report.verdict, summary: report.summary, ourSiteArticles: report.ourSiteArticles }
    ])
  }

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mythbustingHistory')
    }
  }

  // Clear current report
  const clearCurrentReport = () => {
    setMessages([])
    setCurrentReport(null)
  }

  const getVerdictText = (verdict?: string) => {
    switch (verdict) {
      case 'true':
        return 'সত্য'
      case 'false':
        return 'মিথ্যা'
      case 'misleading':
        return 'ভ্রান্তিমূলক'
      case 'partially_true':
        return 'আংশিক সত্য'
      case 'context_dependent':
        return 'প্রসঙ্গনির্ভর'
      default:
        return 'অযাচাইকৃত'
    }
  }

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-green-100 text-green-800'
      case 'false':
        return 'bg-red-100 text-red-800'
      case 'misleading':
        return 'bg-yellow-100 text-yellow-800'
      case 'partially_true':
        return 'bg-blue-100 text-blue-800'
      case 'context_dependent':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/mythbusting.png" 
              alt="মিথবাস্টিং" 
              className="h-8 w-8 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900 font-tiro-bangla">
              মিথবাস্টিং
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

                {/* Instructions */}
                <p className="text-center text-gray-600 mb-6 font-tiro-bangla">
                  যেকোনো বৈজ্ঞানিক দাবি, ভূতুড়ে ঘটনা, কুসংস্কার বা সিউডোসায়েন্স সম্পর্কে প্রশ্ন করুন। কৃত্রিম বুদ্ধিমত্তা সম্পন্ন এই সার্চ ইঞ্জিন ব্যবহার করে সঠিক তথ্য খুঁজে পেতে পারেন।
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
                      placeholder="যেমন: ভূত আছে কি নাই? অ্যাস্ট্রোলজি কি সত্য?"
                      className="w-full pl-10 pr-20 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent font-tiro-bangla text-lg"
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
                    className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center min-w-[60px]"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Example Queries */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-3 font-tiro-bangla">উদাহরণ:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'ভূত আছে কি নাই?',
                      'অ্যাস্ট্রোলজি কি সত্য?',
                      'হোমিওপ্যাথি কি কাজ করে?',
                      'ফ্ল্যাট আর্থ থিওরি',
                      '৫জি নেটওয়ার্ক ক্ষতিকর?'
                    ].map((example) => (
                      <button
                        key={example}
                        onClick={() => setInputMessage(example)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors font-tiro-bangla"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Container */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-h-[600px] flex flex-col overflow-hidden">
              {/* Report Area */}
              <div className="flex-1 overflow-y-auto p-8">
                {!isClient ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-600" />
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
                              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500">
                                <p className="text-gray-800 font-tiro-bangla">{message.text}</p>
                                <p className="text-xs text-gray-500 mt-2" suppressHydrationWarning>
                                  {typeof window !== 'undefined' ? message.timestamp.toLocaleString('bn-BD') : message.timestamp.toISOString()}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                              {/* Report Header */}
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h2 className="text-xl font-bold text-gray-900 font-tiro-bangla">মিথবাস্টিং - প্রতিবেদন</h2>
                                    {message.verdict && (
                                      <div className="mt-2">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(message.verdict)}`}>
                                          {getVerdictText(message.verdict)}
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
                      id="share-button"
                      onClick={() => setShowShareModal(true)}
                      className="flex items-center space-x-2 bg-gray-100 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Share2Icon />
                      <span className="font-medium">শেয়ার করুন</span>
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

                                {/* Conclusion Section */}
                                {message.conclusion && (
                                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h3 className="text-lg font-semibold text-red-900 mb-3 font-tiro-bangla">তাহলে যেটা দাঁড়ায়:</h3>
                                    <div className="prose prose-lg max-w-none font-tiro-bangla">
                                      <div 
                                        className="leading-relaxed text-red-800"
                                        dangerouslySetInnerHTML={{ 
                                          __html: sanitizeHtml(parseMarkdown(message.conclusion)) 
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Key Takeaways */}
                                {message.keyTakeaways && message.keyTakeaways.length > 0 && (
                                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <h3 className="text-lg font-semibold text-yellow-900 mb-3 font-tiro-bangla">মূল বার্তা:</h3>
                                    <ul className="space-y-2">
                                      {message.keyTakeaways.map((takeaway, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                          <span className="text-yellow-600 font-bold mt-1">💡</span>
                                          <p className="text-yellow-800 font-tiro-bangla leading-relaxed">{takeaway}</p>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                    
                                {/* Article Metadata Widget */}
                                {currentReport && (
                                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="text-sm font-semibold text-blue-900 mb-3 font-tiro-bangla flex items-center space-x-2">
                                      <span>📊</span>
                                      <span>রিপোর্ট মেটাডাটা</span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">প্রশ্ন:</p>
                                        <p className="text-blue-900 font-tiro-bangla">{currentReport.query}</p>
                                      </div>
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">ফলাফল:</p>
                                        <p className="text-blue-900 font-tiro-bangla">
                                          {currentReport.verdict ? getVerdictText(currentReport.verdict) : 'অযাচাইকৃত'}
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
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">মূল বার্তা:</p>
                                        <p className="text-blue-900 font-tiro-bangla">{currentReport.keyTakeaways?.length || 0}টি</p>
                                      </div>
                                      <div>
                                        <p className="text-blue-700 font-medium font-tiro-bangla">চূড়ান্ত সিদ্ধান্ত:</p>
                                        <p className="text-blue-900 font-tiro-bangla">
                                          {currentReport.conclusion ? 'হ্যাঁ' : 'না'}
                                        </p>
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
                          <Loader2 className="h-8 w-8 animate-spin text-gray-600 mx-auto mb-4" />
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
            <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 font-tiro-bangla">
                এই টুল সম্পর্কে
              </h3>
              <p className="text-gray-800 font-tiro-bangla leading-relaxed">
                এই মিথবাস্টিং টুল বৈজ্ঞানিক দাবি, কুসংস্কার, ভূতুড়ে ঘটনা এবং সিউডোসায়েন্স সম্পর্কে 
                সঠিক তথ্য প্রদান করে। আমরা বৈজ্ঞানিক গবেষণা এবং প্রমাণের ভিত্তিতে আপনার প্রশ্নের উত্তর দিই।
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
                  বৈজ্ঞানিক দাবি
                </span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  কুসংস্কার
                </span>
                <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium border border-gray-300">
                  সিউডোসায়েন্স
                </span>
                <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                  ভূতুড়ে ঘটনা
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <MythbustingSidebar 
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
          className="bg-gray-700 hover:bg-gray-800 text-white p-3 rounded-full shadow-lg transition-all duration-200"
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
              <h3 className="text-lg font-bold text-gray-600 font-tiro-bangla">সার্চ হিস্টরি</h3>
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
            <MythbustingSidebar 
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
          url={`${url}/${slugId}`}
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

export default function MythbustingPage() {
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
      <MythbustingContent />
    </Suspense>
  )
}