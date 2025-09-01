'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

interface ImageCheckResult {
  success: boolean
  verdict: 'true' | 'false' | 'misleading' | 'unverified'
  confidence: 'high' | 'medium' | 'low'
  explanation: string
  aiGeneratedScore: number
  requestId?: string
  mediaId?: string
}

export default function ImageCheckPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ImageCheckResult | null>(null)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImageUrl('')
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError('')
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setSelectedFile(null)
    setPreviewUrl(url)
    setResult(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile && !imageUrl) {
      setError('দয়া করে একটি ছবি আপলোড করুন বা URL দিন')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      
      if (selectedFile) {
        formData.append('image', selectedFile)
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl)
      }

      const response = await fetch('/api/image-check', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'ছবি যাচাই করতে সমস্যা হয়েছে')
      }
    } catch (err) {
      setError('নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।')
    } finally {
      setIsLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'bg-red-100 text-red-800'
      case 'false':
        return 'bg-green-100 text-green-800'
      case 'misleading':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case 'true':
        return 'AI দ্বারা তৈরি'
      case 'false':
        return 'প্রকৃত ছবি'
      case 'misleading':
        return 'সন্দেহজনক'
      default:
        return 'অযাচাইকৃত'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-600 text-4xl">🖼️</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            ছবি যাচাই
          </h1>
          <p className="text-xl text-gray-600 font-solaiman-lipi">
            AI দ্বারা তৈরি ছবি সনাক্ত করুন
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-solaiman-lipi">
                ছবি আপলোড করুন
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-solaiman-lipi">অথবা</span>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-solaiman-lipi">
                ছবির URL দিন
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Preview */}
            {previewUrl && (
              <div className="text-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full h-64 object-contain rounded-lg border border-gray-300"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (!selectedFile && !imageUrl)}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-solaiman-lipi"
            >
              {isLoading ? 'যাচাই হচ্ছে...' : 'ছবি যাচাই করুন'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 font-solaiman-lipi">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 font-solaiman-lipi">
                যাচাইকরণ ফলাফল
              </h3>
              
              <div className="space-y-4">
                {/* Verdict */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">ফলাফল:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(result.verdict)}`}>
                    {getVerdictText(result.verdict)}
                  </span>
                </div>

                {/* Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">আত্মবিশ্বাস:</span>
                  <span className="text-gray-900 font-medium">
                    {result.confidence === 'high' ? 'উচ্চ' : 
                     result.confidence === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                  </span>
                </div>

                {/* AI Score */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-solaiman-lipi">AI স্কোর:</span>
                  <span className="text-gray-900 font-medium">
                    {(result.aiGeneratedScore * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Explanation */}
                <div>
                  <span className="text-gray-700 font-solaiman-lipi">ব্যাখ্যা:</span>
                  <p className="text-gray-900 mt-1 font-solaiman-lipi">{result.explanation}</p>
                </div>

                {/* Request ID */}
                {result.requestId && (
                  <div className="text-sm text-gray-500">
                    রিকোয়েস্ট ID: {result.requestId}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            কিভাবে কাজ করে
          </h2>
          <p className="text-gray-600 mb-6 font-solaiman-lipi">
            আমাদের AI সিস্টেম ছবির বিভিন্ন বৈশিষ্ট্য বিশ্লেষণ করে AI দ্বারা তৈরি কিনা তা সনাক্ত করে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📸</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">ছবি আপলোড</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">ছবি আপলোড করুন বা URL দিন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">AI বিশ্লেষণ</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">AI ছবি বিশ্লেষণ করে</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">ফলাফল</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">বিস্তারিত রিপোর্ট পান</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/"
            className="btn-primary inline-flex items-center"
          >
            ← মূল পৃষ্ঠায় ফিরে যান
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
