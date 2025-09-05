'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SiteTour from '@/components/SiteTour'
import TourTrigger from '@/components/TourTrigger'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

export default function SiteTourDemo() {
  const [showTour, setShowTour] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Site Tour */}
      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Site tour completed!')
          setShowTour(false)
        }}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            সাইট ট্যুর ডেমো
          </h1>
          <p className="text-gray-600 font-solaiman-lipi mb-6">
            এই পেজে আপনি সাইট ট্যুর সিস্টেম টেস্ট করতে পারবেন
          </p>
          
          <TourTrigger 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3"
            onClick={() => setShowTour(true)}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            সাইট ট্যুর শুরু করুন
          </TourTrigger>
        </div>

        {/* Demo Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              ট্যুর বৈশিষ্ট্য
            </h2>
            <ul className="space-y-2 text-gray-700 font-solaiman-lipi">
              <li>✅ প্রথম আসার সময় স্বয়ংক্রিয় ট্যুর</li>
              <li>✅ ইন্টারেক্টিভ নেভিগেশন (পরবর্তী/পূর্ববর্তী)</li>
              <li>✅ হাইলাইটিং এবং টুলটিপ</li>
              <li>✅ মোবাইল UI ফিচার গাইড</li>
              <li>✅ বাংলা ভাষায় সমস্ত টেক্সট</li>
              <li>✅ যেকোনো সময় ট্যুর শুরু করা যায়</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              ট্যুর স্টেপসমূহ
            </h2>
            <ol className="space-y-2 text-gray-700 font-solaiman-lipi">
              <li>1. স্বাগত বার্তা</li>
              <li>2. সাইডবার টগল (ফ্যাক্টচেক হিস্ট্রি)</li>
              <li>3. ফ্লোটিং অ্যাকশন বাটন</li>
              <li>4. ছবি যাচাই বাটন</li>
              <li>5. লেখা যাচাই বাটন</li>
              <li>6. উৎস সন্ধান বাটন</li>
              <li>7. মিথবাস্টিং বাটন</li>
              <li>8. সার্চ বার</li>
              <li>9. ট্যুর সম্পূর্ণ</li>
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
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/image-check" 
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors font-solaiman-lipi"
              data-tour="image-check"
            >
              ছবি যাচাই
            </Link>
            <Link 
              href="/text-check" 
              className="px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors font-solaiman-lipi"
              data-tour="text-check"
            >
              লেখা যাচাই
            </Link>
            <Link 
              href="/source-search" 
              className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors font-solaiman-lipi"
              data-tour="source-search"
            >
              উৎস সন্ধান
            </Link>
            <Link 
              href="/mythbusting" 
              className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors font-solaiman-lipi"
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
          <div className="space-y-3 text-blue-800 font-solaiman-lipi">
            <p><strong>স্বয়ংক্রিয় ট্যুর:</strong> প্রথমবার সাইটে আসলে ট্যুর স্বয়ংক্রিয়ভাবে শুরু হবে</p>
            <p><strong>ম্যানুয়াল ট্যুর:</strong> উপরের "সাইট ট্যুর শুরু করুন" বাটনে ক্লিক করুন</p>
            <p><strong>নেভিগেশন:</strong> পরবর্তী/পূর্ববর্তী বাটন দিয়ে ট্যুর চালান</p>
            <p><strong>বন্ধ:</strong> ✕ আইকনে ক্লিক করে যেকোনো সময় ট্যুর বন্ধ করতে পারেন</p>
            <p><strong>হাইলাইট:</strong> প্রতিটি স্টেপে সংশ্লিষ্ট এলিমেন্ট হাইলাইট হবে</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
