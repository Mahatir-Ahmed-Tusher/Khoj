'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Search, MessageCircle, Loader2, ExternalLink, Bot, User, Trash2, Send, Copy, Check, Lightbulb, Globe, Code, PanelLeftClose, PanelLeftOpen, Clock, X, Plus, Download } from 'lucide-react'
import Image from 'next/image'
import { parseMarkdown, sanitizeHtml } from '@/lib/markdown'
import { useVoiceSearch } from '@/lib/hooks/useVoiceSearch'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: Array<{
    title: string
    url: string
    snippet: string
  }>
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

export default function KhojChatPage() {
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [selectedMode, setSelectedMode] = useState<'khoj-chat' | 'citizen-service' | 'fact-check'>('khoj-chat')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Mode configuration
  const modeConfig = {
    'khoj-chat': {
      label: 'খোঁজ চ্যাট',
      placeholder: 'এখানে আপনার প্রশ্ন লিখুন'
    },
    'citizen-service': {
      label: 'নাগরিক সেবা',
      placeholder: 'সরকারী কোনো সেবা নিয়ে জানতে চান?'
    },
    'fact-check': {
      label: 'যাচাই',
      placeholder: 'কী নিয়ে যাচাই করতে চান?'
    }
  }

  const getPlaceholder = () => {
    return modeConfig[selectedMode].placeholder
  }

  // Citizen Service Data - Government service links 
  const citizenServiceData = {
    "স্মার্ট কার্ড ও জাতীয় পরিচয়পত্র": [
      "https://nidw.gov.bd/",
      "https://services.nidw.gov.bd/nid-pub"
    ],
    "জন্ম নিবন্ধন": [
      "https://orgbdr.gov.bd/",
      "https://bdris.gov.bd/br/application"
    ],
    "মৃত্যু নিবন্ধন ও সনদ": [
      "https://orgbdr.gov.bd/",
      "https://everify.bdris.gov.bd/UDRNVerification"
    ],
    "পাসপোর্ট": [
      "https://www.epassport.gov.bd/",
      "http://www.passport.gov.bd/"
    ],
    "জরুরি প্রত্যয়ন ও সনদ": [
      "https://bdrcs.org/",
      "https://www.alfredemergency.org/course/emc-bangladesh"
    ],
    "মুক্তিযোদ্ধা বিষয়ক প্রত্যয়ন ও সংশোধন": [
      "https://prottoyon.gov.bd/",
      "https://molwa.gov.bd/",
      "http://www.bffwt.gov.bd/"
    ],
    "ইউটিলিটি বিল (বিদ্যুৎ, গ্যাস ও পানি)": [
      "https://ekpay.gov.bd/",
      "https://nagad.com.bd/services/?service=bill-pay",
      "https://www.bkash.com/en/products-services/pay-bill/electricity-paybill"
    ],
    "ট্রেড লাইসেন্স বিষয়ক সেবা": [
      "https://www.etradelicense.gov.bd/",
      "https://www.bangladeshtradeportal.gov.bd/"
    ],
    "ব্যবসায় সংক্রান্ত সেবা": [
      "https://www.etradelicense.gov.bd/",
      "https://www.bangladeshtradeportal.gov.bd/"
    ],
    "ভোক্তা সুরক্ষা ও অভিযোগ": [
      "https://dncrp.portal.gov.bd/",
      "https://dncrp.com/"
    ],
    "মোটরযানের নিবন্ধন ও লাইসেন্স": [
      "https://brta.gov.bd/",
      "https://bsp.brta.gov.bd/"
    ],
    "কর ও রাজস্ব বিষয়ক সেবা": [
      "https://nbr.gov.bd/",
      "https://etaxnbr.gov.bd/"
    ],
    "দুর্যোগ ব্যবস্থাপনা সম্পর্কিত সেবা": [
      "https://ddm.gov.bd/",
      "https://modmr.gov.bd/",
      "https://caritasbd.org/",
      "https://uttaranbd.org/",
      "https://friendship.ngo/"
    ],
    "স্বাস্থ্য সম্পর্কিত সেবা": [
      "https://dghs.gov.bd/",
      "http://hospitaldghs.gov.bd/",
      "https://www.malteser-international.org/en/our-work/asia/bangladesh/",
      "https://worldrenew.net/bangladesh"
    ],
    "শিক্ষা সম্পর্কিত সেবা": [
      "https://moedu.portal.gov.bd/",
      "https://shed.gov.bd/",
      "http://www.educationboard.gov.bd/",
      "https://worldrenew.net/bangladesh"
    ],
    "স্থল, রেল, মেট্রো ও বিমান পরিবহন সেবা": [
      "https://brta.gov.bd/",
      "https://railway.gov.bd/",
      "https://dmtcl.gov.bd/",
      "https://caab.gov.bd/"
    ],
    "আর্থিক সেবা ও নাগরিক বিনিয়োগ": [
      "https://mof.gov.bd/",
      "https://www.bb.org.bd/en/index.php/Investfacility/index"
    ],
    "হজ সেবা": [
      "https://www.hajj.gov.bd/",
      "https://haj-jeddah.portal.gov.bd/"
    ],
    "প্রবাসী ও আইনগত সহায়তা সেবা": [
      "https://bmet.gov.bd/",
      "https://probashi.gov.bd/"
    ],
    "ডিজিটাল নিরাপত্তা ও সাইবার অভিযোগ": [
      "https://www.cid.gov.bd/",
      "https://www.cirt.gov.bd/"
    ],
    "ভূমি সেবা": [
      "http://www.minland.gov.bd/",
      "https://land.gov.bd/",
      "https://dlrs.gov.bd/"
    ],
    "পরিবেশ ও কৃষি": [
      "https://moa.gov.bd/",
      "https://moef.gov.bd/"
    ],
    "সামাজিক সুরক্ষা বা ভাতা প্রদান সংক্রান্ত সেবা": [
      "https://dss.gov.bd/"
    ],
    "সরকারি বিনিয়োগ ও উদ্যোক্তা সহায়তা সেবা": [
      "https://bida.gov.bd/",
      "https://bidaquickserv.org/"
    ],
    "সরকারি কর্মচারীদের পেনশন, আর্থিক সহায়তা ও কল্যাণমূলক সেবা": [
      "https://www.upension.gov.bd/",
      "https://www.pension.gov.bd/"
    ],
    "পারিবারিক আইন সেবা": [
      "https://minlaw.gov.bd/",
      "https://www.lacsb.com/trade-license-renewal-bangladesh",
      "https://bdlplaw.com/practice_areas_BDLP_law_firm_in_dhaka_bangladesh/divorce_law_firm_dhaka"
    ],
    "ক্ষুদ্র ও মাঝারি শিল্প উদ্যোক্তাদের ক্ষমতায়ন ও প্রণোদনা সেবা": [
      "https://bscic.gov.bd/",
      "https://www.bb.org.bd/sme/"
    ]
  }


  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Randomize suggestions on page load - only on client side
  useEffect(() => {
    setSuggestions(getRandomSuggestions())
    setIsSuggestionsLoaded(true)
  }, [])

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Listen for voice search results
  useEffect(() => {
    const handleVoiceResult = (event: CustomEvent) => {
      const transcript = event.detail.transcript
      setInput(transcript)
    }

    window.addEventListener('voiceSearchResult', handleVoiceResult as EventListener)
    return () => {
      window.removeEventListener('voiceSearchResult', handleVoiceResult as EventListener)
    }
  }, [])

  // Load chat history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('khojChatHistory')
        if (saved) {
          const history = JSON.parse(saved).map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp),
            messages: item.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }))
          setChatHistory(history)
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
      }
    }
  }, [])

  // Save chat history to localStorage
  const saveChatHistory = (history: ChatHistory[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('khojChatHistory', JSON.stringify(history))
      } catch (error) {
        console.error('Error saving chat history:', error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    const messageContent = input.trim()
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsGenerating(true)
    setIsLoading(true)

    // Add a small delay to show the loading animation
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      // Determine the type based on selected mode
      let requestType = 'general'
      if (selectedMode === 'fact-check') {
        requestType = 'fact-check'
      } else if (selectedMode === 'citizen-service') {
        requestType = 'citizen-service'
      } else {
        // For khoj-chat mode, check if the message contains fact-checking keywords
        const factCheckKeywords = ['যাচাই', 'সত্য', 'মিথ্যা', 'খবর', 'নিউজ', 'সার্চ', 'সংবাদ', 'খবর যাচাই', 'খবর', 'খোঁজ', 'ডিবাংক', 'ফ্যাক্ট চেক', 'ফ্যাক্টচেক', 'ফ্যাক্টচেকিং', 'debunk', 'rumor', 'fact', 'check', 'verify']
        const isFactCheck = factCheckKeywords.some(keyword => 
          messageContent.toLowerCase().includes(keyword.toLowerCase())
        )
        requestType = isFactCheck ? 'fact-check' : 'general'
      }

      // Don't add empty message immediately - wait for first content
      
      // Prepare request body based on type
      let requestBody: any = { 
        query: messageContent,
        type: requestType
      }

      // Add citizen service data if mode is citizen-service
      if (selectedMode === 'citizen-service') {
        requestBody.citizenServiceData = citizenServiceData
        requestBody.mode = 'citizen-service'
      }

      // Start streaming response
      const response = await fetch('/api/khoj-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) throw new Error('Chat failed')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let sources: Array<{title: string, url: string, snippet: string}> = []
      let assistantMessage: Message | null = null

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'content') {
                  fullContent += data.data
                  
                  // Create message only when we have first content
                  if (!assistantMessage) {
                    assistantMessage = {
                      id: (Date.now() + 1).toString(),
                      type: 'assistant',
                      content: fullContent,
                      timestamp: new Date(),
                      sources: []
                    }
                    setMessages(prev => [...prev, assistantMessage!])
                    // Hide loading animation when first content arrives
                    setIsGenerating(false)
                    setIsLoading(false)
                  } else {
                    // Update the message content in real-time
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessage!.id 
                        ? { ...msg, content: fullContent }
                        : msg
                    ))
                  }
                } else if (data.type === 'sources') {
                  sources = data.data
                  if (assistantMessage) {
                    setMessages(prev => prev.map(msg => 
                      msg.id === assistantMessage!.id 
                        ? { ...msg, sources: sources }
                        : msg
                    ))
                  }
                } else if (data.type === 'done') {
                  // Response completed
                  console.log('Response completed')
                }
              } catch (e) {
                console.error('Error parsing stream data:', e)
              }
            }
          }
        }
      }
      
      // Save to chat history with final content - continue current conversation
      if (assistantMessage) {
        const finalAssistantMessage: Message = {
          ...assistantMessage,
          content: fullContent,
          sources: sources
        }
        
        if (currentConversationId) {
          // Continue existing conversation
          const updatedHistory = chatHistory.map(conv => {
            if (conv.id === currentConversationId) {
              return {
                ...conv,
                messages: [...conv.messages, userMessage, finalAssistantMessage],
                timestamp: new Date()
              }
            }
            return conv
          })
          setChatHistory(updatedHistory)
          saveChatHistory(updatedHistory)
        } else {
          // Create new conversation
          const conversationTitle = userMessage.content.length > 50 
            ? userMessage.content.substring(0, 50) + '...' 
            : userMessage.content
          
          const newConversationId = Date.now().toString()
          const newChatHistory: ChatHistory = {
            id: newConversationId,
            title: conversationTitle,
            messages: [userMessage, finalAssistantMessage],
            timestamp: new Date()
          }
          
          const updatedHistory = [newChatHistory, ...chatHistory].slice(0, 20)
          setChatHistory(updatedHistory)
          saveChatHistory(updatedHistory)
          setCurrentConversationId(newConversationId)
        }
      }
      
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `দুঃখিত, একটি সমস্যা হয়েছে: ${error instanceof Error ? error.message : 'অজানা ত্রুটি'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsGenerating(false)
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentConversationId(null)
  }

  const loadConversation = (history: ChatHistory) => {
    setMessages(history.messages)
    setCurrentConversationId(history.id)
    setIsSidebarCollapsed(true) // Close sidebar after loading
  }

  const clearChatHistory = () => {
    setChatHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('khojChatHistory')
    }
  }

  const copyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(messageId)
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  const downloadMessage = (content: string, messageId: string) => {
    // Clean the content for better text file
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()

    // Create filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `khoj-chat-${timestamp}.txt`

    // Create and download the file
    const blob = new Blob([cleanContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const allSuggestions = [
    {
      text: "বাংলাদেশের সাম্প্রতিক রাজনৈতিক খবর যাচাই করুন",
      icon: Globe,
      type: "fact-check",
      category: "যাচাই",
      color: "from-purple-500 to-pink-500"
    },
    {
      text: "কৃত্রিম বুদ্ধিমত্তা সম্পর্কে জানুন",
      icon: Lightbulb,
      type: "general",
      category: "শিক্ষা",
      color: "from-blue-500 to-cyan-500"
    },
    {
      text: "জলবায়ু পরিবর্তনের প্রভাব যাচাই করুন",
      icon: Globe,
      type: "fact-check",
      category: "যাচাই",
      color: "from-green-500 to-emerald-500"
    },
    {
      text: "প্রোগ্রামিং শেখার উপায়",
      icon: Code,
      type: "general",
      category: "শিক্ষা",
      color: "from-orange-500 to-red-500"
    },
    {
      text: "নাগরিক সেবা সম্পর্কে জানুন",
      icon: User,
      type: "citizen-service",
      category: "সেবা",
      color: "from-indigo-500 to-purple-500"
    },
    {
      text: "স্বাস্থ্য সম্পর্কিত তথ্য যাচাই করুন",
      icon: MessageCircle,
      type: "fact-check",
      category: "যাচাই",
      color: "from-teal-500 to-blue-500"
    },
    {
      text: "অর্থনীতি সম্পর্কিত খবর যাচাই করুন",
      icon: Search,
      type: "fact-check",
      category: "যাচাই",
      color: "from-yellow-500 to-orange-500"
    },
    {
      text: "শিক্ষা নীতি সম্পর্কে জানুন",
      icon: Lightbulb,
      type: "general",
      category: "শিক্ষা",
      color: "from-pink-500 to-rose-500"
    },
    {
      text: "ভিসা ও পাসপোর্ট সেবা",
      icon: User,
      type: "citizen-service",
      category: "সেবা",
      color: "from-cyan-500 to-blue-500"
    },
    {
      text: "খেলাধুলা সম্পর্কিত খবর যাচাই করুন",
      icon: Globe,
      type: "fact-check",
      category: "যাচাই",
      color: "from-emerald-500 to-teal-500"
    }
  ]

  // Function to get random suggestions
  const getRandomSuggestions = () => {
    const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3)
  }

  // State for random suggestions - start with empty array to prevent hydration mismatch
  const [suggestions, setSuggestions] = useState<typeof allSuggestions>([])
  const [isSuggestionsLoaded, setIsSuggestionsLoaded] = useState(false)

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleMicClick = async () => {
    if (isRecording) {
      stopVoiceSearch()
    } else {
      await startVoiceSearch()
    }
  }

  // Function to format text with hyperlinks and markdown formatting
  const formatMessageContent = (content: string) => {
    // Use the same markdown parsing system as mythbusting
    const htmlContent = sanitizeHtml(parseMarkdown(content))
    
    // Render the complete HTML content
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`fixed top-20 left-4 z-50 p-2 rounded-lg transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
            : 'bg-white hover:bg-gray-100 text-gray-800'
        } shadow-lg border`}
        title={isSidebarCollapsed ? "চ্যাট হিস্টরি দেখুন" : "চ্যাট হিস্টরি বন্ধ করুন"}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="w-5 h-5" />
        ) : (
          <PanelLeftClose className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
        isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      } ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-bold font-tiro-bangla ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                চ্যাট হিস্টরি
              </h3>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className={`p-1 rounded hover:bg-gray-100 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* New Chat Button */}
          <div className="flex-shrink-0 p-4 border-b border-gray-200">
            <button
              onClick={clearChat}
              className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } font-tiro-bangla shadow-sm hover:shadow-md`}
            >
              <Plus className="w-4 h-4" />
              নতুন চ্যাট
            </button>
          </div>
          
          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto p-4">
            {chatHistory.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-tiro-bangla">কোনো চ্যাট হিস্টরি নেই</p>
              </div>
            ) : (
              <div className="space-y-2">
                {chatHistory.map((history) => (
                  <button
                    key={history.id}
                    onClick={() => loadConversation(history)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-100 text-gray-800'
                    } border border-transparent hover:border-gray-200`}
                  >
                    <div className="font-medium text-sm font-tiro-bangla mb-1 truncate">
                      {history.title}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {history.timestamp.toLocaleDateString('bn-BD')} - {history.timestamp.toLocaleTimeString('bn-BD', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {history.messages.length} বার্তা
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar Footer */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <button
              onClick={clearChatHistory}
              className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-100 hover:bg-red-200 text-red-800'
              } font-tiro-bangla`}
            >
              সব হিস্টরি মুছুন
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" 
          onClick={() => setIsSidebarCollapsed(true)} 
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-0' : 'ml-80 lg:ml-80'}`}>
        {/* Header */}
        <header className={`transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} ${messages.length > 0 ? 'hidden' : 'block'}`}>
        <div className="max-w-3xl mx-auto px-3 pt-4 pb-3">
          <div className="text-center">
            <div className="mb-1">
              <Image 
                src="/khoj-chat-black.png" 
                alt="খোঁজ চ্যাট" 
                width={60} 
                height={20}
                className="mx-auto"
              />
            </div>
            <p className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} font-tiro-bangla`}>
              আজকে আপনাকে কিভাবে সাহায্য করতে পারি?
            </p>
          </div>

          {/* Enhanced Suggestions - Single Line Layout */}
          <div className="mt-6">
            <div className="text-center mb-4">
              <h3 className={`text-sm font-medium font-tiro-bangla ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                জনপ্রিয় প্রশ্নসমূহ
              </h3>
            </div>
            
            {/* Single Line Layout: 2 side-by-side, 1 below */}
            <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto">
              {!isSuggestionsLoaded ? (
                // Loading skeleton
                <>
                  <div className="flex gap-3 w-full">
                    {[1, 2].map((index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-xl p-3 animate-pulse ${
                          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-16 h-5 rounded-full ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                          }`}></div>
                          <div className={`w-6 h-6 rounded-full ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                          }`}></div>
                        </div>
                        <div className={`w-full h-4 rounded ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full max-w-md">
                    <div
                      className={`rounded-xl p-3 animate-pulse ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-16 h-5 rounded-full ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                        <div className={`w-6 h-6 rounded-full ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </div>
                      <div className={`w-full h-4 rounded ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* First Row - 2 suggestions side by side */}
                  <div className="flex gap-3 w-full">
                    {suggestions.slice(0, 2).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className={`group relative overflow-hidden rounded-xl p-3 flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Category Badge and Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium font-tiro-bangla ${
                          suggestion.type === 'fact-check'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : suggestion.type === 'citizen-service'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {suggestion.category}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'
                        } transition-colors duration-300`}>
                          {React.createElement(suggestion.icon, {
                            className: `w-3 h-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                          })}
                        </div>
                      </div>
                      
                      {/* Suggestion Text */}
                      <h4 className={`text-xs font-medium text-left leading-relaxed ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      } font-tiro-bangla group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}>
                        {suggestion.text}
                      </h4>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine transition-opacity duration-500"></div>
                  </button>
                ))}
              </div>
              
              {/* Second Row - 1 suggestion centered */}
              {suggestions[2] && (
                <div className="w-full max-w-md">
                  <button
                    onClick={() => handleSuggestionClick(suggestions[2].text)}
                    className={`group relative overflow-hidden rounded-xl p-3 w-full transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 shadow-sm'
                    }`}
                    style={{
                      animationDelay: '200ms'
                    }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${suggestions[2].color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Category Badge and Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium font-tiro-bangla ${
                          suggestions[2].type === 'fact-check'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                            : suggestions[2].type === 'citizen-service'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {suggestions[2].category}
                        </span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-700 group-hover:bg-gray-600' : 'bg-gray-100 group-hover:bg-gray-200'
                        } transition-colors duration-300`}>
                          {React.createElement(suggestions[2].icon, {
                            className: `w-3 h-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                          })}
                        </div>
                      </div>
                      
                      {/* Suggestion Text */}
                      <h4 className={`text-xs font-medium text-left leading-relaxed ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      } font-tiro-bangla group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}>
                        {suggestions[2].text}
                      </h4>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:animate-shine transition-opacity duration-500"></div>
                  </button>
                </div>
              )}
                </>
              )}
            </div>
          </div>
                </div>
      </header>

      {/* Chat Container */}
      <div className={`max-w-3xl mx-auto px-3 py-3 ${messages.length > 0 ? 'pt-2' : 'pt-0'} pb-24`}>
        <div className={`space-y-3 ${messages.length > 0 ? 'block' : 'hidden'}`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 items-start ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                  : 'bg-white'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Image 
                    src="/khoj-logo.png" 
                    alt="খোঁজ চ্যাট" 
                    width={20} 
                    height={20}
                    className="w-5 h-5 rounded-full"
                  />
                )}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`px-3 py-2 rounded-lg break-words relative ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-200' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {/* Copy and Download controls - Top Right */}
                  <div className={`absolute top-1 right-1 flex items-center gap-1 ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <button
                      onClick={() => copyMessage(message.id, message.content)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title="কপি করুন"
                    >
                      {copiedMessageId === message.id ? (
                        <Check className="w-2 h-2 text-green-600" />
                      ) : (
                        <Copy className="w-2 h-2 text-gray-500" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => downloadMessage(message.content, message.id)}
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title="ডাউনলোড করুন"
                    >
                      <Download className="w-2 h-2 text-blue-500" />
                    </button>
                  </div>

                  <div className="font-tiro-bangla leading-relaxed text-xs break-words overflow-wrap-anywhere pr-12">
                    {formatMessageContent(message.content)}
                    {message.content && isLoading && message.type === 'assistant' && message.id === messages[messages.length - 1]?.id && (
                      <span className="animate-pulse">|</span>
                    )}
                  </div>

                  {/* Sources for assistant messages */}
                  {message.type === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs font-medium font-tiro-bangla opacity-80">উৎসসমূহ:</p>
                      {message.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block p-2 rounded text-xs transition-colors border break-words ${
                            isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600 text-blue-400 hover:text-blue-300 border-gray-600' 
                              : 'bg-gray-50 hover:bg-gray-100 text-blue-600 hover:text-blue-800 border-gray-200'
                          }`}
                        >
                          <div className="font-medium font-tiro-bangla break-words">{source.title}</div>
                          <div className="text-xs opacity-70 mt-1 break-words">{source.snippet}</div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className={`flex items-center mt-1 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } font-tiro-bangla`}>
                    {message.timestamp.toLocaleTimeString('bn-BD', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
            
          {/* Loading animation - show before response starts generating */}
          {isGenerating && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/khoj-logo.png" 
                  alt="খোঁজ চ্যাট" 
                  width={20} 
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className={`font-tiro-bangla text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>আপনার জন্য উত্তর আসছে...</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator - show until response starts generating */}
          {isLoading && !isGenerating && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <Image 
                  src="/khoj-logo.png" 
                  alt="খোঁজ চ্যাট" 
                  width={20} 
                  height={20}
                  className="w-5 h-5 rounded-full"
                />
              </div>
              <div className={`px-3 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                  <span className={`font-tiro-bangla text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>চিন্তা করছি...</span>
                </div>
              </div>
            </div>
          )}
        </div>
          </div>

      {/* Typing Area */}
      <div className={`fixed bottom-0 left-0 right-0 pt-1 pb-2 px-2 transition-colors duration-300 z-40 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              {/* Input Container - Rectangular */}
              <div className={`relative rounded-xl border-0 transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 focus-within:bg-gray-700' 
                  : 'bg-gray-100 focus-within:bg-gray-200'
              }`}>

                {/* Input Field */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  className={`w-full min-h-12 max-h-32 px-4 pr-24 py-3 rounded-xl border-0 outline-none transition-all duration-200 font-tiro-bangla text-base placeholder:text-xs resize-none overflow-y-auto ${
                    isDarkMode 
                      ? 'bg-transparent text-gray-200 placeholder-gray-400' 
                      : 'bg-transparent text-gray-800 placeholder-gray-500'
                  }`}
                  style={{
                    height: 'auto',
                    minHeight: '48px',
                    maxHeight: '128px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement
                    target.style.height = 'auto'
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px'
                  }}
                  required
                />
                
                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`absolute right-12 top-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse shadow-lg' 
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800'
                  }`}
                  title={isRecording ? "Recording... Click to stop" : "Voice Input"}
                  disabled={!isClient || !isSupported || isLoading}
                >
                  {!isClient ? (
                    // Server-side fallback
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  ) : isSupported ? (
                    <Image
                      src="/mic.png"
                      alt="Voice Input"
                      width={16}
                      height={16}
                      className={`w-4 h-4 transition-all duration-200 ${
                        isRecording 
                          ? 'filter-none' 
                          : 'filter grayscale hover:grayscale-0'
                      }`}
                    />
                  ) : (
                    <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                  )}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={`absolute right-2 top-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group ${
                    input.trim() && !isLoading
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95' 
                      : isDarkMode 
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className={`w-4 h-4 transition-all duration-300 ${
                    input.trim() && !isLoading 
                      ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5' 
                      : ''
                  }`} />
                </button>
              </div>
            </div>
          </form>
          
          {/* Mode Selection Buttons */}
          <div className="mt-3 flex justify-center gap-2 relative z-50">
            {Object.entries(modeConfig).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Button clicked:', key)
                  setSelectedMode(key as 'khoj-chat' | 'citizen-service' | 'fact-check')
                }}
                className={`px-4 py-2 rounded-lg text-xs font-tiro-bangla transition-all duration-300 cursor-pointer ${
                  selectedMode === key 
                    ? key === 'khoj-chat'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : key === 'citizen-service'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-400 hover:text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-300'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
          
          <div className="mt-3">
            <p className={`text-center text-xs font-tiro-bangla ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              খোঁজ চ্যাট সঠিক তথ্য প্রদান করার চেষ্টা করে, তবে সবসময় যাচাই করে নিন।
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}