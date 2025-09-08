import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-2">৪০৪</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">পেজ খুঁজে পাওয়া যায়নি</h2>
          <p className="text-gray-600 mb-6">
            আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            হোমপেজে ফিরুন
          </Link>
          
          <Link
            href="/factchecks"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            ফ্যাক্ট চেক দেখুন
          </Link>
          
          <Link
            href="/about"
            className="block w-full text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            আমাদের সম্পর্কে জানুন
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            যদি আপনি মনে করেন এটি একটি ত্রুটি, দয়া করে আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>
      </div>
    </div>
  )
}
