'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, MessageCircle, Zap } from 'lucide-react'

// Custom Mukti Corner Icon Component
const MuktiIcon = ({ className }: { className?: string }) => (
  <img 
    src="/mukti.png" 
    alt="মুক্তিযুদ্ধ কর্নার" 
    className={className}
  />
)

// Custom Mythbusting Icon Component
const MythbustingIcon = ({ className }: { className?: string }) => (
  <img 
    src="/mythbusting.png" 
    alt="মিথবাস্টিং" 
    className={className}
  />
)

interface FeatureWidgetProps {
  className?: string
}

export default function FeatureWidget({ className = '' }: FeatureWidgetProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const features = [
    {
      id: 'mukti-corner',
      title: 'মুক্তিযুদ্ধ কর্নার',
      description: '১৯৭১ সালের মুক্তিযুদ্ধ সম্পর্কে প্রশ্ন করুন',
      icon: MuktiIcon,
      href: '/mukti-corner',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      id: 'mythbusting',
      title: 'মিথবাস্টিং',
      description: 'বৈজ্ঞানিক দাবি ও কুসংস্কার যাচাই করুন',
      icon: MythbustingIcon,
      href: '/mythbusting',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'e-library',
      title: 'ই-গ্রন্থ সম্ভার',
      description: 'বই পর্যালোচনা ও ডাউনলোড লিংক',
      icon: BookOpen,
      href: '/e-library',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  return (
    <>
      {/* Desktop Widget */}
      <div className={`hidden lg:block ${className}`}>
        <div 
          className="bg-white rounded-xl p-6 text-gray-900 border border-gray-300"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
          }}
        >
          <h3 className="text-lg font-bold mb-4 font-solaiman-lipi text-center text-gray-800">
            আপনার সত্যান্বেষের এ যাত্রায় আরও রয়েছেঃ
          </h3>
          
          <div className="space-y-4">
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={feature.href}
                className="block group"
              >
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-300 border border-gray-200 hover:border-gray-300">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${feature.id === 'mukti-corner' || feature.id === 'mythbusting' ? 'bg-transparent' : feature.color} transition-colors duration-300`}>
                      {feature.id === 'mukti-corner' || feature.id === 'mythbusting' ? (
                        <feature.icon className="h-9 w-9 object-contain" />
                      ) : (
                        <feature.icon className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium font-solaiman-lipi text-gray-800 group-hover:text-gray-900 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-gray-600 font-solaiman-lipi">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
                  <button
            onClick={() => setIsModalOpen(true)}
            className="w-16 h-16 bg-orange-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:bg-orange-600 transition-all duration-300"
            style={{
              boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3), 0 8px 25px rgba(249, 115, 22, 0.2), 0 0 30px rgba(249, 115, 22, 0.15)'
            }}
          >
          <MessageCircle className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Modal */}
      {isModalOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 font-solaiman-lipi">
                আপনার সত্যান্বেষের এ যাত্রায় আরও রয়েছেঃ
              </h3>
            </div>
            
            <div className="space-y-4">
              {features.map((feature) => (
                <Link
                  key={feature.id}
                  href={feature.href}
                  onClick={() => setIsModalOpen(false)}
                  className="block"
                >
                  <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-all duration-300 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${feature.id === 'mukti-corner' || feature.id === 'mythbusting' ? 'bg-transparent' : feature.color} transition-colors duration-300`}>
                        {feature.id === 'mukti-corner' || feature.id === 'mythbusting' ? (
                          <feature.icon className="h-9 w-9 object-contain" />
                        ) : (
                          <feature.icon className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 font-solaiman-lipi">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600 font-solaiman-lipi">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
