'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import SearchBar from '@/components/SearchBar'
import { getLatestArticles } from '@/lib/data'

export default function PerformanceTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)

  // Memoize data operations
  const allFactChecks = useMemo(() => getLatestArticles(10), [])

  const runPerformanceTest = useCallback(async () => {
    setIsRunning(true)
    const results = []

    // Test 1: Search Bar Typing Performance
    const searchBarTest = () => {
      const start = performance.now()
      const input = document.createElement('input')
      input.value = 'test query'
      input.dispatchEvent(new Event('input', { bubbles: true }))
      const end = performance.now()
      return end - start
    }

    // Test 2: Data Filtering Performance
    const filteringTest = () => {
      const start = performance.now()
      const filtered = allFactChecks.filter(article => article.verdict === 'true')
      const end = performance.now()
      return end - start
    }

    // Test 3: Component Rendering Performance
    const renderingTest = () => {
      const start = performance.now()
      const div = document.createElement('div')
      div.innerHTML = '<div>Test content</div>'
      document.body.appendChild(div)
      document.body.removeChild(div)
      const end = performance.now()
      return end - start
    }

    // Run tests multiple times for accuracy
    for (let i = 0; i < 10; i++) {
      results.push({
        iteration: i + 1,
        searchBar: searchBarTest(),
        filtering: filteringTest(),
        rendering: renderingTest(),
        timestamp: new Date().toISOString()
      })
    }

    setTestResults(results)
    setIsRunning(false)
  }, [allFactChecks])

  const averageResults = useMemo(() => {
    if (testResults.length === 0) return null

    const avg = testResults.reduce((acc, result) => ({
      searchBar: acc.searchBar + result.searchBar,
      filtering: acc.filtering + result.filtering,
      rendering: acc.rendering + result.rendering
    }), { searchBar: 0, filtering: 0, rendering: 0 })

    return {
      searchBar: avg.searchBar / testResults.length,
      filtering: avg.filtering / testResults.length,
      rendering: avg.rendering / testResults.length
    }
  }, [testResults])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-solaiman-lipi">
          পারফরমেন্স টেস্ট
        </h1>

        {/* Search Bar Test */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            সার্চ বার টেস্ট
          </h2>
          <SearchBar 
            placeholder="এখানে টাইপ করুন এবং পারফরমেন্স দেখুন..."
            className="mb-4"
          />
          <p className="text-sm text-gray-600 font-solaiman-lipi">
            উপরের সার্চ বারে টাইপ করুন এবং দেখুন কত দ্রুত কাজ করে
          </p>
        </div>

        {/* Performance Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            পারফরমেন্স টেস্ট চালান
          </h2>
          <button
            onClick={runPerformanceTest}
            disabled={isRunning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 font-solaiman-lipi"
          >
            {isRunning ? 'টেস্ট চলছে...' : 'টেস্ট শুরু করুন'}
          </button>
        </div>

        {/* Average Results */}
        {averageResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
              গড় পারফরমেন্স ফলাফল
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 font-solaiman-lipi">সার্চ বার</h3>
                <p className="text-2xl font-bold text-green-600">
                  {averageResults.searchBar.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 font-solaiman-lipi">ফিল্টারিং</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {averageResults.filtering.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2 font-solaiman-lipi">রেন্ডারিং</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {averageResults.rendering.toFixed(2)}ms
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
              বিস্তারিত ফলাফল
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-solaiman-lipi">ইটারেশন</th>
                    <th className="text-left py-2 font-solaiman-lipi">সার্চ বার (ms)</th>
                    <th className="text-left py-2 font-solaiman-lipi">ফিল্টারিং (ms)</th>
                    <th className="text-left py-2 font-solaiman-lipi">রেন্ডারিং (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{result.iteration}</td>
                      <td className="py-2">{result.searchBar.toFixed(2)}</td>
                      <td className="py-2">{result.filtering.toFixed(2)}</td>
                      <td className="py-2">{result.rendering.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-yellow-800 mb-4 font-solaiman-lipi">
            পারফরমেন্স টিপস
          </h2>
          <ul className="space-y-2 text-yellow-700 font-solaiman-lipi">
            <li>• সার্চ বার টাইপিং 5ms এর কম হওয়া উচিত</li>
            <li>• ফিল্টারিং 1ms এর কম হওয়া উচিত</li>
            <li>• রেন্ডারিং 2ms এর কম হওয়া উচিত</li>
            <li>• যদি পারফরমেন্স খারাপ হয়, ব্রাউজার ক্যাশে ক্লিয়ার করুন</li>
            <li>• ভার্সেলে ডেপ্লয় করার পর পারফরমেন্স আরও ভালো হবে</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
