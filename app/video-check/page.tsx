import Footer from '@/components/Footer'
import Link from 'next/link'

export default function VideoCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-600 text-4xl">🎥</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-tiro-bangla">
            ভিডিও যাচাই
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-tiro-bangla">
            শীঘ্রই আসছে
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 font-tiro-bangla">
            এই ফিচার সম্পর্কে
          </h2>
          <p className="text-gray-600 mb-6 font-tiro-bangla">
            আমাদের AI সিস্টেম শীঘ্রই ভিডিও যাচাই করার ক্ষমতা অর্জন করবে। 
            আপনি যেকোনো ভিডিও আপলোড করে তার সত্যতা যাচাই করতে পারবেন।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 text-xl">📹</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-tiro-bangla">ভিডিও আপলোড</h3>
              <p className="text-sm text-gray-600 font-tiro-bangla">যেকোনো ভিডিও আপলোড করুন</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 text-xl">🎬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-tiro-bangla">ফ্রেম বিশ্লেষণ</h3>
              <p className="text-sm text-gray-600 font-tiro-bangla">প্রতিটি ফ্রেম বিশ্লেষণ করে</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 font-tiro-bangla">সত্যতা রিপোর্ট</h3>
              <p className="text-sm text-gray-600 font-tiro-bangla">বিস্তারিত সত্যতা রিপোর্ট পান</p>
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
