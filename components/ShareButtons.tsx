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
        এই নিবন্ধটি শেয়ার করুন
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
          <span>Facebook</span>
        </button>
         <button 
           onClick={handleTwitterShare}
           className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors font-tiro-bangla text-sm flex items-center space-x-2 border-2 border-black"
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
          <span>WhatsApp</span>
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
