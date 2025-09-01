import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function VideoCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-600 text-4xl">🎥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            ভিডিও যাচাই
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-solaiman-lipi">
            শীঘ্রই আসছে
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-solaiman-lipi">
            এই ফিচার সম্পর্কে
          </h2>
          <p className="text-gray-600 mb-6 font-solaiman-lipi">
            আমাদের AI সিস্টেম শীঘ্রই ভিডিও যাচাই করার ক্ষমতা অর্জন করবে। 
            আপনি যেকোনো ভিডিও আপলোড করে তার সত্যতা যাচাই করতে পারবেন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📹</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">ভিডিও আপলোড</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">যেকোনো ভিডিও আপলোড করুন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🎬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">ফ্রেম বিশ্লেষণ</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">প্রতিটি ফ্রেম বিশ্লেষণ করে</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-solaiman-lipi">সত্যতা রিপোর্ট</h3>
              <p className="text-sm text-gray-600 font-solaiman-lipi">বিস্তারিত সত্যতা রিপোর্ট পান</p>
            </div>
          </div>
        </div>
        
        <Link 
          href="/"
          className="btn-primary inline-flex items-center"
        >
          ← মূল পৃষ্ঠায় ফিরে যান
        </Link>
      </div>
      
      <Footer />
    </div>
  )
}
