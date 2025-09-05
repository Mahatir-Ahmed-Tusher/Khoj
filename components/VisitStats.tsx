'use client'

import { useState, useEffect } from 'react'
import { visitTracker, getSafeVisitInfo, getSafeIsFirstVisit, getSafeIsNewSession } from '@/lib/visit-tracker'

interface VisitStatsProps {
  pageName?: string
  showDetails?: boolean
}

export default function VisitStats({ pageName = 'current', showDetails = false }: VisitStatsProps) {
  const [visitInfo, setVisitInfo] = useState(getSafeVisitInfo())
  const [pageVisitCount, setPageVisitCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Mark as client-side
    setIsClient(true)
    
    // Track this page visit
    if (pageName !== 'current') {
      visitTracker.trackVisit(pageName)
    }
    
    // Update visit info
    setVisitInfo(getSafeVisitInfo())
    setPageVisitCount(visitTracker.getPageVisitCount(pageName))
  }, [pageName])

  if (!showDetails) {
    return (
      <div className="text-xs text-gray-500 font-solaiman-lipi">
        {isClient ? (visitInfo.isFirstVisit ? 'প্রথম আসা' : 'পুনরায় আসা') : 'লোড হচ্ছে...'}
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border">
      <h3 className="text-lg font-bold text-gray-900 mb-3 font-solaiman-lipi">
        ভিজিট তথ্য
      </h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 font-solaiman-lipi">প্রথম আসা:</span>
          <span className={`font-medium ${isClient && visitInfo.isFirstVisit ? 'text-green-600' : 'text-gray-900'}`}>
            {isClient ? (visitInfo.isFirstVisit ? 'হ্যাঁ' : 'না') : 'লোড হচ্ছে...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 font-solaiman-lipi">নতুন সেশন:</span>
          <span className={`font-medium ${isClient && getSafeIsNewSession() ? 'text-blue-600' : 'text-gray-900'}`}>
            {isClient ? (getSafeIsNewSession() ? 'হ্যাঁ' : 'না') : 'লোড হচ্ছে...'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 font-solaiman-lipi">মোট সেশন:</span>
          <span className="font-medium text-gray-900">{visitInfo.sessionCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600 font-solaiman-lipi">এই পেজ ভিজিট:</span>
          <span className="font-medium text-gray-900">{pageVisitCount}</span>
        </div>
        
        {visitInfo.firstVisitDate && (
          <div className="flex justify-between">
            <span className="text-gray-600 font-solaiman-lipi">প্রথম আসার তারিখ:</span>
            <span className="font-medium text-gray-900">
              {new Date(visitInfo.firstVisitDate).toLocaleDateString('bn-BD')}
            </span>
          </div>
        )}
        
        {visitInfo.lastVisitDate && (
          <div className="flex justify-between">
            <span className="text-gray-600 font-solaiman-lipi">শেষ আসার তারিখ:</span>
            <span className="font-medium text-gray-900">
              {new Date(visitInfo.lastVisitDate).toLocaleDateString('bn-BD')}
            </span>
          </div>
        )}
      </div>
      
      {/* Debug Info */}
      <details className="mt-4">
        <summary className="text-xs text-gray-500 cursor-pointer font-solaiman-lipi">
          ডিবাগ তথ্য দেখুন
        </summary>
        <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
          {JSON.stringify(visitInfo, null, 2)}
        </pre>
      </details>
    </div>
  )
}
