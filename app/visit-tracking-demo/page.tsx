'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { visitTracker, getSafeVisitInfo, getSafeIsFirstVisit, getSafeIsNewSession } from '@/lib/visit-tracker'

// Dynamic import for VisitStats to prevent hydration issues
const VisitStats = dynamic(() => import('@/components/VisitStats'), {
  ssr: false,
  loading: () => <div className="text-center py-4">লোড হচ্ছে...</div>
})

export default function VisitTrackingDemo() {
  const [visitInfo, setVisitInfo] = useState(getSafeVisitInfo())
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark as client-side
    setIsClient(true)
    
    // Set initial time
    setCurrentTime(new Date())
    
    // Track this page visit
    visitTracker.trackVisit('visit-tracking-demo')
    
    // Update visit info
    setVisitInfo(getSafeVisitInfo())
    
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const resetTracking = () => {
    visitTracker.resetVisitTracking()
    setVisitInfo(getSafeVisitInfo())
    alert('ভিজিট ট্র্যাকিং রিসেট করা হয়েছে!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            ভিজিট ট্র্যাকিং ডেমো
          </h1>
          <p className="text-gray-600 font-tiro-bangla">
            এই পেজে আপনি দেখতে পারবেন কীভাবে ইউজার ভিজিট ট্র্যাক করা হয়
          </p>
        </div>

        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-tiro-bangla">
              বর্তমান অবস্থা
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-tiro-bangla">প্রথম আসা:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isClient && visitInfo.isFirstVisit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isClient ? (visitInfo.isFirstVisit ? 'হ্যাঁ' : 'না') : 'লোড হচ্ছে...'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-tiro-bangla">নতুন সেশন:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isClient && getSafeIsNewSession() ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isClient ? (getSafeIsNewSession() ? 'হ্যাঁ' : 'না') : 'লোড হচ্ছে...'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-tiro-bangla">বর্তমান সময়:</span>
                <span className="font-mono text-sm">
                  {isClient && currentTime ? currentTime.toLocaleTimeString('bn-BD') : 'লোড হচ্ছে...'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-tiro-bangla">
              দ্রুত তথ্য
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-tiro-bangla">মোট সেশন:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {visitInfo.sessionCount}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-tiro-bangla">এই পেজ ভিজিট:</span>
                <span className="text-2xl font-bold text-green-600">
                  {visitTracker.getPageVisitCount('visit-tracking-demo')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VisitStats pageName="visit-tracking-demo" showDetails={true} />
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-tiro-bangla">
              বিভিন্ন পেজের ভিজিট সংখ্যা
            </h2>
            <div className="space-y-2">
              {['home', 'mythbusting', 'mukti-corner', 'image-check', 'text-check'].map(page => (
                <div key={page} className="flex justify-between items-center">
                  <span className="text-gray-600 font-tiro-bangla">{page}:</span>
                  <span className="font-medium">{visitTracker.getPageVisitCount(page)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4 font-tiro-bangla">
            কিভাবে কাজ করে?
          </h2>
          <div className="space-y-3 text-blue-800 font-tiro-bangla">
            <p><strong>প্রথম আসা:</strong> localStorage ব্যবহার করে ব্রাউজারে প্রথম আসা রেকর্ড করা হয়</p>
            <p><strong>নতুন সেশন:</strong> sessionStorage ব্যবহার করে প্রতিবার ব্রাউজার খোলার সময় নতুন সেশন গণনা করা হয়</p>
            <p><strong>পেজ ভিজিট:</strong> প্রতিটি পেজের জন্য আলাদা ভিজিট কাউন্ট রাখা হয়</p>
            <p><strong>রিফ্রেশ:</strong> পেজ রিফ্রেশ করলে নতুন সেশন হয় না, কিন্তু পেজ ভিজিট কাউন্ট বাড়ে</p>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="text-center">
          <button
            onClick={resetTracking}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-tiro-bangla font-medium"
          >
            ভিজিট ট্র্যাকিং রিসেট করুন
          </button>
          
          <p className="text-sm text-gray-500 mt-2 font-tiro-bangla">
            সতর্কতা: এটি সব ভিজিট তথ্য মুছে দেবে
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
