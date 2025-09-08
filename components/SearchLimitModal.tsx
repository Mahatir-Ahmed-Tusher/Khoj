'use client'

import { useState } from 'react'
import { X, LogIn, Search } from 'lucide-react'

interface SearchLimitModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
  remainingSearches: number
}

export default function SearchLimitModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  remainingSearches 
}: SearchLimitModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <Search className="h-8 w-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 font-tiro-bangla">
            সার্চ সীমা শেষ!
          </h3>
          
          <p className="text-gray-600 mb-6 font-tiro-bangla leading-relaxed">
            আপনার {remainingSearches === 0 ? '৩টি' : remainingSearches} সার্চ শেষ হয়ে গেছে। 
            <br />
            <span className="font-semibold text-primary-600">অনুগ্রহ করে লগ ইন করুন এবং চালিয়ে যান আপনার সত্যান্বেষণ।</span>
          </p>

          <div className="space-y-3">
            <button
              onClick={onLogin}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium font-tiro-bangla flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Google দিয়ে লগ ইন করুন</span>
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium font-tiro-bangla"
            >
              পরে করব
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-tiro-bangla">
              <strong>লগ ইন করার সুবিধা:</strong>
              <br />
              • অসীম সার্চ
              <br />
              • সার্চ হিস্টরি সংরক্ষণ
              <br />
              • ব্যক্তিগত ড্যাশবোর্ড
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
