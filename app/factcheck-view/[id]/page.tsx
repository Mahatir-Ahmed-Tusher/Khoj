'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Footer from '@/components/Footer'
import { Download, ExternalLink, CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react'
import { getAIFactChecks } from '@/lib/ai-factcheck-utils'
import type { AIFactCheck } from '@/lib/ai-factcheck-utils'
import { parseMarkdown, sanitizeHtml } from '@/lib/markdown'

export default function FactCheckViewPage() {
  const params = useParams()
  const id = params.id as string
  
  const [factCheck, setFactCheck] = useState<AIFactCheck | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id) {
      const allChecks = getAIFactChecks()
      const foundCheck = allChecks.find(check => check.id === id)
      
      if (foundCheck) {
        setFactCheck(foundCheck)
      } else {
        setNotFound(true)
      }
    }
  }, [id])

  const downloadReport = () => {
    if (!factCheck) return

    const content = `
Khoj ফ্যাক্ট চেকার রিপোর্ট
========================

দাবি: ${factCheck.query}
তৈরির তারিখ: ${new Date(factCheck.generatedAt).toLocaleString('bn-BD')}

${factCheck.result}

উৎসসমূহ:
${factCheck.sources.map(source => `${source.id}. ${source.title} - ${source.url}`).join('\n')}

---
এই রিপোর্টটি Khoj ফ্যাক্ট চেকার দ্বারা তৈরি করা হয়েছে।
     `

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fact-check-${factCheck.id}.txt`
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
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
      default:
        return <HelpCircle className="h-6 w-6 text-gray-600" />
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ফ্যাক্ট চেক পাওয়া যায়নি
          </h1>
          <p className="text-gray-600">
            এই ফ্যাক্ট চেকটি আর পাওয়া যায় না। সম্ভবত এটি মুছে ফেলা হয়েছে।
          </p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!factCheck) {
    return (
      <div className="min-h-screen bg-gray-50">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            লোড হচ্ছে...
          </h1>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            সংরক্ষিত ফ্যাক্ট চেকিং রিপোর্ট
          </h1>
          <p className="text-lg text-gray-600">
            "{factCheck.query}" এর জন্য পূর্বে তৈরি করা বিশ্লেষণ
          </p>
        </div>

        {/* Report */}
        <div className="space-y-8">
          {/* Report Header */}
          <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary-600">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {getVerdictIcon(factCheck.verdict)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    ফ্যাক্ট চেকিং রিপোর্ট
                  </h2>
                  <p className="text-gray-600 font-solaiman-lipi">
                    সংরক্ষিত AI চালিত বিশ্লেষণ
                  </p>
                </div>
              </div>
              <button
                onClick={downloadReport}
                className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Download className="h-5 w-5" />
                <span className="font-medium">ডাউনলোড করুন</span>
              </button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">দাবি:</h3>
              <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                {factCheck.query}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">তৈরির তারিখ:</h3>
              <p className="text-gray-600 bg-white px-4 py-2 rounded-lg inline-block">
                {new Date(factCheck.generatedAt).toLocaleString('bn-BD')}
              </p>
            </div>
          </div>

          {/* Detailed Report */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
              বিস্তারিত বিশ্লেষণ:
            </h3>
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-gray-700 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ 
                  __html: sanitizeHtml(parseMarkdown(factCheck.result)) 
                }}
              />
            </div>
          </div>

          {/* Sources */}
          {factCheck.sources && factCheck.sources.length > 0 && (
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-600">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                উৎসসমূহ:
              </h3>
              
              {/* Source Info */}
              {factCheck.sourceInfo && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-700 font-medium">মোট উৎস:</span>
                      <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{factCheck.sourceInfo.totalSources}টি</span>
                    </div>
                    {factCheck.sourceInfo.hasBengaliSources && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-700 font-medium">বাংলা উৎস:</span>
                        <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full">✓ পাওয়া গেছে</span>
                      </div>
                    )}
                    {factCheck.sourceInfo.hasEnglishSources && (
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-700 font-medium">ইংরেজি উৎস:</span>
                        <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded-full">✓ ব্যবহার করা হয়েছে</span>
                      </div>
                    )}
                  </div>
                  {factCheck.sourceInfo.hasEnglishSources && (
                    <p className="text-blue-600 text-sm mt-3 p-3 bg-blue-50 rounded-lg">
                      💡 বাংলায় পর্যাপ্ত তথ্য না থাকায় ইংরেজি উৎস থেকে তথ্য সংগ্রহ করে বাংলায় অনুবাদ করা হয়েছে।
                    </p>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                {factCheck.sources.map((source) => (
                  <div key={source.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {source.id}. {source.title}
                          </h4>
                          {source.language && (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              source.language === 'English' 
                                ? 'bg-orange-100 text-orange-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {source.language === 'English' ? 'ইংরেজি' : 'বাংলা'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {source.snippet}
                        </p>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-2 ml-4 bg-primary-50 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors"
                      >
                        <span>উৎস দেখুন</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
