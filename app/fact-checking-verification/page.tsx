import Link from 'next/link'
import { ArrowLeft, Home, CheckCircle, ExternalLink } from 'lucide-react'

export default function FactCheckingVerificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium font-solaiman-lipi">ফিরে যান</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <Home className="h-5 w-5" />
                <span className="font-medium font-solaiman-lipi">হোম</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="/khoj-logo.png" alt="খোঁজ" className="h-8 w-8" />
              <span className="text-xl font-bold text-red-600 font-solaiman-lipi">খোঁজ</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="font-solaiman-lipi">যাচাইকৃত তথ্য</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-solaiman-lipi">
            বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম হিসেবে "খোঁজ" – একটি বিস্তারিত যাচাই
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600 font-solaiman-lipi">
            <span>লেখক: খোঁজ টিম (মাহাথির আহমেদ তুষার, সাগর চন্দ্র দে, তানিয়া চৈতি)</span>
            <span>•</span>
            <span>প্রকাশ তারিখ: সেপ্টেম্বর ৫, ২০২৫</span>
            <span>•</span>
            <span>ক্যাটাগরি: টেকনোলজি এবং মিসইনফরমেশন</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">এআই</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">ফ্যাক্টচেকিং</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">বাংলা ভাষা</span>
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">মিথ্যা তথ্য প্রতিরোধ</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">ওপেন সোর্স</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi mb-6">
              খোঁজ টিম হিসেবে আমরা বাংলাদেশের ডিজিটাল ল্যান্ডস্কেপে মিথ্যা তথ্যের বিরুদ্ধে লড়াই করার জন্য প্রতিশ্রুতিবদ্ধ। বাংলা ভাষায় কনটেন্টের দ্রুত বৃদ্ধির সাথে সাথে, মিসইনফরমেশনও বাড়ছে – বিশেষ করে সোশ্যাল মিডিয়া, নিউজ পোর্টাল এবং ভাইরাল পোস্টগুলোতে। আমাদের দাবি: "খোঁজ" হলো বাংলা ভাষায় প্রথম পূর্ণাঙ্গ কৃত্রিম বুদ্ধিমত্তা (এআই)-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম। এই আর্টিকেলে আমরা এই দাবিকে বিস্তারিতভাবে যাচাই করব, প্রমাণ উপস্থাপন করব এবং দেখাব কেন আমরা এটিকে বানিয়েছি। আমরা বিভিন্ন সোর্স থেকে অনুসন্ধান চালিয়েছি, যা থেকে স্পষ্ট হয় যে বাংলা ভাষায় এমন কোনো সম্পূর্ণ এআই-চালিত প্ল্যাটফর্ম আগে ছিল না। এই যাচাইয়ের ভিত্তিতে আমরা ভার্ডিক্ট দিচ্ছি: <span className="font-bold text-green-600">সত্য (True)</span>।
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi">
              এই আর্টিকেলে আমরা বাংলা ভাষার চ্যালেঞ্জগুলো, বিদ্যমান ফ্যাক্টচেকিং ইনিশিয়েটিভসের সীমাবদ্ধতা, খোঁজের অনন্য ফিচারস এবং প্রমাণসমূহ উপস্থাপন করব। সব প্রমাণ বিশ্বাসযোগ্য সোর্স থেকে নেওয়া, এবং রেফারেন্সগুলো [১], [২] ফরম্যাটে নীচে তালিকাভুক্ত করা হবে।
            </p>
          </div>

          {/* Claim Section */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 mb-8 border border-red-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-solaiman-lipi">দাবি: খোঁজ হলো বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকার</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi mb-6">
              আমাদের দাবি স্পষ্ট: খোঁজ হলো প্রথম প্ল্যাটফর্ম যা বাংলা ভাষায় দাবি যাচাই করার জন্য এআই-কে সম্পূর্ণভাবে ব্যবহার করে, স্ট্রাকচার্ড রিপোর্ট তৈরি করে এবং মাল্টিমিডিয়া যাচাইয়ের সুবিধা দেয়। এটি ওপেন-সোর্স, ইউজার-ফ্রেন্ডলি এবং বাংলাদেশী কনটেক্সটে ডিজাইন করা। কিন্তু কেন আমরা বলছি এটি "প্রথম"? কারণ আমাদের অনুসন্ধান থেকে প্রমাণিত যে বাংলা ভাষায় এআই-ভিত্তিক ফ্যাক্টচেকিংয়ের জন্য কোনো পূর্ববর্তী পূর্ণাঙ্গ প্ল্যাটফর্ম নেই।
            </p>

            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi mb-6">
              বাংলা ভাষায় মিথ্যা তথ্যের সমস্যা গুরুতর। বাংলাদেশে সোশ্যাল মিডিয়ায় ছড়ানো রুমরগুলো প্রায়ই রাজনৈতিক অস্থিরতা বা সামাজিক বিভেদ সৃষ্টি করে। একটি গবেষণায় দেখা গেছে যে বাংলা নিউজ আর্টিকেলে ম্যানিপুলেটেড কনটেন্ট শনাক্ত করার জন্য নতুন মডেল প্রয়োজন, কিন্তু এমন কোনো প্ল্যাটফর্ম নেই যা এটি এআই দিয়ে করে [১]। অন্য একটি স্টাডিতে বাংলাদেশে ডিসইনফরমেশনের চ্যালেঞ্জস উল্লেখ করা হয়েছে, যেখানে এআই-কে অস্ত্র হিসেবে ব্যবহার করা হচ্ছে মিথ্যা কনটেন্ট তৈরিতে, কিন্তু প্রতিরোধে নয় [২]।
            </p>
          </div>

          {/* Existing Initiatives Section */}
          <div className="bg-blue-50 rounded-lg p-8 mb-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-solaiman-lipi">বিদ্যমান ফ্যাক্টচেকিং ইনিশিয়েটিভসের সীমাবদ্ধতা: কেন খোঁজ প্রয়োজনীয়</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi mb-6">
              বাংলাদেশ এবং ভারতে বিভিন্ন ফ্যাক্টচেকিং সংস্থা আছে, কিন্তু এগুলো মূলত ম্যানুয়াল – এআই-ভিত্তিক নয়। আমাদের অনুসন্ধানে ৫০টিরও বেশি সোর্স পরীক্ষা করা হয়েছে, যেখানে কীওয়ার্ড ব্যবহৃত হয়েছে: "AI-powered Bengali fact-checking platforms", "বাংলা ভাষায় এআই ভিত্তিক ফ্যাক্ট চেকিং প্ল্যাটফর্ম", এবং "existing AI based fact checker in Bengali language"। ফলাফল থেকে স্পষ্ট যে বাংলা ভাষায় কোনো পূর্ণাঙ্গ এআই-চালিত ফ্যাক্টচেকার নেই। নিম্নে কিছু উদাহরণ দেওয়া হলো:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-solaiman-lipi">ম্যানুয়াল ফ্যাক্টচেকার</h3>
                <ul className="space-y-3 text-gray-700 font-solaiman-lipi">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>BD Fact Check, Jacchai, Fact Watch: এগুলো বাংলাদেশে ২০১৭ সাল থেকে চালু, কিন্তু ম্যানুয়াল ফ্যাক্টচেকিং করে। এআই ইন্টিগ্রেশন নেই [৩]।</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Rumor Scanner: একটি অ্যাপ যা সোশ্যাল মিডিয়ায় রুমর ডিবাঙ্ক করে, কিন্তু এআই-চালিত নয় – ম্যানুয়াল ভেরিফিকেশন [৪]।</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>BOOM Fact Check: ভারতে মাল্টিলিঙ্গুয়াল (বাংলা সহ), কিন্তু মূলত হিউম্যান ফ্যাক্টচেকার দিয়ে চলে [৫]।</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 font-solaiman-lipi">আন্তর্জাতিক প্ল্যাটফর্ম</h3>
                <ul className="space-y-3 text-gray-700 font-solaiman-lipi">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>AFP Bangladesh: আন্তর্জাতিক ফ্যাক্টচেকিং, কিন্তু এআই-ভিত্তিক নয় [৬]।</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>BanglaFact (PIB): সরকারি প্ল্যাটফর্ম, কিন্তু ম্যানুয়াল [৭]।</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>Factly-এর Tagore AI: চ্যাটবট যা ভেরিফায়েড কনটেন্ট থেকে উত্তর দেয়, কিন্তু মূলত ইংরেজি এবং অন্যান্য ভারতীপ ভাষায় ফোকাসড, বাংলা-কেন্দ্রিক নয় [১০] [১১]।</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi">
              জেনারেটিভ এআই ফ্যাক্টচেকারদের সাহায্য করছে, কিন্তু ছোট ভাষা যেমন বাংলায় এর ব্যবহার সীমিত [৮] [৯]। iVerify-এর মতো টুল এআই ব্যবহার করে, কিন্তু গ্লোবাল এবং বাংলা-স্পেসিফিক নয় [১২]। Factiverse AI Editor টেক্সট ফ্যাক্টচেক করে, কিন্তু বাংলা ফোকাস নেই [১৩]।
            </p>

            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi">
              এই ফাঁকি দেখে আমরা খোঁজ বানিয়েছি – বাংলা ভাষায় এআই-কে ব্যবহার করে মিথ্যা তথ্য প্রতিরোধ করার জন্য [১৪]। বাংলা ভাষার জটিলতা (যেমন উপভাষা, সাংস্কৃতিক ন্যুয়ান্স) এবং ডেটাসেটের অভাব এই ধরনের উদ্যোগকে চ্যালেঞ্জিং করে তুলেছে [১১] [১৬]।
            </p>
          </div>

          {/* Unique Features Section */}
          <div className="bg-green-50 rounded-lg p-8 mb-8 border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-solaiman-lipi">খোঁজের অনন্য ফিচারস: কেন এটি প্রথম এবং পূর্ণাঙ্গ</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi mb-6">
              খোঁজ একটি ওপেন-সোর্স প্ল্যাটফর্ম (MIT লাইসেন্স), যা Next.js 14, TypeScript এবং আধুনিক এআই মডেলস (Google Gemini, DeepSeek, GROQ) ব্যবহার করে তৈরি। এর ফিচারস এটিকে প্রথম এবং পূর্ণাঙ্গ করে তোলে [১৭]:
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">🤖 এআই ফ্যাক্টচেকিং</h3>
                <p className="text-gray-700 font-solaiman-lipi">
                  বাংলায় দাবি সাবমিট করলে স্ট্রাকচার্ড রিপোর্ট তৈরি হয়, যাতে ভার্ডিক্ট (যেমন সত্য, মিথ্যা, ভ্রান্তিমূলক) এবং ১০টি সোর্স থাকে। এটি ডোমেইন-ফার্স্ট সার্চ স্ট্র্যাটেজি ব্যবহার করে বিশ্বস্ত বাংলাদেশী সোর্স (যেমন নিউজ/ফ্যাক্টচেক সাইট) প্রায়োরিটাইজ করে, প্রয়োজন হলে ইংরেজি সোর্স যোগ করে। এটি মিক্সড-ল্যাঙ্গুয়েজ সোর্সিং সমর্থন করে, কিন্তু রিপোর্ট সবসময় বাংলায় দেয়।
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">🖼️ মাল্টিমিডিয়া যাচাই</h3>
                <p className="text-gray-700 font-solaiman-lipi">
                  ইমেজ অথেনটিসিটি চেক (Sightengine ব্যবহার করে এআই-জেনারেটেড ইমেজ শনাক্ত করে), রিভার্স ইমেজ সার্চ (Google Lens via SerpAPI), এবং টেক্সট অ্যানালাইসিস (Winston AI দিয়ে এআই-ডিটেকশন এবং প্লেজিয়ারিজম চেক)। এই ফিচারগুলো বাংলা কনটেন্টের জন্য বিশেষভাবে অপটিমাইজড।
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">🛠️ স্পেশালাইজড টুলস</h3>
                <p className="text-gray-700 font-solaiman-lipi">
                  Mukti Corner (মুক্তিযুদ্ধ ১৯৭১-এর ইতিহাস ও তথ্য যাচাইয়ের জন্য এআই চ্যাট, FAISS ডাটাবেস এবং Gemini AI ব্যবহার করে) এবং Mythbusting (রুমর ও মিথ ডিবাঙ্কিংয়ের জন্য এআই-চালিত চ্যাট)। এগুলো বাংলাদেশের ঐতিহাসিক ও সাংস্কৃতিক কনটেক্সটকে সম্মান করে।
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">🎨 ইউজার ইন্টারফেস</h3>
                <p className="text-gray-700 font-solaiman-lipi">
                  টেলউইন্ড সিএসএস দিয়ে তৈরি রেসপন্সিভ ইউআই, বাংলা টাইপোগ্রাফি (Solaiman Lipi ফন্ট), এবং রেড-গ্রিন থিম বাংলাদেশী আইডেন্টিটি প্রতিফলিত করে। ফ্যাক্টচেক লাইব্রেরি, রেকমেন্ডেশন সিস্টেম (প্রতি আর্টিকেলে ৫টি সম্পর্কিত আর্টিকেল), এবং ইউজার-জেনারেটেড রিপোর্টের লোকাল স্টোরেজ আছে।
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-solaiman-lipi">⚡ টেক স্ট্যাক এবং স্কেলেবিলিটি</h3>
              <p className="text-gray-700 font-solaiman-lipi mb-4">
                এপিআই এন্ডপয়েন্টস (যেমন /api/factcheck, /api/image-check) JSON রিটার্ন করে, যা স্কেলেবল। ১৬টি Tavily API কী ফলব্যাক সিস্টেম দিয়ে ১৬০০ সার্চ/মাস সমর্থন করে। এটি ওপেন-সোর্স (MIT লাইসেন্স), যা কমিউনিটি কনট্রিবিউশনকে উৎসাহিত করে। ভবিষ্যত রোডম্যাপে অডিও/ভিডিও সার্চ, ইউজার অথেনটিকেশন, এবং অ্যানালিটিক্স ড্যাশবোর্ড আছে।
              </p>
              <p className="text-gray-700 font-solaiman-lipi">
                এই ফিচারগুলো বাংলা ভাষায় প্রথমবারের মতো একত্রিত করা হয়েছে, যা অন্য কোনো প্ল্যাটফর্মে পাওয়া যায়নি [১৭]। আমরা এটি বানিয়েছি কারণ বাংলা ভাষায় ডেটাসেটের অভাব এবং ভাষাগত জটিলতা (যেমন উপভাষা, সাংস্কৃতিক ন্যুয়ান্স) সত্ত্বেও, এআই-এর সম্ভাবনা অসীম – এবং আমরা সেই ফাঁকি পূরণ করেছি [১৫] [১৬]।
              </p>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed font-solaiman-lipi">
              উদাহরণস্বরূপ, Bengali.AI-এর মতো প্রজেক্ট বাংলা ভাষায় এআই রিসার্চ করে (যেমন OCR, স্পিচ রিকগনিশন), কিন্তু ফ্যাক্টচেকিং নয় [১৮]। খোঁজের প্রতিষ্ঠাতা মাহাথির আহমেদ তুষার, ইউআই ডিজাইনার সাগর চন্দ্র দে, এবং রিসার্চার তানিয়া চৈতি এটিকে বাংলাদেশী কনটেক্সটে ডিজাইন করেছেন। এটি মিসইনফরমেশনের বিরুদ্ধে লড়াই করে এবং ডিজিটাল লিটারেসি প্রমোট করে, বিশেষ করে মুক্তিযুদ্ধের টপিকসে, যা অন্য কোনো প্ল্যাটফর্মে এভাবে সমাধান করা হয়নি [১৯]।
            </p>
          </div>

          {/* Verdict Section */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 mb-8 border border-green-300">
            <div className="text-center">
              <div className="inline-flex items-center space-x-3 bg-green-500 text-white px-6 py-3 rounded-full text-xl font-bold mb-6">
                <CheckCircle className="h-8 w-8" />
                <span className="font-solaiman-lipi">ভার্ডিক্ট: ✅ সত্য (True)</span>
              </div>
              
              <p className="text-xl text-gray-700 leading-relaxed font-solaiman-lipi">
                আমাদের বিস্তারিত অনুসন্ধান থেকে প্রমাণিত যে বাংলা ভাষায় কোনো পূর্ববর্তী পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম নেই। খোঁজ প্রথম কারণ এটি বাংলা-কেন্দ্রিক, এআই-চালিত, এবং সম্পূর্ণ – টেক্সট, ইমেজ, এবং ঐতিহাসিক তথ্য যাচাইয়ের সমন্বিত সমাধান প্রদান করে। এটি শুধু মিথ্যা তথ্য প্রতিরোধই করে না, বরং বাংলাদেশে ডিজিটাল লিটারেসি বাড়ায়। আমরা আশা করি খোঁজ অন্যদের অনুপ্রাণিত করবে এবং ভবিষ্যতে আরও বড় প্রভাব ফেলবে [১৭] [২০]।
              </p>
            </div>
          </div>

          {/* References Section */}
          <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-solaiman-lipi">রেফারেন্স</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { num: 1, url: "https://www.sciencedirect.com/science/article/pii/S2949719125000317" },
                { num: 2, url: "https://papers.iafor.org/wp-content/uploads/papers/accs2024/ACCS2024_80137.pdf" },
                { num: 3, url: "https://www.bssnews.net/fact-check" },
                { num: 4, url: "https://play.google.com/store/apps/details?id=com.rumorscanner.app&hl=en_US" },
                { num: 5, url: "https://www.boomlive.in/" },
                { num: 6, url: "https://factcheck.afp.com/AFP-Bangladesh" },
                { num: 7, url: "https://ijpmonline.com/index.php/ojs/article/download/65/69" },
                { num: 8, url: "https://reutersinstitute.politics.ox.ac.uk/news/generative-ai-already-helping-fact-checkers-its-proving-less-useful-small-languages-and" },
                { num: 9, url: "https://gijn.org/stories/how-generative-ai-helps-fact-checkers/" },
                { num: 10, url: "https://factlymedia.com/products/" },
                { num: 11, url: "https://www.poynter.org/fact-checking/2024/factly-india-artificial-intelligence-fact-checking/" },
                { num: 12, url: "https://www.undp.org/digital/stories/ai-powered-fact-checking-tool-iverify-piloted-during-zambia-election-shows-global-promise" },
                { num: 13, url: "https://www.factiverse.ai/blog/revolutionising-fact-checking-with-factiverse-ai-editor" },
                { num: 14, url: "https://projectshakti.in/" },
                { num: 15, url: "https://arxiv.org/abs/1811.01806" },
                { num: 16, url: "https://edam.org.tr/Uploads/Yukleme_Resim/pdf-28-08-2023-23-40-14.pdf" },
                { num: 17, url: "https://github.com/Mahatir-Ahmed-Tusher/Khoj" },
                { num: 18, url: "https://bengali.ai/" },
                { num: 19, url: "https://wan-ifra.org/2025/05/from-norway-to-india-how-ai-is-reshaping-global-fact-checking-efforts/" },
                { num: 20, url: "https://felo.ai/blog/ai-fact-checking-tool/" }
              ].map((ref) => (
                <div key={ref.num} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 mt-1">
                    [{ref.num}]
                  </span>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium break-all flex items-center space-x-1"
                  >
                    <span>{ref.url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/khoj-logo.png" alt="খোঁজ" className="h-8 w-8" />
            <span className="text-xl font-bold font-solaiman-lipi">খোঁজ</span>
          </div>
          <p className="text-gray-400 font-solaiman-lipi">
            বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম
          </p>
        </div>
      </footer>
    </div>
  )
}
