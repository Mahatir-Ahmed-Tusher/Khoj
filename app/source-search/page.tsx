'use client'

import { useState } from 'react'
import Footer from '@/components/Footer'
import Link from 'next/link'

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

export default function SourceSearchPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'image' | 'audio' | 'video'>('image')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string>('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      setError('দয়া করে একটি ফাইল নির্বাচন করুন')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)
    setUploadProgress('')

    try {
      // Update progress messages
      setUploadProgress('ছবি আপলোড হচ্ছে...')
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', fileType)

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

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️'
      case 'audio':
        return '🎵'
      case 'video':
        return '🎬'
      default:
        return '📁'
    }
  }

  const getFileTypeText = (type: string) => {
    switch (type) {
      case 'image':
        return 'ছবি'
      case 'audio':
        return 'অডিও'
      case 'video':
        return 'ভিডিও'
      default:
        return 'ফাইল'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-600 text-4xl">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            উৎস সন্ধান
          </h1>
          <p className="text-xl text-gray-600 font-tiro-bangla">
            ছবি, অডিও বা ভিডিও আপলোড করে আসল উৎস খুঁজে বের করুন
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-tiro-bangla">
                ফাইলের ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setFileType('image')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    fileType === 'image'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🖼️</span>
                    <h3 className="font-semibold font-tiro-bangla">ছবি</h3>
                    <p className="text-sm text-gray-600 font-tiro-bangla">JPG, PNG, GIF</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFileType('audio')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    fileType === 'audio'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🎵</span>
                    <h3 className="font-semibold font-tiro-bangla">অডিও</h3>
                    <p className="text-sm text-gray-600 font-tiro-bangla">MP3, WAV, M4A</p>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFileType('video')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    fileType === 'video'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">🎬</span>
                    <h3 className="font-semibold font-tiro-bangla">ভিডিও</h3>
                    <p className="text-sm text-gray-600 font-tiro-bangla">MP4, AVI, MOV</p>
                  </div>
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-tiro-bangla">
                ফাইল আপলোড করুন
              </label>
              
              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={fileType === 'image' ? 'image/*' : fileType === 'audio' ? 'audio/*' : 'video/*'}
                  className="hidden"
                  id="file-upload"
                  disabled={isLoading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {previewUrl && fileType === 'image' ? (
                    <div className="space-y-4">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-w-full h-48 object-contain mx-auto rounded-lg border"
                      />
                                               <p className="text-sm text-gray-600 font-tiro-bangla">
                           {file?.name} - {file?.size ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB
                         </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-4xl mb-4">{getFileTypeIcon(fileType)}</div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 font-tiro-bangla">
                          {file ? file.name : `${getFileTypeText(fileType)} নির্বাচন করুন`}
                        </p>
                        <p className="text-sm text-gray-500 font-tiro-bangla">
                          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'ক্লিক করে ফাইল নির্বাচন করুন'}
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
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  !file || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                } font-tiro-bangla`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>সন্ধান করা হচ্ছে...</span>
                  </div>
                ) : (
                  'উৎস সন্ধান করুন'
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-tiro-bangla">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-tiro-bangla">
              সন্ধান ফলাফল
            </h3>
            
            {/* Coming Soon Message for Audio/Video */}
            {result.message && (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">🚧</span>
                <p className="text-gray-600 font-tiro-bangla text-lg mb-2">
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
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                    বিশ্লেষণ সারসংক্ষেপ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{result.analysis.totalSources}</div>
                      <div className="text-sm text-gray-600 font-tiro-bangla">মোট উৎস</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{result.analysis.confidence}%</div>
                      <div className="text-sm text-gray-600 font-tiro-bangla">আস্থা</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{result.analysis.processingTime}s</div>
                      <div className="text-sm text-gray-600 font-tiro-bangla">প্রক্রিয়াকরণ সময়</div>
                    </div>
                  </div>
                </div>

                {/* Sources List */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                    পাওয়া উৎসসমূহ
                  </h4>
                  <div className="space-y-4">
                    {result.sources.map((source, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900 font-tiro-bangla">
                            {source.title}
                          </h5>
                          <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full font-tiro-bangla">
                            {source.similarity}% মিল
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 font-tiro-bangla">
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
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium font-tiro-bangla"
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
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
                      মেটাডেটা
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
