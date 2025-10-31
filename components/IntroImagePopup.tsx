'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface IntroImagePopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function IntroImagePopup({ isOpen, onClose }: IntroImagePopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [introImgUrl, setIntroImgUrl] = useState<string>('/Khoj-intro.png')

  const handleClose = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }
    setIsVisible(false)
    setCountdown(3)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setCountdown(3)
      // Show local immediately to avoid blank, then try external and swap in on success
      setIntroImgUrl('/Khoj-intro.png')
      const ext = 'https://i.postimg.cc/zBynrwH6/Khoj-intro.png'
      const img = new window.Image()
      let finished = false
      const t = window.setTimeout(() => {
        if (!finished) {
          finished = true
        }
      }, 2000)
      img.onload = () => {
        if (!finished) {
          finished = true
          window.clearTimeout(t)
          setIntroImgUrl(ext)
        }
      }
      img.onerror = () => {
        if (!finished) {
          finished = true
          window.clearTimeout(t)
          setIntroImgUrl('/Khoj-intro.png')
        }
      }
      img.src = ext
      
      // Countdown timer
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      // Auto-close after 3 seconds
      timeoutRef.current = setTimeout(() => {
        handleClose()
      }, 3000)
    } else {
      setIsVisible(false)
      setCountdown(3)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      setIntroImgUrl('/Khoj-intro.png')
    }
  }, [isOpen, handleClose])

  if (!isOpen || !isVisible) return null

  return (
    <>
      {/* Overlay with blur effect */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md z-[9999] transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Image Popup */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-8">
        <div 
          className="relative w-[85vw] md:w-[50vw] max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button with Countdown */}
          <div className="absolute -top-6 md:-top-8 right-0 flex flex-col items-end gap-1 z-10">
            {/* Countdown */}
            {countdown > 0 && (
              <div className="bg-gray-800 bg-opacity-75 text-white px-2 py-1 rounded-full text-xs md:text-sm font-bold font-mono">
                {countdown}
              </div>
            )}
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="bg-white rounded-full p-1.5 md:p-1 hover:bg-gray-100 transition-all duration-200 shadow-lg"
              title="Close"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-800" />
            </button>
          </div>

          {/* Image */}
          <div className="relative bg-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden">
            <Image
              src={introImgUrl}
              alt="খোঁজ পরিচিতি"
              width={600}
              height={400}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </>
  )
}

