'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { ChevronDown } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  author: string
  thumbnail: string
  excerpt: string
  tags: string[]
  publishDate: string
  readTime: string
  slug: string
}

const blogPosts: BlogPost[] = [
  {
    id: '6',
    title: 'হ্যাকেলের সেকেলে মতবাদ দিয়ে প্রজাতির বিবর্তনকে প্রশ্নবিদ্ধ করা যায়?',
    author: 'মাহাথির আহমেদ তুষার',
    thumbnail: 'https://i.postimg.cc/7LQDP7Kn/image.png',
    excerpt: 'আপনার হাতে সময় থাকলে চলুন, একটা ব্যাপার নিয়ে আলোচনা করি। ধরুন, আপনি কোয়ান্টাম মেকানিক্স নিয়ে একটা বই লিখতে চান। সেক্ষেত্রে আপনাকে প্রথমেই যে কাজটা করতে হবে—পাঠকদের এটা দেখাতে হবে যে, এই বৈজ্ঞানিক তত্ত্বটির দীর্ঘ যাত্রাপথে বিজ্ঞানীরা পরমাণুর অভ্যন্তরের ক্ষুদ্র জগতটিকে কিভাবে দেখেছেন।',
    tags: ['বিবর্তন', 'হ্যাকেল', 'ভ্রূণতত্ত্ব', 'বিজ্ঞান', 'মিথবাস্টিং'],
    publishDate: '১৭ এপ্রিল, ২০২৫',
    readTime: '১৮ মিনিট',
    slug: 'haeckel-evolution-theory-criticism'
  },
  {
    id: '5',
    title: 'অপবিজ্ঞানের যতো বই',
    author: 'মাহাথির আহমেদ তুষার',
    thumbnail: 'https://i.postimg.cc/kGM8vQvt/image.png',
    excerpt: 'চলুন আজকে সিউডোসায়েন্স প্রচার করা কিছু বইয়ের সাথে আপনাদের পরিচয় করাই, যেগুলিতে বাংলা ভাষাভাষীদের মধ্যে প্রচলিত অনেক অপবিজ্ঞানের উৎস রয়েছে৷ অপবিজ্ঞানের উৎস সন্ধান করতে এ প্রবন্ধে আমরা বেছে নিয়েছি কিছু বইকে।',
    tags: ['অপবিজ্ঞান', 'সিউডোসায়েন্স', 'বিজ্ঞান', 'বই রিভিউ', 'মিথবাস্টিং'],
    publishDate: '২ ফেব্রুয়ারি, ২০২৫',
    readTime: '১৫ মিনিট',
    slug: 'pseudoscience-books-review'
  },
  {
    id: '4',
    title: 'খোঁজ, বাংলা ভাষার প্রথম এআই-চালিত ফ্যাক্টচেকারের অভিনব যাত্রা',
    author: 'খোঁজ টিম',
    thumbnail: 'https://i.postimg.cc/FFPY2NBX/image.png',
    excerpt: 'আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের স্রোত বয়ে চলেছে। কিন্তু তার ভেতরে আসলটা কোথায়, মিথ্যাটা কোথায়, সে পার্থক্য করা কি সহজ? ফেসবুকের নিউজ ফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট, কিংবা নিউজ অ্যাপ। সব জায়গায় মিথ্যা খবর, গুজব আর অর্ধসত্য ভেসে বেড়ায়।',
    tags: ['খোঁজ', 'এআই', 'ফ্যাক্টচেকিং', 'ডিজিটাল সাক্ষরতা'],
    publishDate: '১৫ সেপ্টেম্বর, ২০২৫',
    readTime: '১২ মিনিট',
    slug: 'khoj-ai-factchecker-journey'
  },
  {
    id: '2',
    title: 'বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম হিসেবে "খোঁজ" – একটি বিস্তারিত যাচাই',
    author: 'খোঁজ টিম (মাহাথির আহমেদ তুষার, সাগর চন্দ্র দে, তানিয়া চৈতি)',
    thumbnail: 'https://i.postimg.cc/jd1mpLff/Khoj-banner.png',
    excerpt: 'খোঁজ টিম হিসেবে আমরা বাংলাদেশের ডিজিটাল ল্যান্ডস্কেপে মিথ্যা তথ্যের বিরুদ্ধে লড়াই করার জন্য প্রতিশ্রুতিবদ্ধ। বাংলা ভাষায় কনটেন্টের দ্রুত বৃদ্ধির সাথে সাথে, মিসইনফরমেশনও বাড়ছে – বিশেষ করে সোশ্যাল মিডিয়া, নিউজ পোর্টাল এবং ভাইরাল পোস্টগুলোতে।',
    tags: ['খোঁজ', 'এআই', 'ফ্যাক্টচেকিং', 'যাচাই', 'বাংলা ভাষা', 'মিথ্যা তথ্য প্রতিরোধ', 'ওপেন সোর্স'],
    publishDate: '৫ সেপ্টেম্বর, ২০২৫',
    readTime: '১২ মিনিট',
    slug: 'khoj-ai-factchecker-verification'
  },
  {
    id: '3',
    title: 'জলবায়ু পরিবর্তন: বৈজ্ঞানিক তথ্য বনাম ভুল ধারণা',
    author: 'সালেহা ভুইয়া',
    thumbnail: 'https://i.postimg.cc/zGV717ND/Your-paragraph-text-5.png',
    excerpt: 'জলবায়ু পরিবর্তন শুধু বৈজ্ঞানিক ইস্যু নয়—এটি একসাথে রাজনৈতিক, অর্থনৈতিক, সামাজিক ও নৈতিক ইস্যু। পৃথিবীর প্রতিটি মানুষের জীবনে এর প্রভাব রয়েছে, অথচ এখনো অনেকেই একে অবহেলা করে বা ভুল বোঝে।',
    tags: ['জলবায়ু পরিবর্তন', 'পরিবেশ', 'বিজ্ঞান', 'ভুল ধারণা'],
    publishDate: '৫ আগস্ট, ২০২৫',
    readTime: '১০ মিনিট',
    slug: 'climate-change-science-vs-misconceptions'
  },
  {
    id: '1',
    title: 'সামাজিক মাধ্যমের ভুয়া খবর: চিহ্নিতকরণের কৌশল',
    author: 'ড. মাজেদুল ইসলাম',
    thumbnail: 'https://i.postimg.cc/3xZHG36b/image.png',
    excerpt: 'ইন্টারনেটে গুজব বা মিথ্যা তথ্য একেবারেই নতুন কিছু নয়। আগে থেকেই এগুলো ছিল, তবে আজকের ডিজিটাল বিস্তার সেগুলোকে আরও দ্রুত ও ব্যাপক করে তুলেছে। এই লেখার উদ্দেশ্য হলো—গুরুত্বপূর্ণ বা সিরিয়াস কনটেন্টের আড়ালে লুকানো বিভ্রান্তিকর তথ্য কীভাবে ধরা যায়, সে বিষয়ে কিছু কার্যকরী কৌশল তুলে ধরা।',
    tags: ['ফ্যাক্টচেকিং', 'ডিজিটাল সাক্ষরতা', 'ভুয়া খবর', 'সামাজিক মাধ্যম'],
    publishDate: '১০ ডিসেম্বর, ২০২৪',
    readTime: '৭ মিনিট',
    slug: 'social-media-fake-news-identification'
  }
]

// Function to parse Bengali date and convert to sortable format
const parseBengaliDate = (dateStr: string): Date => {
  // Convert Bengali date to JavaScript Date
  const dateMap: { [key: string]: string } = {
    'জানুয়ারি': 'January',
    'ফেব্রুয়ারি': 'February', 
    'মার্চ': 'March',
    'এপ্রিল': 'April',
    'মে': 'May',
    'জুন': 'June',
    'জুলাই': 'July',
    'আগস্ট': 'August',
    'সেপ্টেম্বর': 'September',
    'অক্টোবর': 'October',
    'নভেম্বর': 'November',
    'ডিসেম্বর': 'December'
  }
  
  // Convert Bengali numbers to English
  const bengaliToEnglish: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  }
  
  // Extract day, month, year from Bengali date
  // Remove comma if present
  const cleanDateStr = dateStr.replace(',', '')
  const parts = cleanDateStr.split(' ')
  const day = parts[0].split('').map(char => bengaliToEnglish[char] || char).join('')
  const month = dateMap[parts[1]]
  const year = parts[2].split('').map(char => bengaliToEnglish[char] || char).join('')
  
  // Debug: Log the parsed date
  console.log(`Parsing: ${dateStr} -> ${month} ${day}, ${year}`)
  
  return new Date(`${month} ${day}, ${year}`)
}

// Sort blog posts by date (most recent first)
const sortedBlogPosts = blogPosts
  .sort((a, b) => parseBengaliDate(b.publishDate).getTime() - parseBengaliDate(a.publishDate).getTime())

export default function BlogPage() {
  const [selectedTag, setSelectedTag] = useState<string>('সব')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Get all unique tags
  const allTags = ['সব', ...Array.from(new Set(sortedBlogPosts.flatMap(post => post.tags)))]

  // Filter posts based on selected tag and search query
  const filteredPosts = sortedBlogPosts.filter(post => {
    const matchesTag = selectedTag === 'সব' || post.tags.includes(selectedTag)
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 font-tiro-bangla mb-4">
              ব্লগ
            </h1>
            <p className="text-lg text-gray-600 font-tiro-bangla max-w-3xl mx-auto">
              ফ্যাক্টচেকিং, মুক্তিযুদ্ধের ইতিহাস, জলবায়ু পরিবর্তন এবং অন্যান্য গুরুত্বপূর্ণ বিষয়ে সঠিক তথ্য ও বিশ্লেষণ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full md:w-96">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ব্লগ খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-tiro-bangla"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tag Filter */}
            <div className="flex flex-wrap gap-2">
              {/* Desktop Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-tiro-bangla"
                >
                  <span>{selectedTag}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setSelectedTag(tag)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-tiro-bangla transition-colors ${
                          selectedTag === tag
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Thumbnail */}
              <div className="relative h-48 w-full">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium font-tiro-bangla">
                    {post.readTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium font-tiro-bangla"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3 font-tiro-bangla line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 font-tiro-bangla line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Author and Date */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-tiro-bangla">
                      {post.author}
                    </p>
                    <p className="text-xs text-gray-500 font-tiro-bangla">
                      {post.publishDate}
                    </p>
                  </div>
                </div>

                {/* Read More Button */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium font-tiro-bangla transition-colors"
                >
                  আরও পড়ুন
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 font-tiro-bangla">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709" />
              </svg>
              <p className="text-lg">কোন ব্লগ পোস্ট পাওয়া যায়নি</p>
              <p className="text-sm mt-2">অনুগ্রহ করে আপনার অনুসন্ধান শব্দ বা ফিল্টার পরিবর্তন করুন</p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}
