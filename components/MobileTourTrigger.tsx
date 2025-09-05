'use client'

import { useState, useEffect } from 'react'
import SiteTour from '@/components/SiteTour'

interface MobileTourTriggerProps {
  className?: string
  children?: React.ReactNode
}

export default function MobileTourTrigger({ className = '', children }: MobileTourTriggerProps) {
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

  const startTour = () => {
    setShowTour(true)
  }

  // Only show on mobile devices
  if (!isMobile) return null

  return (
    <>
      <button
        onClick={startTour}
        className={`fixed bottom-20 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 ${className}`}
        title="মোবাইল ট্যুর"
      >
        {children || (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>

      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Mobile tour completed!')
          setShowTour(false)
        }}
      />
    </>
  )
}
