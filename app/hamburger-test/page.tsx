'use client'

import { useState, useEffect } from 'react'

export default function HamburgerTestPage() {
  const [screenSize, setScreenSize] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      setScreenSize(`${width}px`)
      setIsMobile(width < 768) // md breakpoint
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)

    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-solaiman-lipi">
            হ্যামবার্গার মেনু Visibility Test
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
                  Hamburger Menu
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
              <li>• <strong>Desktop (≥768px):</strong> হ্যামবার্গার মেনু HIDDEN ❌</li>
              <li>• <strong>Mobile (&lt;768px):</strong> হ্যামবার্গার মেনু VISIBLE ✅</li>
              <li>• <strong>Desktop Navigation:</strong> পূর্ণ মেনু navbar-এ দেখাবে</li>
              <li>• <strong>Mobile Navigation:</strong> হ্যামবার্গার মেনু দিয়ে অ্যাক্সেস</li>
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
                    <th className="text-left py-2 font-solaiman-lipi">Hamburger Status</th>
                    <th className="text-left py-2 font-solaiman-lipi">CSS Class</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">sm</td>
                    <td className="py-2">640px</td>
                    <td className="py-2 text-green-600">Visible ✅</td>
                    <td className="py-2 font-mono text-xs">md:hidden</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">md</td>
                    <td className="py-2">768px</td>
                    <td className="py-2 text-red-600">Hidden ❌</td>
                    <td className="py-2 font-mono text-xs">md:hidden</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">lg</td>
                    <td className="py-2">1024px</td>
                    <td className="py-2 text-red-600">Hidden ❌</td>
                    <td className="py-2 font-mono text-xs">md:hidden</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">xl</td>
                    <td className="py-2">1280px</td>
                    <td className="py-2 text-red-600">Hidden ❌</td>
                    <td className="py-2 font-mono text-xs">md:hidden</td>
                  </tr>
                  <tr>
                    <td className="py-2">2xl</td>
                    <td className="py-2">1536px</td>
                    <td className="py-2 text-red-600">Hidden ❌</td>
                    <td className="py-2 font-mono text-xs">md:hidden</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Navigation Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
              Navigation Comparison
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2 font-solaiman-lipi">Desktop (≥768px)</h3>
                <ul className="text-sm text-red-700 space-y-1 font-solaiman-lipi">
                  <li>• হ্যামবার্গার মেনু নেই ❌</li>
                  <li>• পূর্ণ navigation menu</li>
                  <li>• সব লিংক navbar-এ</li>
                  <li>• Clean desktop interface</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 font-solaiman-lipi">Mobile (&lt;768px)</h3>
                <ul className="text-sm text-green-700 space-y-1 font-solaiman-lipi">
                  <li>• হ্যামবার্গার মেনু আছে ✅</li>
                  <li>• Collapsible menu</li>
                  <li>• Space-efficient design</li>
                  <li>• Touch-friendly interface</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4 font-solaiman-lipi">
              Expected Results
            </h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 font-solaiman-lipi">Desktop Navigation</h3>
                <p className="text-sm text-gray-600 font-solaiman-lipi">
                  ডেস্কটপে হ্যামবার্গার মেনু নেই। সব navigation links সরাসরি navbar-এ দেখাবে।
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 font-solaiman-lipi">Mobile Navigation</h3>
                <p className="text-sm text-gray-600 font-solaiman-lipi">
                  মোবাইলে হ্যামবার্গার মেনু আছে যা ক্লিক করলে navigation menu খুলবে।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
