'use client'

import { useState, useEffect, useRef } from 'react'
import { isFirstVisit } from '@/lib/visit-tracker'

interface TourStep {
  id: string
  target: string // CSS selector or element ID
  title: string
  content: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  showArrow?: boolean
  highlight?: boolean
}

interface SiteTourProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export default function SiteTour({ isOpen, onClose, onComplete }: SiteTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      target: 'body',
      title: 'খোঁজে স্বাগতম!',
      content: 'চলুন আপনাকে ঘুরিয়ে দেখাই, খোঁজে কী কী আছে!',
      position: 'center',
      showArrow: false,
      highlight: false
    },
    {
      id: 'mobile-menu',
      target: '.md\\:hidden button[aria-label="Toggle mobile menu"]',
      title: 'আপনার ফ্যাক্টচেক',
      content: 'আপনার যাচাই করা আগের সব এআই ফ্যাক্টচেক দেখতে',
      position: 'bottom',
      showArrow: true,
      highlight: true
    },
    {
      id: 'sidebar-toggle',
      target: '[data-tour="sidebar-toggle"], .md\\:hidden button[aria-label="Toggle mobile menu"]',
      title: 'মোবাইল মেনু',
      content: 'এখানে সব পেজের লিংক পাবেন',
      position: 'bottom',
      showArrow: true,
      highlight: true
    },
    {
      id: 'image-check',
      target: '[href="/image-check"], [data-tour="image-check"]',
      title: 'ছবি যাচাই',
      content: 'ছবির সত্যতা যাচাই করুন',
      position: 'right',
      showArrow: true,
      highlight: true
    },
    {
      id: 'text-check',
      target: '[href="/text-check"], [data-tour="text-check"]',
      title: 'লেখা যাচাই',
      content: 'লেখার সত্যতা যাচাই করুন',
      position: 'right',
      showArrow: true,
      highlight: true
    },
    {
      id: 'source-search',
      target: '[href="/source-search"], [data-tour="source-search"]',
      title: 'উৎস সন্ধান',
      content: 'তথ্যের উৎس খুঁজুন',
      position: 'top',
      showArrow: true,
      highlight: true
    },
    {
      id: 'mythbusting',
      target: '.mythbusting-button, .hero-section a[href="/mythbusting"], .hero-section [data-tour="mythbusting"]',
      title: 'মিথবাস্টিং',
      content: 'ভুয়া তথ্য খন্ডন করুন',
      position: 'bottom',
      showArrow: true,
      highlight: true
    },
    {
      id: 'search-bar',
      target: '.search-bar, [data-tour="search-bar"]',
      title: 'সার্চ বার',
      content: 'যেকোনো দাবি লিখে যাচাই করুন',
      position: 'bottom',
      showArrow: true,
      highlight: true
    },
    {
      id: 'floating-action',
      target: '.lg\\:hidden.fixed.bottom-6.right-6 button',
      title: '',
      content: '',
      position: 'center',
      showArrow: false,
      highlight: false
    },
    {
      id: 'complete',
      target: 'body',
      title: 'ট্যুর শেষ! ✅',
      content: 'এখন সব ফিচার জানেন',
      position: 'center',
      showArrow: false,
      highlight: false
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setTimeout(() => {
        highlightCurrentStep()
      }, 100)
    } else {
      setIsVisible(false)
      removeHighlights()
    }
  }, [isOpen, currentStep])

  const highlightCurrentStep = () => {
    removeHighlights()
    
    const step = tourSteps[currentStep]
    if (!step || !step.highlight) return

    // Try multiple selectors to find the correct element
    let targetElement = null
    
    if (step.target.includes('mobile-menu')) {
      // Look for hamburger menu specifically
      targetElement = document.querySelector('.md\\:hidden button[aria-label="Toggle mobile menu"]')
      if (!targetElement) {
        targetElement = document.querySelector('.md\\:hidden button')
      }
      if (!targetElement) {
        targetElement = document.querySelector('button[aria-label*="menu"]')
      }
    } else if (step.target.includes('image-check')) {
      // Look for image check button in hero section specifically
      targetElement = document.querySelector('.hero-section [href="/image-check"], .hero-section [data-tour="image-check"]')
      if (!targetElement) {
        targetElement = document.querySelector('[href="/image-check"]:not(.sidebar-toggle)')
      }
    } else if (step.target.includes('text-check')) {
      // Look for text check button in hero section specifically
      targetElement = document.querySelector('.hero-section [href="/text-check"], .hero-section [data-tour="text-check"]')
      if (!targetElement) {
        targetElement = document.querySelector('[href="/text-check"]:not(.sidebar-toggle)')
      }
    } else if (step.target.includes('mythbusting')) {
      // Look for mythbusting button using specific class first
      targetElement = document.querySelector('.mythbusting-button')
      if (!targetElement) {
        // Then look in hero section
        targetElement = document.querySelector('.hero-section a[href="/mythbusting"], .hero-section [data-tour="mythbusting"]')
      }
      if (!targetElement) {
        // Fallback: look for mythbusting button but exclude sidebar
        targetElement = document.querySelector('a[href="/mythbusting"]:not(.sidebar-toggle):not([data-tour="sidebar-toggle"])')
      }
      if (!targetElement) {
        // Last fallback: any mythbusting link
        targetElement = document.querySelector('a[href="/mythbusting"]')
      }
    } else if (step.target.includes('floating-action')) {
      // Look for FAB button specifically
      targetElement = document.querySelector('.lg\\:hidden.fixed.bottom-6.right-6 button')
      if (!targetElement) {
        // Fallback: look for any FAB button
        targetElement = document.querySelector('.fixed.bottom-6.right-6 button')
      }
      if (!targetElement) {
        // Last fallback: look for FeatureWidget button
        targetElement = document.querySelector('.lg\\:hidden button')
      }
    } else {
      targetElement = document.querySelector(step.target)
    }

    if (targetElement) {
      targetElement.classList.add('tour-highlight')
      
      // Debug: log which element is being highlighted
      console.log('Tour highlighting element:', targetElement)
      console.log('Element classes:', targetElement.className)
      console.log('Element href:', targetElement.getAttribute('href'))
      
      targetElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      })
    } else {
      console.warn('Tour target element not found for step:', step.id, 'with target:', step.target)
    }
  }

  const removeHighlights = () => {
    const highlightedElements = document.querySelectorAll('.tour-highlight')
    highlightedElements.forEach(el => el.classList.remove('tour-highlight'))
  }

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeTour()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeTour = () => {
    removeHighlights()
    onComplete()
    onClose()
  }

  const skipTour = () => {
    removeHighlights()
    onClose()
  }

  if (!isOpen || !isVisible) return null

  const currentStepData = tourSteps[currentStep]
  const targetElement = document.querySelector(currentStepData.target)

  // Calculate tooltip position for mobile with better bounds checking
  const getTooltipPosition = () => {
    if (!targetElement || currentStepData.position === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'fixed' as const,
        width: '85vw',
        maxWidth: '300px'
      }
    }

    const rect = targetElement.getBoundingClientRect()
    const tooltipWidth = Math.min(240, window.innerWidth - 80)
    const tooltipHeight = 90
    const offset = 8 // Smaller offset for better positioning
    const margin = 20 // Smaller margin for better visibility

    let top = 0
    let left = 0
    let transform = ''
    let position = currentStepData.position

    // Special handling for different elements
    if (currentStepData.id === 'mobile-menu') {
      // For hamburger menu, always show below
      position = 'bottom'
    } else if (currentStepData.id === 'sidebar-toggle') {
      // For sidebar-toggle button, always show below and to the right
      position = 'bottom'
    } else if (currentStepData.id === 'floating-action') {
      // For FAB, always show to the left and slightly above
      position = 'left'
    } else if (['image-check', 'text-check'].includes(currentStepData.id)) {
      // For image-check and text-check buttons, always show to the right
      position = 'right'
    } else if (['source-search', 'mythbusting'].includes(currentStepData.id)) {
      // For other feature buttons, prefer top position
      position = 'top'
    }

    // Check if element is near screen edges and adjust position accordingly
    const isNearTop = rect.top < 100
    const isNearBottom = rect.bottom > window.innerHeight - 100
    const isNearLeft = rect.left < 100
    const isNearRight = rect.right > window.innerWidth - 100

    // Auto-adjust position based on element location
    // But don't change position for mobile-menu, image-check, text-check, sidebar-toggle, and floating-action buttons
    if (!['mobile-menu', 'image-check', 'text-check', 'sidebar-toggle', 'floating-action'].includes(currentStepData.id)) {
      if (isNearTop && position === 'top') {
        position = 'bottom'
      }
      if (isNearBottom && position === 'bottom') {
        position = 'top'
      }
      if (isNearLeft && position === 'left') {
        position = 'right'
      }
      if (isNearRight && position === 'right') {
        position = 'left'
      }
    }

    switch (position) {
      case 'top':
        top = rect.top - tooltipHeight - offset
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
        transform = 'translateX(-50%)'
        break
      case 'bottom':
        top = rect.bottom + offset
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2)
        transform = 'translateX(-50%)'
        // For sidebar-toggle, position tooltip to the right
        if (currentStepData.id === 'sidebar-toggle') {
          left = rect.right - tooltipWidth
          transform = 'translateX(0)'
        }
        break
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
        left = rect.left - tooltipWidth - offset
        transform = 'translateY(-50%)'
        // Special positioning for FAB - position to the left and slightly above
        if (currentStepData.id === 'floating-action') {
          // Position tooltip to the left of the FAB with proper spacing
          left = rect.left - tooltipWidth - (offset * 2)
          // Position slightly above center for better visual alignment
          top = rect.top + (rect.height / 2) - (tooltipHeight / 2) - 10
          transform = 'translateY(0)'
          
          // Ensure tooltip doesn't go off screen
          if (left < margin) {
            left = margin
          }
          if (top < margin) {
            top = margin
          }
          // Ensure tooltip doesn't go below viewport
          if (top + tooltipHeight > window.innerHeight - margin) {
            top = window.innerHeight - tooltipHeight - margin
          }
        }
        // For sidebar-toggle, ensure tooltip doesn't cover the button
        else if (currentStepData.id === 'sidebar-toggle') {
          // Position tooltip further left to avoid covering
          left = rect.left - tooltipWidth - (offset * 2)
        }
        break
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2)
        left = rect.right + offset
        transform = 'translateY(-50%)'
        // Ensure tooltip stays within screen bounds
        if (left + tooltipWidth > window.innerWidth - margin) {
          left = window.innerWidth - tooltipWidth - margin
        }
        break
    }

    // Final bounds checking (but skip for FAB as we handled it specifically above)
    if (currentStepData.id !== 'floating-action') {
      // Ensure tooltip stays within screen bounds with better margins
      top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin))
      left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin))
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform,
      position: 'fixed' as const,
      width: `${tooltipWidth}px`
    }
  }

  const tooltipStyle = getTooltipPosition()

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={skipTour}
      />
      
      {/* FAB Notification - Only show for floating-action step */}
      {currentStepData.id === 'floating-action' && (
        <div className="fixed bottom-20 right-6 z-[60] bg-blue-600 text-white px-4 py-3 rounded-lg shadow-2xl max-w-xs animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            <p className="text-sm font-tiro-bangla leading-relaxed">
              মুক্তিযুদ্ধ কর্নার, মিথবাস্টিং কিংবা বইপত্র পড়তে ই-গ্রন্থসম্ভারে যেতে এখানে চলে আসুন
            </p>
          </div>
          <div className="absolute -bottom-1 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
        </div>
      )}
      
      {/* Tooltip - Hide for FAB step */}
      {currentStepData.id !== 'floating-action' && (
        <div
          ref={tooltipRef}
          className="fixed z-[60] bg-white rounded-lg shadow-2xl p-3 transition-all duration-300"
          style={tooltipStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          {currentStepData.showArrow && currentStepData.position !== 'center' && (
            <div className={`absolute w-0 h-0 ${
              currentStepData.position === 'top' ? 
                'border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white top-full left-1/2 transform -translate-x-1/2' :
              currentStepData.position === 'bottom' ? 
                'border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-white bottom-full left-1/2 transform -translate-x-1/2' :
              currentStepData.position === 'left' ? 
                'border-t-6 border-b-6 border-l-6 border-t-transparent border-b-transparent border-l-white left-full top-1/2 transform -translate-y-1/2' :
              'border-t-6 border-b-6 border-r-6 border-t-transparent border-b-transparent border-r-white right-full top-1/2 transform -translate-y-1/2'
            }`} />
          )}

          {/* Content */}
          <div className="text-center">
            <h3 className="text-sm font-bold text-gray-900 mb-1 font-tiro-bangla">
              {currentStepData.title}
            </h3>
            <p className="text-xs text-gray-700 mb-2 font-tiro-bangla leading-relaxed">
              {currentStepData.content}
            </p>
            
            {/* Progress - Smaller for mobile */}
            <div className="mb-2">
              <div className="flex justify-center space-x-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1 h-1 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 
                      index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1 font-tiro-bangla">
                {currentStep + 1}/{tourSteps.length}
              </p>
            </div>

            {/* Navigation - Smaller buttons for mobile */}
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-2 py-1 rounded text-xs font-medium font-tiro-bangla transition-colors ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                পূর্ববর্তী
              </button>
              
              <button
                onClick={skipTour}
                className="absolute top-2 right-2 w-6 h-6 text-red-500 hover:text-red-700 transition-colors text-lg font-bold z-10"
                title="ট্যুর বন্ধ করুন"
              >
                ✕
              </button>
              
              <button
                onClick={nextStep}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-medium font-tiro-bangla hover:bg-blue-700 transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? 'সম্পূর্ণ' : 'পরবর্তী'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.6) !important;
          border-radius: 6px !important;
          transition: box-shadow 0.3s ease !important;
        }
        
        .tour-highlight::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 9px;
          z-index: -1;
        }

        /* Mobile specific styles */
        @media (max-width: 768px) {
          .tour-highlight {
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.7) !important;
            border-radius: 4px !important;
          }
          
          .tour-highlight::before {
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(59, 130, 246, 0.2);
            border-radius: 6px;
          }
        }
      `}</style>
    </>
  )
}