'use client'

export default function FontTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Font Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Tiro Bangla Font Test</h2>
          <p className="text-lg mb-4 font-tiro-bangla">
            এটি একটি বাংলা ফন্ট টেস্ট। যদি আপনি এই টেক্সটটি Tiro Bangla ফন্টে দেখতে পান, তাহলে ফন্ট সঠিকভাবে কাজ করছে।
          </p>
          <p className="text-base mb-4 font-tiro-bangla">
            বাংলা ভাষায় লেখা এই বাক্যটি দেখতে কেমন লাগছে? ফন্টটি স্পষ্ট এবং সুন্দর দেখাচ্ছে কিনা?
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Regular Class Test</h2>
          <p className="text-lg mb-4 tiro-bangla-regular">
            এটি tiro-bangla-regular ক্লাসের টেস্ট।
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Italic Class Test</h2>
          <p className="text-lg mb-4 tiro-bangla-regular-italic">
            এটি tiro-bangla-regular-italic ক্লাসের টেস্ট।
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Font Family Stack Test</h2>
          <p className="text-lg mb-4" style={{ fontFamily: "'Tiro Bangla', 'SolaimanLipi', serif" }}>
            এটি সরাসরি CSS font-family স্ট্যাকের টেস্ট।
          </p>
        </div>
      </div>
    </div>
  )
}
