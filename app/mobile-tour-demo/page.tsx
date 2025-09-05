'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SiteTour from '@/components/SiteTour'
import MobileTourTrigger from '@/components/MobileTourTrigger'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

export default function MobileTourDemo() {
  const [showTour, setShowTour] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Site Tour */}
      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Mobile tour completed!')
          setShowTour(false)
        }}
      />
      
      {/* Mobile Tour Trigger */}
      <MobileTourTrigger />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            মোবাইল ট্যুর ডেমো 📱
          </h1>
          <p className="text-gray-600 font-solaiman-lipi mb-6">
            এই পেজে আপনি মোবাইল-স্পেসিফিক ট্যুর সিস্টেম টেস্ট করতে পারবেন
          </p>
          
          {isMobile ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-solaiman-lipi font-medium">✅ মোবাইল ডিভাইস ডিটেক্ট করা হয়েছে</p>
              <p className="text-sm font-solaiman-lipi">নিচের ফ্লোটিং বাটনে ক্লিক করে ট্যুর শুরু করুন</p>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-solaiman-lipi font-medium">⚠️ ডেস্কটপ ডিভাইস</p>
              <p className="text-sm font-solaiman-lipi">ট্যুর শুধুমাত্র মোবাইল ডিভাইসে দেখানো হবে</p>
            </div>
          )}
        </div>

        {/* Demo Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              মোবাইল ট্যুর বৈশিষ্ট্য
            </h2>
            <ul className="space-y-2 text-gray-700 font-solaiman-lipi text-sm">
              <li>✅ শুধুমাত্র মোবাইলে কাজ করে</li>
              <li>✅ ছোট এবং সংক্ষিপ্ত টুলটিপ</li>
              <li>✅ মোবাইল UI ফিচার ফোকাস</li>
              <li>✅ টাচ-ফ্রেন্ডলি নেভিগেশন</li>
              <li>✅ অপটিমাইজড হাইলাইটিং</li>
              <li>✅ ফ্লোটিং ট্রিগার বাটন</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              ট্যুর স্টেপসমূহ
            </h2>
            <ol className="space-y-1 text-gray-700 font-solaiman-lipi text-sm">
              <li>1. স্বাগত বার্তা</li>
              <li>2. মোবাইল মেনু</li>
              <li>3. ফ্লোটিং অ্যাকশন বাটন</li>
              <li>4. ছবি যাচাই</li>
              <li>5. লেখা যাচাই</li>
              <li>6. উৎস সন্ধান</li>
              <li>7. মিথবাস্টিং</li>
              <li>8. সার্চ বার</li>
              <li>9. ট্যুর শেষ</li>
            </ol>
          </div>
        </div>

        {/* Demo Search Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            ডেমো সার্চ বার
          </h2>
          <SearchBar 
            placeholder="এখানে কিছু লিখুন..."
            data-tour="search-bar"
          />
        </div>

        {/* Demo Feature Buttons */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            ডেমো ফিচার বাটনসমূহ
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/image-check" 
              className="px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-solaiman-lipi text-center"
              data-tour="image-check"
            >
              ছবি যাচাই
            </Link>
            <Link 
              href="/text-check" 
              className="px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-solaiman-lipi text-center"
              data-tour="text-check"
            >
              লেখা যাচাই
            </Link>
            <Link 
              href="/source-search" 
              className="px-4 py-3 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors font-solaiman-lipi text-center"
              data-tour="source-search"
            >
              উৎস সন্ধান
            </Link>
            <Link 
              href="/mythbusting" 
              className="px-4 py-3 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-solaiman-lipi text-center"
              data-tour="mythbusting"
            >
              মিথবাস্টিং
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-900 mb-4 font-solaiman-lipi">
            কিভাবে ব্যবহার করবেন?
          </h2>
          <div className="space-y-3 text-blue-800 font-solaiman-lipi text-sm">
            <p><strong>মোবাইল ডিভাইস:</strong> নিচের ডানদিকের ফ্লোটিং বাটনে ক্লিক করুন</p>
            <p><strong>প্রথম আসা:</strong> মোবাইলে প্রথম আসলে ট্যুর স্বয়ংক্রিয়ভাবে শুরু হবে</p>
            <p><strong>নেভিগেশন:</strong> পরবর্তী/পূর্ববর্তী বাটন দিয়ে ট্যুর চালান</p>
            <p><strong>বন্ধ:</strong> ✕ আইকনে ক্লিক করে যেকোনো সময় ট্যুর বন্ধ করতে পারেন</p>
            <p><strong>হাইলাইট:</strong> প্রতিটি স্টেপে সংশ্লিষ্ট এলিমেন্ট হাইলাইট হবে</p>
            <p><strong>ডেস্কটপ:</strong> ডেস্কটপে ট্যুর দেখানো হবে না</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
