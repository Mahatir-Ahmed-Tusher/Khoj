'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, Image, FileText, BookOpen, History } from 'lucide-react'

export default function PromotionalWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const features = [
    {
      title: 'ফ্যাক্টচেক সমূহ',
      description: 'যাচাইকৃত দাবি এবং তথ্যের সম্পূর্ণ তালিকা',
      icon: <Search className="w-5 h-5" />,
      href: '/factchecks',
      color: 'bg-blue-500'
    },
    {
      title: 'মিথবাস্টিং',
      description: 'বৈজ্ঞানিক দাবি ও কুসংস্কার যাচাই করুন',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/mythbusting',
      color: 'bg-purple-500'
    },
    {
      title: 'ছবি যাচাই',
      description: 'ছবি এবং ভিডিও যাচাই করুন',
      icon: <Image className="w-5 h-5" />,
      href: '/image-check',
      color: 'bg-green-500'
    },
    {
      title: 'লেখা যাচাই',
      description: 'টেক্সট এবং দাবি যাচাই করুন',
      icon: <FileText className="w-5 h-5" />,
      href: '/text-check',
      color: 'bg-orange-500'
    },
    {
      title: 'উৎস সন্ধান',
      description: 'বিশ্বাসযোগ্য উৎস খুঁজে বের করুন',
      icon: <Search className="w-5 h-5" />,
      href: '/source-search',
      color: 'bg-red-500'
    },
    {
      title: 'মুক্তিযুদ্ধ কর্নার',
      description: '১৯৭১ সালের মুক্তিযুদ্ধ সম্পর্কে প্রশ্ন করুন',
      icon: <History className="w-5 h-5" />,
      href: '/mukti-corner',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <>
      {/* Desktop Widget */}
      <div className="hidden lg:block bg-white rounded-lg shadow-md p-4 sticky top-4 max-h-[500px] overflow-hidden">
        <h3 className="text-base font-semibold text-gray-900 mb-3 font-solaiman-lipi">
          আরও অন্বেষণ করুন
        </h3>
        <p className="text-xs text-gray-600 mb-4 font-solaiman-lipi">
          খোঁজের অন্যান্য বৈশিষ্ট্যগুলি ব্যবহার করে আরও জানুন
        </p>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {features.map((feature, index) => (
            <Link 
              key={index}
              href={feature.href}
              className="block group"
            >
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group-hover:shadow-sm">
                <div className={`p-1.5 rounded-lg text-white ${feature.color}`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors font-solaiman-lipi text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-gray-500 font-solaiman-lipi line-clamp-1">
                    {feature.description}
                  </p>
                </div>
                <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-20 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          <ChevronRight 
            className={`w-6 h-6 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Mobile Collapsible Sidebar */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 font-solaiman-lipi">
              আরও অন্বেষণ করুন
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-xs text-gray-600 mb-4 font-solaiman-lipi">
              খোঁজের অন্যান্য বৈশিষ্ট্যগুলি ব্যবহার করে আরও জানুন
            </p>
            
            <div className="space-y-2">
              {features.map((feature, index) => (
                <Link 
                  key={index}
                  href={feature.href}
                  className="block group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group-hover:shadow-sm">
                    <div className={`p-1.5 rounded-lg text-white ${feature.color}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors font-solaiman-lipi text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-solaiman-lipi line-clamp-1">
                        {feature.description}
                      </p>
                    </div>
                    <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-primary-600 transition-colors flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
