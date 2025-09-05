import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 font-solaiman-lipi">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg text-gray-600 font-solaiman-lipi">
            খোঁজ - AI-চালিত বাংলা ফ্যাক্টচেকিং প্ল্যাটফর্ম
          </p>
        </div>

        <div className="space-y-6">
          {/* About Khoj */}
          <section className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              খোঁজ সম্পর্কে
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 font-solaiman-lipi leading-relaxed">
              <p className="mb-4">
                আমাদের চারপাশে প্রতিদিন অসংখ্য খবর, দাবি আর তথ্য ঘুরে বেড়ায়। এর ভিড়ে কোনটা সত্য আর কোনটা মিথ্যা, তা বুঝে ওঠা আজ অনেক কঠিন। ভুল তথ্যের এই স্রোত শুধু বিভ্রান্তিই ছড়ায় না, সমাজে অবিশ্বাস আর ভয়ের দেয়ালও তৈরি করে।
              </p>
              <p className="mb-4">
                খোঁজ জন্ম নিয়েছে সেই অন্ধকার কাটাতে। খোঁজ মানে শুধু তথ্য খুঁজে বের করা নয়—খোঁজ মানে সত্যের সন্ধান, নির্ভরযোগ্যতার প্রতিশ্রুতি। আমরা বিশ্বাস করি, সত্য হলো আলোর মতো; একবার তা উন্মোচিত হলে মিথ্যার ছায়া মিলিয়ে যায়।
              </p>
              <p className="mb-4">
                খোঁজের প্রতিটি যাচাই হলো আমাদের সম্মিলিত আস্থা রক্ষার প্রচেষ্টা। আমরা চাই, বাংলাভাষী মানুষেরা যেন নির্ভরযোগ্য তথ্যের ভিত্তিতে সিদ্ধান্ত নিতে পারে, প্রশ্ন তুলতে পারে, এবং একসাথে একটি সচেতন সমাজ গড়তে পারে।
              </p>
              <p className="mb-4">
                কারণ দিনের শেষে, সত্যের পাশে দাঁড়ানোই সবচেয়ে বড় দায়িত্ব—আমাদের, আপনাদের, সবার। খোঁজ সেই দায়িত্বের সাথী।
              </p>
            </div>
          </section>

          {/* How Khoj was Created */}
          <section className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              খোঁজের সৃষ্টি
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 font-solaiman-lipi leading-relaxed">
              <p className="mb-4">
                খোঁজের জন্ম হয়েছে একটি স্বপ্ন থেকে—একটি স্বপ্ন যেখানে প্রতিটি বাংলাভাষী মানুষ সঠিক তথ্যের অধিকার পাবে। আমরা দেখেছি কীভাবে ভুল তথ্য আমাদের সমাজে বিভ্রান্তি ছড়াচ্ছে, কীভাবে মানুষ বিভ্রান্ত হচ্ছে।
              </p>
              <p className="mb-4">
                তাই আমরা একসাথে কাজ শুরু করেছি। আমাদের লক্ষ্য ছিল একটি প্ল্যাটফর্ম তৈরি করা যা AI প্রযুক্তি ব্যবহার করে যেকোনো দাবি বা তথ্যের সত্যতা যাচাই করতে পারবে। আমরা বিশ্বাস করি যে প্রযুক্তি মানুষের কল্যাণে ব্যবহার করা উচিত।
              </p>
              <p className="mb-4">
                খোঁজ আজ শুধু একটি ওয়েবসাইট নয়—এটি একটি আন্দোলন। একটি আন্দোলন সত্যের পক্ষে, নির্ভরযোগ্যতার পক্ষে, এবং বাংলাভাষী মানুষের জ্ঞানের অধিকারের পক্ষে।
              </p>
            </div>
          </section>

          {/* Our Promise */}
          <section className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              আমাদের প্রতিশ্রুতি
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 font-solaiman-lipi leading-relaxed">
              <p className="mb-4">
                আমরা প্রতিশ্রুতি দিচ্ছি যে খোঁজ সবসময় সত্যের পক্ষে থাকবে। আমরা প্রতিশ্রুতি দিচ্ছি যে:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 mt-1">•</span>
                  <span>আমরা শুধুমাত্র বিশ্বাসযোগ্য উৎস থেকে তথ্য সংগ্রহ করব</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 mt-1">•</span>
                  <span>আমাদের বিশ্লেষণ হবে নিরপেক্ষ এবং যুক্তি-ভিত্তিক</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 mt-1">•</span>
                  <span>আমরা সবসময় আমাদের উৎস উল্লেখ করব</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 mt-1">•</span>
                  <span>আমরা ভুল হলে তা স্বীকার করব এবং সংশোধন করব</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-600 mr-3 mt-1">•</span>
                  <span>আমরা সবসময় বাংলাভাষী মানুষের কল্যাণে কাজ করব</span>
                </li>
              </ul>
              <p>
                আমাদের এই প্রতিশ্রুতি শুধু কথার কথা নয়—এটি আমাদের প্রতিটি কাজের ভিত্তি।
              </p>
            </div>
          </section>

          {/* Our Team */}
          <section className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              আমাদের দল
            </h2>
            <div className="text-center mb-6">
              <p className="text-gray-600 font-solaiman-lipi mb-6">
                খোঁজের পিছনে রয়েছে একটি উদ্যমী দল যারা বিশ্বাস করে যে সঠিক তথ্য একটি সুস্থ সমাজের ভিত্তি।
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary-200">
                  <img 
                    src="/assets/founders-images/mahatir.png" 
                    alt="মাহাথির আহমেদ তুষার" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-solaiman-lipi">মাহাথির আহমেদ তুষার</h3>
                <p className="text-sm text-gray-600 font-solaiman-lipi">প্রতিষ্ঠাতা</p>
                <p className="text-xs text-gray-500 mt-2 font-solaiman-lipi">
                  খোঁজের স্বপ্নদ্রষ্টা এবং মূল প্রেরণা
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary-200">
                  <img 
                    src="/assets/founders-images/sagar.png" 
                    alt="সাগর চন্দ্র দে" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-solaiman-lipi">সাগর চন্দ্র দে</h3>
                <p className="text-sm text-gray-600 font-solaiman-lipi">ফ্রন্টএন্ড ডিজাইনার ও লেখক</p>
                <p className="text-xs text-gray-500 mt-2 font-solaiman-lipi">
                  ব্যবহারকারী অভিজ্ঞতা এবং বিষয়বস্তু
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary-200">
                  <img 
                    src="/assets/founders-images/tania.png" 
                    alt="তানিয়া চৈতি" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-solaiman-lipi">তানিয়া চৈতি</h3>
                <p className="text-sm text-gray-600 font-solaiman-lipi">ডেটা সংগ্রহকারী ও গবেষক</p>
                <p className="text-xs text-gray-500 mt-2 font-solaiman-lipi">
                  তথ্য যাচাইকরণ এবং গবেষণা
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
              যোগাযোগ
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-solaiman-lipi">ইমেইল:</h3>
                <a href="mailto:sysitech1971@gmail.com" className="text-primary-600 hover:text-primary-700 font-medium font-solaiman-lipi">
                sysitech1971@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-solaiman-lipi">ঠিকানা:</h3>
                <p className="text-gray-600 font-solaiman-lipi">
                  Mirpur 12, Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}
