'use client'

import { useState } from 'react'
import SiteTour from '@/components/SiteTour'

interface TourTriggerProps {
  className?: string
  children?: React.ReactNode
}

export default function TourTrigger({ className = '', children }: TourTriggerProps) {
  const [showTour, setShowTour] = useState(false)

  const startTour = () => {
    setShowTour(true)
  }

  return (
    <>
      <button
        onClick={startTour}
        className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-solaiman-lipi font-medium ${className}`}
      >
        {children || (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            সাইট ট্যুর শুরু করুন
          </>
        )}
      </button>

      <SiteTour 
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        onComplete={() => {
          console.log('Site tour completed!')
          setShowTour(false)
        }}
      />
    </>
  )
}
