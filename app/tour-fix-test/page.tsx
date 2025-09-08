'use client'

import { useState, useEffect } from 'react'
import Footer from '@/components/Footer'
import SiteTour from '@/components/SiteTour'
import MobileTourTrigger from '@/components/MobileTourTrigger'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

export default function TourFixTest() {
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
      {/* Site Tour */}
      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Tour completed!')
          setShowTour(false)
        }}
      />
      
      {/* Mobile Tour Trigger */}
      <MobileTourTrigger />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            ট্যুর ফিক্স টেস্ট 📱
          </h1>
          <p className="text-gray-600 font-tiro-bangla mb-6">
            এই পেজে ট্যুর ফিক্সগুলো টেস্ট করতে পারবেন
          </p>
          
          {isMobile ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-tiro-bangla font-medium">✅ মোবাইল ডিভাইস</p>
              <p className="text-sm font-tiro-bangla">নিচের ফ্লোটিং বাটনে ক্লিক করে ট্যুর শুরু করুন</p>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-tiro-bangla font-medium">⚠️ ডেস্কটপ ডিভাইস</p>
              <p className="text-sm font-tiro-bangla">ট্যুর শুধুমাত্র মোবাইল ডিভাইসে দেখানো হবে</p>
            </div>
          )}
        </div>

        {/* Hero Section for Testing */}
        <div className="hero-section bg-blue-600 text-white p-8 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4 font-tiro-bangla">হিরো সেকশন টেস্ট</h2>
          <p className="mb-6 font-tiro-bangla">এই সেকশনে ফিচার বাটনগুলো আছে</p>
          
          <SearchBar 
            placeholder="এখানে কিছু লিখুন..."
            data-tour="search-bar"
          />
          
          <div className="flex flex-wrap gap-4 mt-6">
            <Link 
              href="/image-check" 
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-tiro-bangla"
              data-tour="image-check"
            >
              AI ছবি যাচাই
            </Link>
            <Link 
              href="/text-check" 
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-tiro-bangla"
              data-tour="text-check"
            >
              লেখা যাচাই
            </Link>
            <Link 
              href="/source-search" 
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-tiro-bangla"
              data-tour="source-search"
            >
              উৎস সন্ধান
            </Link>
            <Link 
              href="/mythbusting" 
              className="mythbusting-button px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-tiro-bangla"
              data-tour="mythbusting"
            >
              মিথবাস্টিং
            </Link>
          </div>
          
          {/* Special Note for Image and Text Check */}
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-tiro-bangla">
              <strong>নোট:</strong> ট্যুর সিস্টেম এখন প্রথম ভিজিটরদের জন্য ফিরিয়ে আনা হয়েছে। ট্যুর বাটন নেই, কিন্তু ট্যুর শুধুমাত্র প্রথম ভিজিটরদের জন্য অটো-স্টার্ট হবে এবং একবার দেখার পর আর দেখানো হবে না। ট্যুর বক্সের ক্রস আইকন এখন ছোট এবং সিম্পল - শুধু লাল ক্রস, কোনো শ্যাডো বা ফিল আপ নেই।
            </p>
          </div>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-tiro-bangla">
              ফিক্স করা সমস্যা
            </h2>
            <ul className="space-y-2 text-gray-700 font-tiro-bangla text-sm">
              <li>✅ ছবি যাচাই বাটনের টুলটিপ স্ক্রিনের বাইরে যাওয়া</li>
              <li>✅ লেখা যাচাই বাটনের টুলটিপ স্ক্রিনের বাইরে যাওয়া</li>
              <li>✅ সাইডবারকে মিথবাস্টিং বাটন হিসেবে চিহ্নিত করা</li>
              <li>✅ মিথবাস্টিং টুলটিপ টগল বাটনের কাছে যাওয়া</li>
              <li>✅ হ্যামবার্গার মেনুর টুলটিপ নিচে সরানো</li>
              <li>✅ প্রথম ট্যুরের জন্য অটো-স্টার্ট চালু</li>
              <li>✅ ট্যুর সিস্টেম প্রথম ভিজিটরদের জন্য ফিরিয়ে আনা</li>
              <li>✅ ট্যুর বাটন ছাড়াই অটো-স্টার্ট</li>
              <li>✅ ট্যুর শুধুমাত্র একবারই দেখানো</li>
              <li>✅ ট্যুর বক্সের ক্রস আইকন আরও ছোট করা</li>
              <li>✅ ক্রস আইকন থেকে শ্যাডো এবং ফিল আপ রিমুভ</li>
              <li>✅ শুধু লাল ক্রস রাখা</li>
              <li>✅ উৎস সন্ধান টুলটিপ বাটনের পেছনে যাওয়া</li>
              <li>✅ লেখা যাচাই টুলটিপ ডান দিকে সরানো</li>
              <li>✅ টগল বাটনের টুলটিপ নিচে ডান দিকে সরানো (লাল মার্ক করা জায়গায়)</li>
              <li>✅ অটো-স্টার্ট ট্যুর বন্ধ করা</li>
              <li>✅ টুলটিপ সাইজ ছোট করা</li>
              <li>✅ স্ক্রিন বাউন্ডারি চেক করা</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4 font-tiro-bangla">
              উন্নতি
            </h2>
            <ul className="space-y-2 text-gray-700 font-tiro-bangla text-sm">
              <li>✅ ছোট টুলটিপ (240px x 90px)</li>
              <li>✅ স্মার্ট পজিশনিং</li>
              <li>✅ সঠিক টার্গেট সিলেক্টর</li>
              <li>✅ মিথবাস্টিং বাটনের জন্য বিশেষ ক্লাস</li>
              <li>✅ হ্যামবার্গার মেনুর জন্য নিচের পজিশন</li>
              <li>✅ প্রথম ট্যুরের জন্য অটো-স্টার্ট</li>
              <li>✅ ট্যুর সিস্টেম প্রথম ভিজিটরদের জন্য ফিরিয়ে আনা</li>
              <li>✅ ট্যুর বাটন ছাড়াই অটো-স্টার্ট</li>
              <li>✅ ট্যুর শুধুমাত্র একবারই দেখানো</li>
              <li>✅ ট্যুর বক্সের ক্রস আইকন ছোট এবং সিম্পল</li>
              <li>✅ শুধু লাল ক্রস, কোনো শ্যাডো বা ফিল আপ নেই</li>
              <li>✅ ছবি যাচাই এবং লেখা যাচাইয়ের জন্য ডান পজিশন</li>
              <li>✅ টগল বাটনের জন্য নিচে ডান পজিশন (লাল মার্ক করা জায়গায়)</li>
              <li>✅ ম্যানুয়াল ট্যুর ট্রিগার</li>
              <li>✅ উচ্চ z-index (z-60) বাটনের উপরে</li>
              <li>✅ স্ক্রিন মার্জিন (20px)</li>
              <li>✅ অটো পজিশন অ্যাডজাস্ট</li>
              <li>✅ ডিবাগ লগিং</li>
            </ul>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-blue-900 mb-4 font-tiro-bangla">
            টেস্ট করার উপায়
          </h2>
          <div className="space-y-3 text-blue-800 font-tiro-bangla text-sm">
            <p><strong>মোবাইল ডিভাইস:</strong> নিচের ডানদিকের ফ্লোটিং বাটনে ক্লিক করুন</p>
            <p><strong>ট্যুর স্টেপ:</strong> প্রতিটি স্টেপে টুলটিপ স্ক্রিনের মধ্যে আছে কিনা দেখুন</p>
            <p><strong>টার্গেটিং:</strong> সঠিক এলিমেন্ট হাইলাইট হচ্ছে কিনা দেখুন</p>
            <p><strong>পজিশনিং:</strong> টুলটিপ স্ক্রিনের বাইরে যাচ্ছে কিনা দেখুন</p>
            <p><strong>সাইজ:</strong> টুলটিপ খুব বড় হচ্ছে কিনা দেখুন</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
