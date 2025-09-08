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
  message?: string
}

export default function ImageSearchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [isClient, setIsClient] = useState(false)
  
  const router = useRouter()

  // Ensure client-side rendering to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

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
      } else {
        setError(data.error || 'উৎস সন্ধান করতে সমস্যা হয়েছে')
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

  // Loading screen component
  const LoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-200">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-3 font-solaiman-lipi">
          একটু অপেক্ষা করুন
        </h2>
        <p className="text-sm text-gray-600 font-solaiman-lipi">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-amber-200">
            <span className="text-amber-600 text-3xl">🔍</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3 font-solaiman-lipi tracking-tight">
            ছবি সন্ধান
          </h1>
          <p className="text-lg text-gray-600 font-solaiman-lipi">
            ছবি আপলোড করে অনলাইনে আর কোথায় আছে খুঁজে বের করুন
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 font-solaiman-lipi">
                ছবি আপলোড করুন
              </label>
              
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 transition-colors bg-gradient-to-br from-gray-50/50 to-slate-50/50">
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
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full h-48 object-contain mx-auto rounded-xl border border-gray-200 bg-white/50"
                      />
                      <p className="text-sm text-gray-600 font-solaiman-lipi">
                        {file?.name} - {file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-3xl mb-4">🖼️</div>
                      <div>
                        <p className="text-base font-medium text-gray-800 font-solaiman-lipi">
                          {file ? file.name : 'ছবি নির্বাচন করুন'}
                        </p>
                        <p className="text-sm text-gray-500 font-solaiman-lipi">
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
                className={`px-8 py-3 rounded-xl font-medium transition-all ${
                  !file || isLoading
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600'
                } font-solaiman-lipi`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">সন্ধান করা হচ্ছে...</span>
                  </div>
                ) : (
                  <span className="text-sm">ছবি সন্ধান করুন</span>
                )}
              </button>
            </div>

            {/* Progress Message */}
            {uploadProgress && (
              <div className="text-center">
                <p className="text-sm text-gray-600 font-solaiman-lipi">{uploadProgress}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-solaiman-lipi text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-solaiman-lipi">
              সন্ধান ফলাফল
            </h3>
            
            {/* Coming Soon Message for Audio/Video */}
            {result.message && (
              <div className="text-center py-8">
                <span className="text-3xl mb-4 block">🚧</span>
                <p className="text-gray-600 font-solaiman-lipi text-base mb-2">
                  {result.message}
                </p>
                <p className="text-sm text-gray-500 font-solaiman-lipi">
                  আমরা শীঘ্রই এই ফিচারটি চালু করব
                </p>
              </div>
            )}
            
            {/* Regular Results */}
            {!result.message && (
              <div className="space-y-6">
                {/* Analysis Summary */}
                <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl p-6 border border-gray-200/50">
                  <h4 className="text-base font-semibold text-gray-800 mb-4 font-solaiman-lipi">
                    বিশ্লেষণ সারসংক্ষেপ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.totalSources}</div>
                      <div className="text-xs text-gray-600 font-solaiman-lipi">মোট উৎস</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.confidence}%</div>
                      <div className="text-xs text-gray-600 font-solaiman-lipi">আস্থা</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{result.analysis.processingTime}s</div>
                      <div className="text-xs text-gray-600 font-solaiman-lipi">প্রক্রিয়াকরণ সময়</div>
                    </div>
                  </div>
                </div>

                {/* Sources List */}
                <div>
                  <h4 className="text-base font-semibold text-gray-800 mb-4 font-solaiman-lipi">
                    পাওয়া উৎসসমূহ
                  </h4>
                  <div className="space-y-3">
                    {result.sources.map((source, index) => (
                      <div key={index} className="border border-gray-200/50 rounded-xl p-4 hover:bg-gray-50/50 transition-colors bg-white/50">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-800 font-solaiman-lipi text-sm">
                            {source.title}
                          </h5>
                          <span className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 text-xs px-2 py-1 rounded-lg font-solaiman-lipi border border-amber-200">
                            {source.similarity}% মিল
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mb-3 font-solaiman-lipi">
                          {source.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 font-solaiman-lipi">
                            উৎস: {source.source}
                          </span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-600 hover:text-amber-700 text-xs font-medium font-solaiman-lipi"
                          >
                            দেখুন →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                {result.metadata && (
                  <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 rounded-xl p-6 border border-gray-200/50">
                    <h4 className="text-base font-semibold text-gray-800 mb-4 font-solaiman-lipi">
                      মেটাডেটা
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {result.metadata.originalSource && (
                        <div>
                          <span className="font-medium text-gray-700 font-solaiman-lipi">মূল উৎস:</span>
                          <span className="ml-2 text-gray-600 font-solaiman-lipi">{result.metadata.originalSource}</span>
                        </div>
                      )}
                      {result.metadata.creationDate && (
                        <div>
                          <span className="font-medium text-gray-700 font-solaiman-lipi">তৈরির তারিখ:</span>
                          <span className="ml-2 text-gray-600 font-solaiman-lipi">
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