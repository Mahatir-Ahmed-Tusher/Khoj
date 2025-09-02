'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { BookOpen, Download, Star, Calendar, User } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  rating: number
  publishedYear: number
  category: string
  downloadLink: string
  coverImage: string
  review: string
}

const dummyBooks: Book[] = [
  {
    id: '1',
    title: 'বাংলাদেশের মুক্তিযুদ্ধের ইতিহাস',
    author: 'ড. মুনতাসীর মামুন',
    description: '১৯৭১ সালের মুক্তিযুদ্ধের বিস্তারিত ইতিহাস ও বিশ্লেষণ',
    rating: 4.8,
    publishedYear: 2020,
    category: 'ইতিহাস',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'একটি অসাধারণ গ্রন্থ যা মুক্তিযুদ্ধের প্রতিটি দিক তুলে ধরেছে। লেখক তার গবেষণার মাধ্যমে নতুন তথ্য উপস্থাপন করেছেন।'
  },
  {
    id: '2',
    title: 'ফ্যাক্টচেকিং হ্যান্ডবুক',
    author: 'খোঁজ টিম',
    description: 'সঠিক তথ্য যাচাই করার পদ্ধতি ও কৌশল',
    rating: 4.6,
    publishedYear: 2024,
    category: 'শিক্ষামূলক',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'তথ্য যাচাই করার জন্য একটি প্র্যাকটিক্যাল গাইড। প্রতিটি অধ্যায়ে উদাহরণসহ ব্যাখ্যা করা হয়েছে।'
  },
  {
    id: '3',
    title: 'ডিজিটাল সাক্ষরতা',
    author: 'আহমেদ রফিক',
    description: 'ডিজিটাল যুগে সঠিক তথ্য চেনার উপায়',
    rating: 4.5,
    publishedYear: 2023,
    category: 'প্রযুক্তি',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'আধুনিক যুগের চ্যালেঞ্জ মোকাবেলায় একটি গুরুত্বপূর্ণ বই। লেখক সহজ ভাষায় জটিল বিষয়গুলো বুঝিয়েছেন।'
  },
  {
    id: '4',
    title: 'বৈজ্ঞানিক পদ্ধতি',
    author: 'ড. আনিসুর রহমান',
    description: 'বৈজ্ঞানিক গবেষণা ও বিশ্লেষণের পদ্ধতি',
    rating: 4.7,
    publishedYear: 2022,
    category: 'বিজ্ঞান',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'বৈজ্ঞানিক চিন্তার বিকাশে একটি মূল্যবান বই। প্রতিটি ধাপে উদাহরণ দেওয়া হয়েছে।'
  },
  {
    id: '5',
    title: 'মিডিয়া সাক্ষরতা',
    author: 'সাবরিনা সুলতানা',
    description: 'মিডিয়ার তথ্য বিশ্লেষণ ও যাচাই',
    rating: 4.4,
    publishedYear: 2024,
    category: 'মিডিয়া',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'মিডিয়া থেকে পাওয়া তথ্য যাচাই করার জন্য একটি প্রয়োজনীয় বই। বর্তমান সময়ের জন্য খুবই প্রাসঙ্গিক।'
  },
  {
    id: '6',
    title: 'সাইবার নিরাপত্তা গাইড',
    author: 'মাহমুদুল হাসান',
    description: 'অনলাইন নিরাপত্তা ও তথ্য সুরক্ষা',
    rating: 4.3,
    publishedYear: 2023,
    category: 'নিরাপত্তা',
    downloadLink: '#',
    coverImage: '/khoj.png',
    review: 'ডিজিটাল নিরাপত্তার জন্য একটি প্র্যাকটিক্যাল গাইড। প্রতিটি অধ্যায়ে প্রয়োজনীয় টিপস দেওয়া হয়েছে।'
  }
]

export default function ELibraryPage() {
  const categories = ['সব', 'ইতিহাস', 'শিক্ষামূলক', 'প্রযুক্তি', 'বিজ্ঞান', 'মিডিয়া', 'নিরাপত্তা']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900 font-solaiman-lipi">
              ই-গ্রন্থ সম্ভার
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-solaiman-lipi">
            বই পর্যালোচনা, ডাউনলোড লিংক ও শিক্ষামূলক রিসোর্স
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all font-solaiman-lipi hover:bg-green-100 text-gray-700"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300">
              {/* Book Cover */}
              <div className="relative h-48 bg-gradient-to-br from-green-400 to-blue-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-80" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-solaiman-lipi line-clamp-2">
                  {book.title}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-solaiman-lipi">
                    {book.author}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 font-solaiman-lipi">
                  {book.description}
                </p>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(book.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-solaiman-lipi">
                    {book.rating}
                  </span>
                </div>

                {/* Published Year */}
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-solaiman-lipi">
                    {book.publishedYear}
                  </span>
                </div>

                {/* Review */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 font-solaiman-lipi">
                    পর্যালোচনা
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 font-solaiman-lipi">
                    {book.review}
                  </p>
                </div>

                {/* Download Button */}
                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 font-solaiman-lipi">
                  <Download className="h-5 w-5" />
                  <span>ডাউনলোড করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              আরও বই আসছে
            </h3>
            <p className="text-gray-600 mb-6 font-solaiman-lipi">
              আমরা নিয়মিত নতুন বই যোগ করছি। আপনার প্রিয় বইয়ের পর্যালোচনা পড়তে থাকুন।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                নতুন প্রকাশনা
              </span>
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                বেস্টসেলার
              </span>
              <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                শিক্ষামূলক
              </span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 font-solaiman-lipi">
            এই লাইব্রেরি সম্পর্কে
          </h3>
          <p className="text-gray-700 font-solaiman-lipi leading-relaxed">
            আমাদের ই-গ্রন্থ সম্ভারে আপনি পাবেন বিভিন্ন বিষয়ের উপর লেখা বইয়ের পর্যালোচনা, 
            ডাউনলোড লিংক এবং শিক্ষামূলক রিসোর্স। আমরা নিয়মিত নতুন বই যোগ করছি যাতে 
            পাঠকরা সঠিক তথ্য পেতে পারেন।
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
