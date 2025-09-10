'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, Eye, X } from 'lucide-react'
import { AIFactCheck, getAIFactChecks, clearAIFactChecks } from '@/lib/ai-factcheck-utils'

export default function AIFactCheckWidget() {
  const [aiFactChecks, setAiFactChecks] = useState<AIFactCheck[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load AI fact checks from localStorage on component mount
  useEffect(() => {
    const checks = getAIFactChecks()
    setAiFactChecks(checks)
  }, [])

  // Listen for storage changes (when fact checks are added from other pages)
  useEffect(() => {
    const handleStorageChange = () => {
      const checks = getAIFactChecks()
      setAiFactChecks(checks)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const deleteFactCheck = (id: string) => {
    const updatedChecks = aiFactChecks.filter(check => check.id !== id)
    localStorage.setItem('ai-fact-checks', JSON.stringify(updatedChecks))
    setAiFactChecks(updatedChecks)
  }

  const downloadFactChecks = () => {
    const dataStr = JSON.stringify(aiFactChecks, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-fact-checks-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const downloadSingleFactCheck = (check: AIFactCheck) => {
    const content = `
Khoj ফ্যাক্ট চেকার রিপোর্ট
========================

দাবি: ${check.query}
তৈরির তারিখ: ${new Date(check.generatedAt).toLocaleString('bn-BD')}

${check.result}

উৎসসমূহ:
${check.sources.map(source => `${source.id}. ${source.title} - ${source.url}`).join('\n')}

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
    `
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fact-check-${check.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAllFactChecks = () => {
    if (confirm('আপনি কি সব এআই ফ্যাক্টচেক মুছে ফেলতে চান?')) {
      clearAIFactChecks()
      setAiFactChecks([])
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true': return 'bg-green-100 text-green-800'
      case 'false': return 'bg-red-100 text-red-800'
      case 'misleading': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case 'true': return 'সত্য'
      case 'false': return 'মিথ্যা'
      case 'misleading': return 'ভ্রান্তিমূলক'
      default: return 'অযাচাইকৃত'
    }
  }

  return (
    <>
      {/* Desktop Widget */}
      <div className="hidden lg:block bg-white rounded-xl p-4 sticky top-4 border border-gray-300"
           style={{
             background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
           }}>
        <h3 className="text-base font-bold mb-3 font-tiro-bangla text-center text-gray-800">
          আপনার এআই ফ্যাক্টচেক সমূহ
        </h3>
        
        {aiFactChecks.length === 0 ? (
          <div className="text-center py-6">
            <div className="mb-2">
              <img 
                src="https://i.postimg.cc/BQZw4j8L/image.png"
                alt="factcheck icon- Tusher Mia"
                className="w-12 h-12 mx-auto"
              />
            </div>
            <p className="text-gray-500 text-xs font-tiro-bangla mb-3">
              এখনও কোনো এআই ফ্যাক্টচেক নেই
            </p>
            <Link 
              href="/#search"
              className="text-primary-600 hover:text-primary-700 text-xs font-medium font-tiro-bangla"
            >
              প্রথম ফ্যাক্টচেক করুন →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {aiFactChecks.slice(0, 3).map((check) => (
              <div key={check.id} className="bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-transparent">
                    <div className="w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <span className={`inline-block px-1.5 py-0.5 rounded-full text-xs font-medium ${getVerdictColor(check.verdict)}`}>
                        {getVerdictText(check.verdict)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/factcheck-view/${check.id}`;
                          }}
                          className="text-gray-400 hover:text-primary-600 p-1 rounded transition-colors"
                          title="রিপোর্ট দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSingleFactCheck(check);
                          }}
                          className="text-gray-400 hover:text-green-600 p-1 rounded transition-colors"
                          title="ডাউনলোড করুন"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFactCheck(check.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                          title="মুছুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium font-tiro-bangla text-gray-800 line-clamp-1 text-sm cursor-pointer hover:text-primary-600 transition-colors"
                        onClick={() => window.location.href = `/factcheck-view/${check.id}`}>
                      {check.query}
                    </h4>
                    <p className="text-xs text-gray-600 font-tiro-bangla">
                      {new Date(check.timestamp).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {aiFactChecks.length > 3 && (
              <div className="text-center">
                <Link 
                  href="/factcheck-view"
                  className="text-primary-600 hover:text-primary-700 text-xs font-medium font-tiro-bangla"
                >
                  +{aiFactChecks.length - 3} আরও দেখুন →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-7 h-7 flex items-center justify-center"
        >
          <img 
            src="https://i.postimg.cc/pL8rd6jS/image.png"
            alt="Toggle AI FactCheck"
            className="w-full h-full object-contain"
          />
        </button>
      </div>

      {/* Mobile Collapsible Sidebar */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-tiro-bangla">
              আপনার এআই ফ্যাক্টচেক সমূহ
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {aiFactChecks.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-2">
                  <img 
                    src="https://i.postimg.cc/BQZw4j8L/image.png"
                    alt="AI Robot"
                    className="w-16 h-16 mx-auto"
                  />
                </div>
                <p className="text-gray-500 text-sm font-tiro-bangla mb-4">
                  এখনও কোনো এআই ফ্যাক্টচেক নেই
                </p>
                <Link 
                  href="/#search"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium font-tiro-bangla"
                >
                  প্রথম ফ্যাক্টচেক করুন →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {aiFactChecks.map((check) => (
                  <div key={check.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(check.verdict)}`}>
                        {getVerdictText(check.verdict)}
                      </span>
                      <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(false);
                            window.location.href = `/factcheck-view/${check.id}`;
                          }}
                          className="text-gray-400 hover:text-primary-600 p-1 rounded transition-colors"
                          title="রিপোর্ট দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadSingleFactCheck(check);
                          }}
                          className="text-gray-400 hover:text-green-600 p-1 rounded transition-colors"
                          title="ডাউনলোড করুন"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteFactCheck(check.id);
                          }}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                          title="মুছুন"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 font-tiro-bangla line-clamp-3 mb-1 cursor-pointer hover:text-primary-600 transition-colors break-words"
                       onClick={() => {
                         setIsOpen(false);
                         window.location.href = `/factcheck-view/${check.id}`;
                       }}>
                      {check.query}
                    </p>
                    <p className="text-xs text-gray-500 font-tiro-bangla">
                      {new Date(check.timestamp).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
