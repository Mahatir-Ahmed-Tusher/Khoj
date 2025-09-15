'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ShareButtonsProps {
  title: string
  url: string
  description?: string
}

export default function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Get the current page URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : url
  const encodedUrl = encodeURIComponent(currentUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description || title)

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
    window.open(whatsappUrl, '_blank')
  }

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    window.open(linkedinUrl, '_blank', 'width=600,height=400')
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 font-tiro-bangla">
        এই পোস্ট শেয়ার করুন
      </h3>
      <div className="flex justify-center space-x-4 flex-wrap gap-2">
        <button 
          onClick={handleFacebookShare}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-tiro-bangla text-sm flex items-center space-x-2"
        >
          <Image 
            src="https://i.postimg.cc/fR2Qx7D6/image.png" 
            alt="Facebook" 
            width={20} 
            height={20}
            className="w-5 h-5"
          />
          <span>ফেসবুক</span>
        </button>
         <button 
           onClick={handleTwitterShare}
           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-tiro-bangla text-sm flex items-center space-x-2"
         >
          <Image 
            src="https://i.postimg.cc/L6VpsK74/image.png" 
            alt="X (Twitter)" 
            width={20} 
            height={20}
            className="w-5 h-5"
          />
          <span>X</span>
        </button>
        <button 
          onClick={handleWhatsAppShare}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-tiro-bangla text-sm flex items-center space-x-2"
        >
          <Image 
            src="https://i.postimg.cc/1z8hMgz4/image.png" 
            alt="WhatsApp" 
            width={20} 
            height={20}
            className="w-5 h-5"
          />
          <span>হোয়াটসঅ্যাপ</span>
        </button>
        <button 
          onClick={handleLinkedInShare}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-tiro-bangla text-sm flex items-center space-x-2"
        >
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          <span>লিঙ্কডইন</span>
        </button>
        <button 
          onClick={handleCopyLink}
          className={`px-4 py-2 rounded-lg transition-colors font-tiro-bangla text-sm ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {copied ? 'কপি হয়েছে!' : 'লিংক কপি'}
        </button>
      </div>
    </div>
  )
}
