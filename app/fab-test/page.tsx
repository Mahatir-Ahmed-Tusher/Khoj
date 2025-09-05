'use client'

import { useState, useEffect } from 'react'
import FeatureWidget from '@/components/FeatureWidget'

export default function FABTestPage() {
  const [screenSize, setScreenSize] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setScreenSize(`${width}px`)
      setIsMobile(width < 1024) // lg breakpoint
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-solaiman-lipi">
          FAB Visibility Test
        </h1>

        {/* Screen Size Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            Current Screen Size
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 font-solaiman-lipi">Screen Width</h3>
              <p className="text-2xl font-bold text-blue-600">{screenSize}</p>
            </div>
            <div className={`p-4 rounded-lg ${isMobile ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className={`font-semibold mb-2 font-solaiman-lipi ${isMobile ? 'text-green-800' : 'text-red-800'}`}>
                FAB Visibility
              </h3>
              <p className={`text-2xl font-bold ${isMobile ? 'text-green-600' : 'text-red-600'}`}>
                {isMobile ? 'Visible ✅' : 'Hidden ❌'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4 font-solaiman-lipi">
            Test Instructions
          </h2>
          <ul className="space-y-2 text-yellow-700 font-solaiman-lipi">
            <li>• <strong>Desktop (≥1024px):</strong> FAB should be HIDDEN ❌</li>
            <li>• <strong>Mobile (<1024px):</strong> FAB should be VISIBLE ✅</li>
            <li>• <strong>Resize window:</strong> Change browser width to test responsiveness</li>
            <li>• <strong>Check bottom-right:</strong> Look for orange floating button</li>
          </ul>
        </div>

        {/* Breakpoint Guide */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            Tailwind Breakpoints
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-solaiman-lipi">Breakpoint</th>
                  <th className="text-left py-2 font-solaiman-lipi">Min Width</th>
                  <th className="text-left py-2 font-solaiman-lipi">FAB Status</th>
                  <th className="text-left py-2 font-solaiman-lipi">CSS Class</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">sm</td>
                  <td className="py-2">640px</td>
                  <td className="py-2 text-green-600">Visible ✅</td>
                  <td className="py-2 font-mono text-xs">lg:hidden</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">md</td>
                  <td className="py-2">768px</td>
                  <td className="py-2 text-green-600">Visible ✅</td>
                  <td className="py-2 font-mono text-xs">lg:hidden</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">lg</td>
                  <td className="py-2">1024px</td>
                  <td className="py-2 text-red-600">Hidden ❌</td>
                  <td className="py-2 font-mono text-xs">lg:hidden</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">xl</td>
                  <td className="py-2">1280px</td>
                  <td className="py-2 text-red-600">Hidden ❌</td>
                  <td className="py-2 font-mono text-xs">lg:hidden</td>
                </tr>
                <tr>
                  <td className="py-2">2xl</td>
                  <td className="py-2">1536px</td>
                  <td className="py-2 text-red-600">Hidden ❌</td>
                  <td className="py-2 font-mono text-xs">lg:hidden</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Feature Widget - This contains the mobile FAB */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            Feature Widget (Contains Mobile FAB)
          </h2>
          <p className="text-gray-600 mb-4 font-solaiman-lipi">
            The FeatureWidget component contains the mobile-only FAB with searching.png icon and light blue glow effect. It should only be visible on screens smaller than 1024px.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold text-blue-800 mb-2 font-solaiman-lipi">Expanded FAB Features:</h3>
            <ul className="text-sm text-blue-700 space-y-1 font-solaiman-lipi">
              <li>• <strong>Expanded UI:</strong> Like screenshot - no modal</li>
              <li>• <strong>Three Options:</strong> Mukti Corner, Mythbusting, E-Library</li>
              <li>• <strong>Icons:</strong> Custom logos for Mukti & Mythbusting</li>
              <li>• <strong>Animation:</strong> Slide-in animation with delay</li>
              <li>• <strong>Close Button:</strong> FAB becomes X when expanded</li>
              <li>• <strong>No Background:</strong> Clean floating design</li>
            </ul>
          </div>
          <FeatureWidget />
        </div>

        {/* Test Results */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4 font-solaiman-lipi">
            Expected Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 font-solaiman-lipi">Desktop (≥1024px)</h3>
              <ul className="text-sm text-gray-600 space-y-1 font-solaiman-lipi">
                <li>• No FAB in bottom-right corner</li>
                <li>• Clean desktop interface</li>
                <li>• All features accessible via navbar</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 font-solaiman-lipi">Mobile (&lt;1024px)</h3>
              <ul className="text-sm text-gray-600 space-y-1 font-solaiman-lipi">
                <li>• Blue FAB with searching.png icon</li>
                <li>• Click to expand three options</li>
                <li>• Mukti Corner, Mythbusting, E-Library</li>
                <li>• Slide-in animation with delay</li>
                <li>• FAB becomes red X when expanded</li>
                <li>• No modal - clean floating design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
