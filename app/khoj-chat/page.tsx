'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, MessageCircle, Loader2, ExternalLink, Bot, User, Trash2, Send, Copy, Check, Lightbulb, Globe, Code, PanelLeftClose, PanelLeftOpen, Clock, X, Plus, Download } from 'lucide-react'
import Image from 'next/image'
import { parseMarkdown, sanitizeHtml } from '@/lib/markdown'

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
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

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
    setIsLoading(true)

    try {
      // Check if the message contains fact-checking keywords
      const factCheckKeywords = ['যাচাই', 'সত্য', 'মিথ্যা', 'খবর', 'নিউজ', 'সার্চ', 'সংবাদ', 'খবর যাচাই', 'খবর', 'খোঁজ', 'ডিবাংক', 'ফ্যাক্ট চেক', 'ফ্যাক্টচেক', 'ফ্যাক্টচেকিং', 'debunk', 'rumor', 'fact', 'check', 'verify']
      const isFactCheck = factCheckKeywords.some(keyword => 
        messageContent.toLowerCase().includes(keyword.toLowerCase())
      )

      // Don't add empty message immediately - wait for first content
      
      // Start streaming response
      const response = await fetch('/api/khoj-chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: messageContent,
          type: isFactCheck ? 'fact-check' : 'general'
        })
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
                    // Hide loading indicator when first content arrives
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
      
      // Save to chat history with final content
      if (assistantMessage) {
        const conversationTitle = userMessage.content.length > 50 
          ? userMessage.content.substring(0, 50) + '...' 
          : userMessage.content
        
        const finalAssistantMessage: Message = {
          ...assistantMessage,
          content: fullContent,
          sources: sources
        }
        
        const newChatHistory: ChatHistory = {
          id: Date.now().toString(),
          title: conversationTitle,
          messages: [userMessage, finalAssistantMessage],
          timestamp: new Date()
        }
        
        const updatedHistory = [newChatHistory, ...chatHistory].slice(0, 20) // Keep last 20 conversations
        setChatHistory(updatedHistory)
        saveChatHistory(updatedHistory)
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
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const loadConversation = (history: ChatHistory) => {
    setMessages(history.messages)
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

  const suggestions = [
    {
      text: "বাংলাদেশের সাম্প্রতিক রাজনৈতিক খবর যাচাই করুন",
      icon: Globe,
      type: "fact-check"
    },
    {
      text: "কৃত্রিম বুদ্ধিমত্তা সম্পর্কে জানুন",
      icon: Lightbulb,
      type: "general"
    },
    {
      text: "জলবায়ু পরিবর্তনের প্রভাব যাচাই করুন",
      icon: Globe,
      type: "fact-check"
    },
    {
      text: "প্রোগ্রামিং শেখার উপায়",
      icon: Code,
      type: "general"
    }
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
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

          {/* Suggestions */}
          <div className="mt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`flex-shrink-0 w-36 p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-end justify-between h-full">
                    <h4 className={`text-xs font-medium text-left w-full ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    } font-tiro-bangla leading-tight`}>
                      {suggestion.text}
                    </h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-2 ${
                      isDarkMode ? 'bg-gray-900' : 'bg-white'
                    }`}>
                      <suggestion.icon className={`w-3 h-3 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`} />
              </div>
              </div>
                </button>
              ))}
            </div>
          </div>
                </div>
      </header>

      {/* Chat Container */}
      <div className={`max-w-3xl mx-auto px-3 py-3 ${messages.length > 0 ? 'pt-2' : 'pt-0'} pb-16`}>
        <div className={`space-y-3 ${messages.length > 0 ? 'block' : 'hidden'}`}>
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 items-start ${
              message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`px-3 py-2 rounded-lg break-words ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                    : isDarkMode 
                      ? 'bg-gray-800 text-gray-200' 
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="font-tiro-bangla leading-relaxed text-xs break-words overflow-wrap-anywhere">
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

                {/* Copy and Download controls */}
                <div className={`flex items-center gap-1 mt-1 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
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
            
          {/* Loading indicator - show until response starts generating */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
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
      <div className={`fixed bottom-0 left-0 right-0 p-2 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="এখানে আপনার প্রশ্ন লিখুন"
                className={`w-full h-10 px-3 pr-10 rounded-full border-0 outline-none transition-colors duration-200 font-tiro-bangla text-xs ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-200 placeholder-gray-400 focus:bg-gray-700' 
                    : 'bg-gray-100 text-gray-800 placeholder-gray-500 focus:bg-gray-200'
                }`}
                required
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                  input.trim() && !isLoading
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDarkMode 
                      ? 'bg-gray-700 text-gray-500' 
                      : 'bg-gray-300 text-gray-400'
                }`}
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
            
            <button
              type="button"
              onClick={clearChat}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 relative hover:bg-gray-100 dark:hover:bg-gray-800"
              title="নতুন চ্যাট শুরু করুন"
            >
              <Image 
                src="https://i.postimg.cc/j53QNRf7/image.png" 
                alt="নতুন চ্যাট" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
            </button>
          </form>
          
          <p className={`text-center text-xs mt-1 font-tiro-bangla ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            খোঁজ চ্যাট সঠিক তথ্য প্রদান করার চেষ্টা করে, তবে সবসময় যাচাই করে নিন।
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}