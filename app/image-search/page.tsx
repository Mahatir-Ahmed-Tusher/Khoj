'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'

interface SearchResult {
  success: boolean
  type: 'image' | 'audio' | 'video'
  sources: Array<{
    url: string
    title: string
    description?: string
    similarity: number
    publishedDate?: string
    source: string
    tavilyData?: {
      content: string
      published_date?: string
      author?: string
      image_context?: string
      surrounding_text?: string
      page_title?: string
      excerpt?: string
    }
  }>
  metadata?: {
    originalSource?: string
    creationDate?: string
    author?: string
    location?: string
  }
  analysis: {
    totalSources: number
    confidence: number
    processingTime: number
  }
  factCheckReport?: {
    title: string
    originalUploadSource: string
    earliestTimestamp: string
    contextualAnalysis: string
    usageDescription: string
    sources: Array<{
      url: string
      title: string
      context: string
      timestamp?: string
    }>
    conclusion: string
  }
  message?: string
  id?: string
  savedAt?: string
}

export default function ImageSearchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState<string | null>('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>('')
  const [isClient, setIsClient] = useState(false)
  const [savedReports, setSavedReports] = useState<SearchResult[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const router = useRouter()

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load saved reports from localStorage
  useEffect(() => {
    if (isClient) {
      const saved = localStorage.getItem('imageSearchReports')
      if (saved) {
        try {
          setSavedReports(JSON.parse(saved))
        } catch (error) {
          console.error('Error loading saved reports:', error)
        }
      }
    }
  }, [isClient])

  // Check for file data from sessionStorage
  useEffect(() => {
    if (isClient) {
      const fileDataStr = sessionStorage.getItem('selectedImageFile')
      if (fileDataStr) {
        try {
          const fileData = JSON.parse(fileDataStr)
          
          // Convert base64 back to File object
          const byteCharacters = atob(fileData.content.split(',')[1])
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: fileData.type })
          const actualFile = new File([blob], fileData.name, {
            type: fileData.type,
            lastModified: fileData.lastModified
          })
          
          setFile(actualFile)
          setPreviewUrl(fileData.content) // Use the base64 data URL for preview
          setUploadProgress('ছবি আপলোড হচ্ছে...')
          
          // Auto-start search after a short delay
          setTimeout(() => {
            handleImageSearch(actualFile)
          }, 1000)
          
          // Clear sessionStorage
          sessionStorage.removeItem('selectedImageFile')
        } catch (error) {
          console.error('Error parsing file data:', error)
          setError('ফাইল ডেটা লোড করতে সমস্যা হয়েছে')
        }
      }
    }
  }, [isClient])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setResult(null)
      
      // Create preview URL
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleImageSearch = async (fileToSearch: File) => {
    setIsLoading(true)
    setError('')
    setResult(null)
    setUploadProgress('')

    try {
      // Update progress messages
      setUploadProgress('ছবি আপলোড হচ্ছে...')
      
      const formData = new FormData()
      formData.append('file', fileToSearch)
      formData.append('type', 'image')

      setUploadProgress('ছবি সার্চ করা হচ্ছে...')
      
      const response = await fetch('/api/source-search', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setUploadProgress('')
        // Save report to localStorage
        saveReportToLocalStorage(data)
      } else {
        setError(data.error || 'ছবিটির উৎস সন্ধান করতে সমস্যা হয়েছে')
        setUploadProgress('')
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।')
      setUploadProgress('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('দয়া করে একটি ফাইল নির্বাচন করুন')
      return
    }

    await handleImageSearch(file)
  }

  const handleDownloadText = () => {
    if (!result) return
    
    const reportText = generateReportText(result)
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `khoj-image-search-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const generateReportText = (reportData: SearchResult): string => {
    let text = 'খোঁজ - ছবি সন্ধান রিপোর্ট\n'
    text += `প্রতিবেদনের তারিখ: ${new Date().toLocaleDateString('bn-BD')}\n\n`
    
    if (reportData.factCheckReport) {
      text += `রিপোর্টের শিরোনাম: ${reportData.factCheckReport.title}\n\n`
      text += `মূল আপলোড উৎস: ${reportData.factCheckReport.originalUploadSource}\n\n`
      text += `সর্বপ্রথম দেখা গেছে: ${new Date(reportData.factCheckReport.earliestTimestamp).toLocaleDateString('bn-BD')}\n\n`
      text += `প্রেক্ষাপট বিশ্লেষণ:\n${reportData.factCheckReport.contextualAnalysis}\n\n`
      text += `ব্যবহারের বর্ণনা:\n${reportData.factCheckReport.usageDescription}\n\n`
      
      text += 'উৎসসমূহ:\n'
      reportData.factCheckReport.sources.forEach((source, index) => {
        text += `${index + 1}. ${source.title}\n`
        text += `   প্রেক্ষাপট: ${source.context}\n`
        if (source.timestamp) {
          text += `   তারিখ: ${new Date(source.timestamp).toLocaleDateString('bn-BD')}\n`
        }
        text += `   লিংক: ${source.url}\n\n`
      })
      
      text += `সিদ্ধান্ত:\n${reportData.factCheckReport.conclusion}\n\n`
    }
    
    text += 'বিশ্লেষণ সারসংক্ষেপ:\n'
    text += `মোট উৎস: ${reportData.analysis.totalSources}\n`
    text += `আস্থা: ${reportData.analysis.confidence}%\n`
    text += `প্রক্রিয়াকরণ সময়: ${reportData.analysis.processingTime} সেকেন্ড\n`
    
    return text
  }

  const saveReportToLocalStorage = (reportData: SearchResult) => {
    const newReport = {
      ...reportData,
      savedAt: new Date().toISOString(),
      id: Date.now().toString()
    }
    
    const updatedReports = [newReport, ...savedReports]
    setSavedReports(updatedReports)
    localStorage.setItem('imageSearchReports', JSON.stringify(updatedReports))
  }

  const deleteReport = (reportId: string) => {
    const updatedReports = savedReports.filter(report => report.id !== reportId)
    setSavedReports(updatedReports)
    localStorage.setItem('imageSearchReports', JSON.stringify(updatedReports))
  }

  const downloadSavedReport = (reportData: SearchResult) => {
    const reportText = generateReportText(reportData)
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `khoj-image-search-${reportData.savedAt?.split('T')[0] || 'unknown'}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Loading screen component
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-200">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 font-tiro-bangla">
          একটু অপেক্ষা করুন
        </h2>
        <p className="text-sm text-gray-600 font-tiro-bangla">
          আপনার আপলোড করা ছবিটি অনলাইনে আর কোথায় কোথায় আছে, খোঁজ তা খুঁজে এনে দিচ্ছে, একটু অপেক্ষা করুন
        </p>
      </div>
    </div>
  )

  // Show loading screen when searching
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-slate-50">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 right-4 z-50 p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:bg-white transition-all"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">📋</span>
          <span className="text-sm font-tiro-bangla">পূর্ববর্তী সার্চ</span>
          <span className="text-xs text-gray-500">({savedReports.length})</span>
        </div>
      </button>

      {/* Collapsible Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200/50 transform transition-transform duration-300 z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 font-tiro-bangla">
              সেভ করা রিপোর্ট
            </h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
          
          {savedReports.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📄</span>
              <p className="text-gray-600 font-tiro-bangla text-sm">
                এখনো কোনো রিপোর্ট সেভ করা হয়নি
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              {savedReports.map((report) => (
                <div key={report.id} className="bg-gray-50/80 rounded-lg p-4 border border-gray-200/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800 font-tiro-bangla text-sm line-clamp-2">
                      {report.factCheckReport?.title || 'রিপোর্ট'}
                    </h3>
                    <button
                      onClick={() => deleteReport(report.id!)}
                      className="p-1 hover:bg-red-100 rounded transition-colors text-red-500"
                    >
                      <span className="text-xs">🗑️</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 font-tiro-bangla mb-3">
                    {report.savedAt ? new Date(report.savedAt).toLocaleDateString('bn-BD') : 'তারিখ অজানা'}
                  </p>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setResult(report)
                        setIsSidebarOpen(false)
                      }}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors font-tiro-bangla"
                    >
                      দেখুন
                    </button>
                    <button
                      onClick={() => downloadSavedReport(report)}
                      className="flex-1 px-3 py-2 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors font-tiro-bangla"
                    >
                      ডাউনলোড
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-200/80 to-indigo-200/80 blur-xl"></div>
            <div className="relative w-full h-full rounded-3xl bg-white/60 backdrop-blur border border-blue-200 flex items-center justify-center shadow-xl">
              <img 
                src="https://i.postimg.cc/d14zRx5D/image.png" 
                alt="Image Search Icon" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 font-tiro-bangla tracking-tight">
            ছবি সার্চ
          </h1>
          <p className="text-base md:text-lg text-gray-600 font-tiro-bangla">
            আপনার ছবিটি কোথায় কোথায় আছে—স্মার্ট বিশ্লেষণে এক জায়গায় দেখুন
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-tiro-bangla">
                ছবি আপলোড করুন
              </label>
              
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-gray-300 transition-colors bg-gradient-to-br from-gray-50/60 to-slate-50/60">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="inline-block p-2 bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-2xl border border-blue-200">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-w-full h-48 object-contain mx-auto rounded-xl bg-white shadow-inner"
                        />
                      </div>
                      <p className="text-sm text-gray-600 font-tiro-bangla">
                        {file?.name} - {file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <img 
                          src="https://i.postimg.cc/Prm02J3Z/image.png" 
                          alt="Upload Icon" 
                          className="w-12 h-12 object-contain mx-auto"
                        />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-800 font-tiro-bangla">
                          {file ? file.name : 'ছবি আপলোড করুন'}
                        </p>
                        <p className="text-sm text-gray-500 font-tiro-bangla">
                          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'ক্লিক করে ছবি নির্বাচন করুন'}
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!file || isLoading}
                className={`px-8 py-3 rounded-xl font-medium transition-all font-tiro-bangla ${
                  !file || isLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : ''
                }`}
                style={!file || isLoading ? {} : { background: 'linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(79,70,229,1) 100%)', color: 'white', boxShadow: '0 10px 20px rgba(79,70,229,0.25)' }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">আপনার আপলোড করা ছবিটা নিয়ে আমরা ইন্টারনেটে ঘাটাঘাটি করছি...</span>
                  </div>
                ) : (
                  <span className="text-sm">ছবিটা সার্চ করুন</span>
                )}
              </button>
            </div>

            {/* Progress Message */}
            {uploadProgress && (
              <div className="text-center">
                <p className="text-sm text-gray-600 font-tiro-bangla">{uploadProgress}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-tiro-bangla text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 font-tiro-bangla">
                সার্চ রেজাল্ট
              </h3>
              
              <div className="flex items-center space-x-3">
                {/* Start New Search Button */}
                <button
                  onClick={() => {
                    setResult(null)
                    setFile(null)
                    setPreviewUrl(null)
                    setError(null)
                    setUploadProgress(null)
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 font-tiro-bangla text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <span>🔄</span>
                    <span>নতুন ছবি সার্চ</span>
                  </div>
                </button>
                
                {/* Text Download Button */}
                {result.factCheckReport && (
                  <button
                    onClick={handleDownloadText}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 font-tiro-bangla text-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <span>📄</span>
                      <span>টেক্সট ডাউনলোড</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
            
            {/* Coming Soon Message for Audio/Video */}
            {result.message && (
              <div className="text-center py-8">
                <span className="text-3xl mb-4 block">🚧</span>
                <p className="text-gray-600 font-tiro-bangla text-base mb-2">
                  {result.message}
                </p>
                <p className="text-sm text-gray-500 font-tiro-bangla">
                  আমরা শীঘ্রই এই ফিচারটি চালু করব
                </p>
              </div>
            )}
            
            {/* Regular Results */}
            {!result.message && (
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl p-6 border border-gray-200/50">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 font-tiro-bangla">
                    বিশ্লেষণ সারসংক্ষেপ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.totalSources}</div>
                      <div className="text-xs text-gray-600 font-tiro-bangla">মোট উৎস</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.confidence}%</div>
                      <div className="text-xs text-gray-600 font-tiro-bangla">আস্থা</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.processingTime}s</div>
                      <div className="text-xs text-gray-600 font-tiro-bangla">প্রক্রিয়াকরণ সময়</div>
                    </div>
                  </div>
                </div>

                {/* Sources List */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-4 font-tiro-bangla">
                    পাওয়া উৎসসমূহ
                  </h4>
                  <div className="space-y-3">
                    {result.sources.map((source, index) => (
                      <div key={index} className="border border-gray-200/50 rounded-xl p-4 hover:bg-gray-50/50 transition-colors bg-white/50">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800 font-tiro-bangla text-sm">
                            {source.title}
                          </h5>
                          <span className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs px-2 py-1 rounded-lg font-tiro-bangla border border-amber-200">
                            {source.similarity}% মিল
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mb-3 font-tiro-bangla">
                          {source.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-tiro-bangla">
                            উৎস: {source.source}
                          </span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 text-xs font-medium font-tiro-bangla"
                          >
                            দেখুন →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gemini Fact-Check Report */}
                {result.factCheckReport && (
                  <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl p-6 border border-blue-200/50">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 font-tiro-bangla">
                      {result.factCheckReport.title}
                    </h4>
                    
                    {/* Original Upload Source */}
                    <div className="mb-4 p-4 bg-white/60 rounded-lg border border-blue-100">
                      <h5 className="font-semibold text-gray-800 mb-2 font-tiro-bangla">মূল আপলোড উৎস:</h5>
                      <a 
                        href={result.factCheckReport.originalUploadSource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-tiro-bangla text-sm break-all"
                      >
                        {result.factCheckReport.originalUploadSource}
                      </a>
                      <p className="text-xs text-gray-600 mt-1 font-tiro-bangla">
                        সর্বপ্রথম দেখা গেছে: {new Date(result.factCheckReport.earliestTimestamp).toLocaleDateString('bn-BD')}
                      </p>
                    </div>

                    {/* Contextual Analysis */}
                    <div className="mb-4 p-4 bg-white/60 rounded-lg border border-blue-100">
                      <h5 className="font-semibold text-gray-800 mb-2 font-tiro-bangla">প্রেক্ষাপট বিশ্লেষণ:</h5>
                      <p className="text-sm text-gray-700 font-tiro-bangla leading-relaxed">
                        {result.factCheckReport.contextualAnalysis}
                      </p>
                    </div>

                    {/* Usage Description */}
                    <div className="mb-4 p-4 bg-white/60 rounded-lg border border-blue-100">
                      <h5 className="font-semibold text-gray-800 mb-2 font-tiro-bangla">ব্যবহারের বর্ণনা:</h5>
                      <p className="text-sm text-gray-700 font-tiro-bangla leading-relaxed">
                        {result.factCheckReport.usageDescription}
                      </p>
                    </div>

                    {/* Sources with Context */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-800 mb-3 font-tiro-bangla">উৎসসমূহ:</h5>
                      <div className="space-y-3">
                        {result.factCheckReport.sources.map((source, index) => (
                          <div key={index} className="p-3 bg-white/60 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="font-medium text-gray-800 font-tiro-bangla text-sm">
                                {source.title}
                              </h6>
                              {source.timestamp && (
                                <span className="text-xs text-gray-500 font-tiro-bangla">
                                  {new Date(source.timestamp).toLocaleDateString('bn-BD')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2 font-tiro-bangla">
                              {source.context}
                            </p>
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 text-xs font-medium font-tiro-bangla"
                            >
                              দেখুন →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conclusion */}
                    <div className="p-4 bg-white/60 rounded-lg border border-blue-100">
                      <h5 className="font-semibold text-gray-800 mb-2 font-tiro-bangla">সিদ্ধান্ত:</h5>
                      <p className="text-sm text-gray-700 font-tiro-bangla leading-relaxed">
                        {result.factCheckReport.conclusion}
                      </p>
                    </div>
                  </div>
                )}

                {/* Metadata */}
                {result.metadata && (
                  <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl p-6 border border-gray-200/50">
                    <h4 className="text-base font-semibold text-gray-800 mb-4 font-tiro-bangla">
                      মেটাডেটা
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {result.metadata.originalSource && (
                        <div>
                          <span className="font-medium text-gray-700 font-tiro-bangla">মূল উৎস:</span>
                          <span className="ml-2 text-gray-600 font-tiro-bangla">{result.metadata.originalSource}</span>
                        </div>
                      )}
                      {result.metadata.creationDate && (
                        <div>
                          <span className="font-medium text-gray-700 font-tiro-bangla">তৈরির তারিখ:</span>
                          <span className="ml-2 text-gray-600 font-tiro-bangla">
                            {new Date(result.metadata.creationDate).toLocaleDateString('bn-BD')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
