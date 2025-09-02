'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Zap, Loader2, AlertTriangle, CheckCircle, XCircle, Copy, Download } from 'lucide-react'

interface MythbustingResult {
  query: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified'
  summary: string
  detailedAnalysis: string
  sources: string[]
  evidenceSources?: Array<{
    title: string
    url: string
    snippet: string
  }>
  timestamp: string
}

export default function MythbustingPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MythbustingResult | null>(null)
  const [error, setError] = useState<string | null>(null)



  const handleSearch = async () => {
    if (!query.trim() || isLoading) return

    console.log('Starting mythbusting search for:', query.trim())
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/mythbusting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to analyze claim')
      }

      const data = await response.json()
      
      // Check if the response has the expected structure
      if (!data.verdict || !data.summary || !data.detailedAnalysis) {
        throw new Error('Invalid response format')
      }
      
      setResult(data)
    } catch (error) {
      console.error('Mythbusting error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setError(`দুঃখিত, আপনার দাবি বিশ্লেষণ করতে সমস্যা হচ্ছে: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  const copyToClipboard = async () => {
    if (!result) return
    
    const textContent = `
মিথবাস্টিং ফলাফল
==================

যাচাইকৃত দাবি: ${result.query}
ফলাফল: ${getVerdictText(result.verdict)}

সংক্ষিপ্ত ফলাফল:
${result.summary}

বিস্তারিত বিশ্লেষণ:
${result.detailedAnalysis}

${result.evidenceSources && result.evidenceSources.length > 0 ? `
প্রমাণ উৎসসমূহ:
${result.evidenceSources.map((source, index) => `${index + 1}. ${source.title}
   URL: ${source.url}
   বিবরণ: ${source.snippet}`).join('\n\n')}
` : ''}

${result.sources && result.sources.length > 0 ? `
অতিরিক্ত উৎসসমূহ:
${result.sources.map((source, index) => `${index + 1}. ${source}`).join('\n')}
` : ''}

যাচাইকৃত: ${new Date(result.timestamp).toLocaleString('bn-BD')}
    `.trim()

    try {
      await navigator.clipboard.writeText(textContent)
      alert('ফলাফল কপি করা হয়েছে!')
    } catch (error) {
      console.error('Copy failed:', error)
      alert('কপি করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    }
  }

  const downloadAsTxt = () => {
    if (!result) return
    
    const textContent = `
মিথবাস্টিং ফলাফল
==================

যাচাইকৃত দাবি: ${result.query}
ফলাফল: ${getVerdictText(result.verdict)}

সংক্ষিপ্ত ফলাফল:
${result.summary}

বিস্তারিত বিশ্লেষণ:
${result.detailedAnalysis}

${result.evidenceSources && result.evidenceSources.length > 0 ? `
প্রমাণ উৎসসমূহ:
${result.evidenceSources.map((source, index) => `${index + 1}. ${source.title}
   URL: ${source.url}
   বিবরণ: ${source.snippet}`).join('\n\n')}
` : ''}

${result.sources && result.sources.length > 0 ? `
অতিরিক্ত উৎসসমূহ:
${result.sources.map((source, index) => `${index + 1}. ${source}`).join('\n')}
` : ''}

যাচাইকৃত: ${new Date(result.timestamp).toLocaleString('bn-BD')}
    `.trim()

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mythbusting-result-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'false':
        return <XCircle className="h-6 w-6 text-red-600" />
      case 'misleading':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />
      case 'partially_true':
        return <AlertTriangle className="h-6 w-6 text-blue-600" />
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-600" />
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'সত্য'
      case 'false':
        return 'মিথ্যা'
      case 'misleading':
        return 'ভ্রান্তিমূলক'
      case 'partially_true':
        return 'আংশিক সত্য'
      default:
        return 'অযাচাইকৃত'
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'false':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'misleading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'partially_true':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/mythbusting.png" 
              alt="মিথবাস্টিং" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-3xl font-bold text-gray-900 font-solaiman-lipi">
              মিথবাস্টিং
            </h1>
          </div>
          
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              
              <p className="text-gray-600 font-solaiman-lipi">
                যেকোনো বৈজ্ঞানিক দাবি, ভূতুড়ে ঘটনা, কুসংস্কার বা সিউডোসায়েন্স সম্পর্কে প্রশ্ন করুন
              </p>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="যেমন: ভূত আছে কি নাই? অ্যাস্ট্রোলজি কি সত্য?"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent font-solaiman-lipi"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className="bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-solaiman-lipi"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'যাচাই করুন'
                )}
              </button>
            </div>

            {/* Example Queries */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 font-solaiman-lipi">উদাহরণ:</p>
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
                    onClick={() => setQuery(example)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors font-solaiman-lipi"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
            

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <p className="text-red-800 font-solaiman-lipi">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-solaiman-lipi">যাচাইকৃত দাবি</h3>
                  <p className="text-gray-300 font-solaiman-lipi">{result.query}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {getVerdictIcon(result.verdict)}
                  <span className="font-semibold font-solaiman-lipi">
                    {getVerdictText(result.verdict)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-end mt-4 space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-solaiman-lipi"
                >
                  <Copy className="h-4 w-4" />
                  <span>কপি করুন</span>
                </button>
                <button
                  onClick={downloadAsTxt}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-solaiman-lipi"
                >
                  <Download className="h-4 w-4" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                  সংক্ষিপ্ত ফলাফল
                </h4>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border ${getVerdictColor(result.verdict)}`}>
                  {getVerdictIcon(result.verdict)}
                  <span className="font-medium font-solaiman-lipi">{result.summary}</span>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                  বিস্তারিত বিশ্লেষণ
                </h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800 leading-relaxed font-solaiman-lipi whitespace-pre-wrap">
                    {result.detailedAnalysis}
                  </p>
                </div>
              </div>

              {/* Evidence Sources */}
              {result.evidenceSources && result.evidenceSources.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                    প্রমাণ উৎসসমূহ
                  </h4>
                  <div className="space-y-3">
                    {result.evidenceSources.map((source, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900 font-semibold font-solaiman-lipi block mb-1"
                            >
                              {source.title}
                            </a>
                            <p className="text-sm text-gray-600 font-solaiman-lipi leading-relaxed">
                              {source.snippet}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-solaiman-lipi">
                              {source.url}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sources */}
              {result.sources && result.sources.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
                    অতিরিক্ত উৎসসমূহ
                  </h4>
                  <div className="space-y-2">
                    {result.sources.map((source, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        <a 
                          href={source} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900 underline font-solaiman-lipi"
                        >
                          {source}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                             {/* Timestamp */}
               <div className="mt-6 pt-4 border-t border-gray-200">
                 <p className="text-sm text-gray-500 font-solaiman-lipi" suppressHydrationWarning>
                   যাচাইকৃত: {typeof window !== 'undefined' ? new Date(result.timestamp).toLocaleString('bn-BD') : result.timestamp}
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
            এই টুল সম্পর্কে
          </h3>
          <p className="text-gray-700 font-solaiman-lipi leading-relaxed">
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
      
      <Footer />
    </div>
  )
}
