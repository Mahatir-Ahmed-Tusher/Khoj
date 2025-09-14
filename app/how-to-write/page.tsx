'use client'

import Link from 'next/link'
import { CheckCircle, AlertCircle, FileText, Mail, Search, BookOpen, Users, Clock, Shield } from 'lucide-react'

export default function HowToWritePage() {

  const reportStructure = [
    {
      title: "শিরোনাম",
      description: "সংক্ষিপ্ত এবং আকর্ষণীয় শিরোনাম যা পাঠকের মনোযোগ আকর্ষণ করবে",
      example: "বাংলাদেশে করোনা ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া নিয়ে ভাইরাল হওয়া পোস্টটি সত্য নাকি মিথ্যা?"
    },
    {
      title: "দাবি/তথ্য",
      description: "যে দাবি বা তথ্য যাচাই করা হচ্ছে সেটি স্পষ্টভাবে উল্লেখ করুন",
      example: "সামাজিক যোগাযোগমাধ্যমে একটি পোস্ট ভাইরাল হয়েছে যেখানে বলা হয়েছে যে করোনা ভ্যাকসিন নেওয়ার পর অনেকেই গুরুতর পার্শ্বপ্রতিক্রিয়ায় ভুগছেন।"
    },
    {
      title: "যাচাই প্রক্রিয়া",
      description: "কীভাবে যাচাই করা হয়েছে তার বিস্তারিত বর্ণনা",
      example: "আমরা চিকিৎসা বিশেষজ্ঞদের সাথে কথা বলেছি, সরকারি স্বাস্থ্য বিভাগের তথ্য পর্যালোচনা করেছি এবং বিশ্ব স্বাস্থ্য সংস্থার রিপোর্ট বিশ্লেষণ করেছি।"
    },
    {
      title: "ফলাফল",
      description: "যাচাইয়ের চূড়ান্ত ফলাফল (সত্য/মিথ্যা/ভ্রান্তিমূলক)",
      example: "ভাইরাল হওয়া তথ্যটি ভ্রান্তিমূলক। ভ্যাকসিনের পার্শ্বপ্রতিক্রিয়া থাকলেও সেগুলো সাধারণত হালকা এবং সাময়িক।"
    },
    {
      title: "উৎসসমূহ",
      description: "যে সব উৎস ব্যবহার করা হয়েছে সেগুলোর তালিকা",
      example: "বাংলাদেশ স্বাস্থ্য অধিদপ্তর, বিশ্ব স্বাস্থ্য সংস্থা, চিকিৎসা বিশেষজ্ঞদের সাক্ষাৎকার।"
    }
  ]

  const tips = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      title: "নির্ভরযোগ্য উৎস ব্যবহার করুন",
      description: "সরকারি প্রতিষ্ঠান, স্বীকৃত সংস্থা এবং বিশেষজ্ঞদের মতামতকে অগ্রাধিকার দিন"
    },
    {
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      title: "পক্ষপাতিত্ব এড়িয়ে চলুন",
      description: "নিরপেক্ষ দৃষ্টিভঙ্গি বজায় রাখুন এবং ব্যক্তিগত মতামত থেকে দূরে থাকুন"
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: "তথ্যের সত্যতা যাচাই করুন",
      description: "প্রতিটি তথ্যের জন্য নির্ভরযোগ্য প্রমাণ সংগ্রহ করুন"
    },
    {
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      title: "সময়ের সাথে আপডেট রাখুন",
      description: "নতুন তথ্য পাওয়া গেলে রিপোর্ট আপডেট করুন"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 font-tiro-bangla">
            ফ্যাক্টচেকিং রিপোর্ট লেখার গাইড
          </h1>
          <p className="text-sm md:text-base opacity-90 font-tiro-bangla">
            সত্যের সন্ধানে আমাদের সাথে যোগ দিন
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-3 font-tiro-bangla">
              আমাদের পরিবারে স্বাগতম!
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-tiro-bangla">
              এতোদূর যেহেতু চলে এসেছেন, তাহলে নিশ্চয়ই আপনি আমাদের পরিবারের সদস্য হতে চান। 
              চলুন জানা যাক, কীভাবে লিখা হয় একটি ফ্যাক্টচেকিং রিপোর্ট...
            </p>
          </div>
        </div>

        {/* Continuous Content */}
        <div className="space-y-6">
          {/* Step 1: Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-tiro-bangla">শুরুর কথা</h3>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 leading-relaxed mb-4 font-tiro-bangla">
                ফ্যাক্টচেকিং একটি গুরুত্বপূর্ণ কাজ যা সমাজে সত্যের প্রচার এবং মিথ্যা তথ্যের বিরুদ্ধে লড়াই করে। 
                আমাদের সাথে যোগ দিয়ে আপনি এই মহৎ কাজে অংশগ্রহণ করতে পারেন।
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <h4 className="text-sm font-semibold text-green-700 mb-2 font-tiro-bangla">
                  কেন ফ্যাক্টচেকিং গুরুত্বপূর্ণ?
                </h4>
                <ul className="text-left text-gray-600 space-y-1 text-xs font-tiro-bangla">
                  <li>• মিথ্যা তথ্যের বিস্তার রোধ করে</li>
                  <li>• জনগণকে সঠিক তথ্য প্রদান করে</li>
                  <li>• গণতন্ত্রকে শক্তিশালী করে</li>
                  <li>• সামাজিক বিভ্রান্তি কমায়</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2: Topic Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-tiro-bangla">বিষয় নির্বাচন</h3>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-3 font-tiro-bangla">
              ভালো বিষয় নির্বাচনের জন্য:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h5 className="font-semibold text-blue-700 mb-2 text-sm font-tiro-bangla">নির্বাচন করুন</h5>
                <ul className="space-y-1 text-gray-600 text-xs font-tiro-bangla">
                  <li>• ভাইরাল হওয়া পোস্ট</li>
                  <li>• রাজনৈতিক দাবি</li>
                  <li>• স্বাস্থ্য সম্পর্কিত তথ্য</li>
                  <li>• অর্থনৈতিক দাবি</li>
                  <li>• বিজ্ঞান সম্পর্কিত তথ্য</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h5 className="font-semibold text-red-700 mb-2 text-sm font-tiro-bangla">এড়িয়ে চলুন</h5>
                <ul className="space-y-1 text-gray-600 text-xs font-tiro-bangla">
                  <li>• ব্যক্তিগত মতামত</li>
                  <li>• ভবিষ্যদ্বাণী</li>
                  <li>• অতিমাত্রায় জটিল বিষয়</li>
                  <li>• সংবেদনশীল ব্যক্তিগত তথ্য</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3: Research */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <Search className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-tiro-bangla">গবেষণা</h3>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-3 font-tiro-bangla">
              গবেষণার ধাপসমূহ:
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">প্রাথমিক অনুসন্ধান</h5>
                  <p className="text-gray-600 text-xs font-tiro-bangla">বিষয়টি সম্পর্কে মৌলিক তথ্য সংগ্রহ করুন এবং কী ধরনের প্রমাণ প্রয়োজন তা নির্ধারণ করুন।</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">উৎস অনুসন্ধান</h5>
                  <p className="text-gray-600 text-xs font-tiro-bangla">নির্ভরযোগ্য উৎস যেমন সরকারি প্রতিষ্ঠান, স্বীকৃত সংস্থা এবং বিশেষজ্ঞদের মতামত খুঁজে বের করুন।</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">তথ্য যাচাই</h5>
                  <p className="text-gray-600 text-xs font-tiro-bangla">সংগৃহীত তথ্যের সত্যতা যাচাই করুন এবং বিভিন্ন উৎসের মধ্যে তুলনা করুন।</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Report Writing */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-tiro-bangla">রিপোর্ট লেখা</h3>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-3 font-tiro-bangla">
              রিপোর্টের গঠন:
            </h4>
            <div className="space-y-3">
              {reportStructure.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h5 className="text-sm font-semibold text-gray-800 mb-1 font-tiro-bangla">
                    {section.title}
                  </h5>
                  <p className="text-gray-600 mb-2 text-xs font-tiro-bangla">
                    {section.description}
                  </p>
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-xs text-gray-700 italic font-tiro-bangla">
                      <strong>উদাহরণ:</strong> {section.example}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 5: Submission */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 font-tiro-bangla">জমা দেওয়া</h3>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                <Mail className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-800 mb-3 font-tiro-bangla">
                  রিপোর্ট জমা দেওয়ার নিয়ম
                </h4>
                <div className="space-y-3 text-left max-w-2xl mx-auto">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">ইমেইল ঠিকানা:</h5>
                    <a 
                      href="mailto:fact@khoj-bd.com"
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm font-tiro-bangla"
                    >
                      fact@khoj-bd.com
                    </a>
                  </div>
                  
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <h5 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">ফাইল ফরম্যাট:</h5>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-tiro-bangla">DOCX</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-tiro-bangla">TXT</span>
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-tiro-bangla">Google Doc</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-1" />
                      <div>
                        <h5 className="font-semibold text-yellow-800 mb-1 text-sm font-tiro-bangla">গুরুত্বপূর্ণ মনে রাখবেন:</h5>
                        <p className="text-yellow-700 text-xs font-tiro-bangla">
                          Google Doc ব্যবহার করলে অবশ্যই লিংকটি accessible করে রাখুন। 
                          আমাদের যেন ফাইলটি দেখতে এবং সম্পাদনা করতে সমস্যা না হয়।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center font-tiro-bangla">
            সফল ফ্যাক্টচেকিংয়ের টিপস
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-shrink-0">{tip.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm font-tiro-bangla">
                    {tip.title}
                  </h4>
                  <p className="text-gray-600 text-xs font-tiro-bangla">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-3 font-tiro-bangla">
            এখনই শুরু করুন!
          </h3>
          <p className="text-sm mb-4 opacity-90 font-tiro-bangla">
            আপনার প্রথম ফ্যাক্টচেকিং রিপোর্ট লিখুন এবং আমাদের পরিবারের অংশ হন
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:fact@khoj-bd.com"
              className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm font-tiro-bangla"
            >
              রিপোর্ট পাঠান
            </a>
            <Link 
              href="/"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-4 py-2 rounded-full font-semibold transition-all duration-300 text-sm font-tiro-bangla"
            >
              হোম পেজে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
