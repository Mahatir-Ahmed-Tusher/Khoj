'use client'

import { useState, useRef, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Send, Loader2, MessageCircle, Flag, Copy, Download } from 'lucide-react'

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function MuktiCornerPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize messages only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    setMessages([
      {
        id: '1',
        text: 'মুক্তিযুদ্ধ নিয়ে আপনার সমস্ত কনফিউশন দূর করা কিংবা শহীদের সংখ্যা, পরিসংখ্যান ইত্যাদি সবকিছু নিয়ে আমাকে প্রশ্ন করুন। আমি আছি আপনার সত্যান্বেষে সহায়ক হতে।',
        isUser: false,
        timestamp: new Date()
      }
    ])
  }, [])

  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/mukti-corner-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        isUser: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'দুঃখিত, আপনার প্রশ্নের উত্তর দিতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyBotResponse = async (messageText: string) => {
    const textContent = `
মুক্তিযুদ্ধ কর্নার - চ্যাটবটের উত্তর
====================================

${messageText}

যাচাইকৃত: ${new Date().toLocaleString('bn-BD')}
    `.trim()

    try {
      await navigator.clipboard.writeText(textContent)
      alert('উত্তর কপি করা হয়েছে!')
    } catch (error) {
      console.error('Copy failed:', error)
      alert('কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
  }

  const downloadBotResponse = (messageText: string) => {
    const textContent = `
মুক্তিযুদ্ধ কর্নার - চ্যাটবটের উত্তর
====================================

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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-3xl font-bold text-gray-900 font-solaiman-lipi">
              মুক্তিযুদ্ধ কর্নার
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-solaiman-lipi">
            আমাদের মুক্তিযুদ্ধ নিয়ে আপনার যেকোনো প্রশ্নের জন্যে এই কর্নার
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex flex-col overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-cover bg-center bg-no-repeat mukti-chat-bg">
            {!isClient ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                  <span className="text-gray-600 font-solaiman-lipi">লোড হচ্ছে...</span>
                </div>
              </div>
            ) : (
              <>
                                 {messages.map((message) => (
                   <div
                     key={message.id}
                     className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                   >
                     <div
                       className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                         message.isUser
                           ? 'bg-red-600 text-white shadow-lg'
                           : 'bg-white text-gray-900 shadow-lg border border-gray-200'
                       }`}
                     >
                       <p className="text-sm font-solaiman-lipi whitespace-pre-wrap leading-relaxed">
                         {message.text}
                       </p>
                       
                       {/* Action buttons for bot messages only */}
                       {!message.isUser && (
                         <div className="flex justify-end mt-3 space-x-2">
                           <button
                             onClick={() => copyBotResponse(message.text)}
                             className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs transition-colors duration-200 font-solaiman-lipi"
                           >
                             <Copy className="h-3 w-3" />
                             <span>কপি</span>
                           </button>
                           <button
                             onClick={() => downloadBotResponse(message.text)}
                             className="flex items-center space-x-1 bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded text-xs transition-colors duration-200 font-solaiman-lipi"
                           >
                             <Download className="h-3 w-3" />
                             <span>ডাউনলোড</span>
                           </button>
                         </div>
                       )}
                       
                       <p 
                         className={`text-xs mt-2 ${
                           message.isUser ? 'text-red-100' : 'text-gray-500'
                         }`}
                         suppressHydrationWarning
                       >
                         {typeof window !== 'undefined' ? message.timestamp.toLocaleTimeString('bn-BD') : message.timestamp.toISOString()}
                       </p>
                     </div>
                   </div>
                 ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                        <span className="text-sm text-gray-600 font-solaiman-lipi">
                          উত্তর তৈরি হচ্ছে...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex space-x-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="মুক্তিযুদ্ধ সম্পর্কে আপনার প্রশ্ন লিখুন..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none font-solaiman-lipi"
                rows={2}
                disabled={isLoading}
              />
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
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-green-50 rounded-2xl p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-900 mb-3 font-solaiman-lipi">
            এই চ্যাটবট সম্পর্কে
          </h3>
          <p className="text-red-800 font-solaiman-lipi leading-relaxed">
            এই চ্যাটবট বাংলাদেশের মুক্তিযুদ্ধ ১৯৭১ সম্পর্কে বিস্তারিত তথ্য প্রদান করে। 
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
      
      <Footer />
    </div>
  )
}
