'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Zap } from 'lucide-react'

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
  const [isExpanded, setIsExpanded] = useState(false)

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
        {/* Expanded Options */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 flex flex-col space-y-4 mb-4">
            {features.map((feature, index) => (
              <Link
                key={feature.id}
                href={feature.href}
                onClick={() => setIsExpanded(false)}
                className="flex items-center space-x-3 bg-white rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInUp 0.3s ease-out forwards'
                }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100">
                  {feature.id === 'mukti-corner' || feature.id === 'mythbusting' ? (
                    <feature.icon className="h-8 w-8 object-contain" />
                  ) : (
                    <feature.icon className="h-6 w-6 text-gray-700" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 font-solaiman-lipi whitespace-nowrap">
                  {feature.title}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
            isExpanded ? 'rotate-45 hover:opacity-90' : 'hover:scale-110'
          }`}
          style={{
            backgroundColor: isExpanded ? '#dc2626' : '#00bfff',
            boxShadow: isExpanded 
              ? '0 4px 20px rgba(220, 38, 38, 0.4), 0 8px 25px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.2), 0 0 60px rgba(220, 38, 38, 0.1)'
              : '0 4px 20px rgba(0, 191, 255, 0.4), 0 8px 25px rgba(0, 191, 255, 0.3), 0 0 40px rgba(0, 191, 255, 0.2), 0 0 60px rgba(0, 191, 255, 0.1)',
            filter: isExpanded 
              ? 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))'
              : 'drop-shadow(0 0 20px rgba(0, 191, 255, 0.5))'
          }}
        >
          {isExpanded ? (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <img 
              src="/searching.png" 
              alt="Search" 
              className="h-8 w-8 object-contain filter brightness-110"
            />
          )}
        </button>
      </div>

    </>
  )
}
