'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useSearchLimit } from '@/lib/hooks/useSearchLimit'
import { LogIn, LogOut, User } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isLoggedIn, isLoading, loginWithGoogle, logout, remainingSearches, session } = useSearchLimit()

  const navItems = [
    { href: '/', label: 'হোম' },
    { href: '/factchecks', label: 'ফ্যাক্টচেক সমূহ' },
    { href: '/mukti-corner', label: 'মুক্তিযুদ্ধ কর্নার' },
    { href: '/mythbusting', label: 'মিথবাস্টিং' },
    { href: '/e-library', label: 'ই-গ্রন্থ সম্ভার' },
    { href: '/about', label: 'আমাদের সম্পর্কে' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3" onClick={closeMobileMenu}>
            <img 
              src="/khoj-logo.png" 
              alt="খোঁজ লোগো" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900 font-solaiman-lipi">খোঁজ</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors duration-200 font-solaiman-lipi',
                  pathname === item.href
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              <>
                {!isLoggedIn ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 font-solaiman-lipi">
                      সার্চ: {remainingSearches === Infinity ? '∞' : remainingSearches}
                    </span>
                    <button
                      onClick={loginWithGoogle}
                      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium font-solaiman-lipi text-sm"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>লগ ইন</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={session?.user?.image || '/khoj-logo.png'} 
                        alt="User" 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-green-600 font-solaiman-lipi">
                        {session?.user?.name?.split(' ')[0]}
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium font-solaiman-lipi text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>লগ আউট</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Auth Section - Always visible */}
            {!isLoading && (
              <>
                {!isLoggedIn ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600 font-solaiman-lipi">
                      {remainingSearches === Infinity ? '∞' : remainingSearches}
                    </span>
                    <button
                      onClick={loginWithGoogle}
                      className="flex items-center space-x-1 bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors font-medium font-solaiman-lipi text-xs"
                    >
                      <LogIn className="h-3 w-3" />
                      <span>লগ ইন</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <img 
                      src={session?.user?.image || '/khoj-logo.png'} 
                      alt="User" 
                      className="w-5 h-5 rounded-full"
                    />
                    <button
                      onClick={logout}
                      className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium font-solaiman-lipi text-xs"
                    >
                      <LogOut className="h-3 w-3" />
                      <span>লগ আউট</span>
                    </button>
                  </div>
                )}
              </>
            )}
            
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 font-solaiman-lipi',
                    pathname === item.href
                      ? 'text-primary-600 bg-primary-50 border-l-4 border-primary-600'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900 font-solaiman-lipi">আপনার ফ্যাক্টচেক</h2>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2 font-solaiman-lipi">সাম্প্রতিক ফ্যাক্টচেক</h3>
                  <p className="text-sm text-gray-600 font-solaiman-lipi">আপনার সব ফ্যাক্টচেক হিস্ট্রি এখানে পাবেন</p>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium text-gray-900 font-solaiman-lipi">বাংলাদেশের অর্থনীতি</p>
                    <p className="text-xs text-gray-500">২ দিন আগে</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium text-gray-900 font-solaiman-lipi">জলবায়ু পরিবর্তন</p>
                    <p className="text-xs text-gray-500">১ সপ্তাহ আগে</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </nav>
  )
}
