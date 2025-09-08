'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { setLoggedIn, setLoggedOut } from '@/lib/search-limit-manager'

export default function SignInPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.user?.email) {
      setLoggedIn(session.user.email)
    } else {
      setLoggedOut()
    }
  }, [session])

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-solaiman-lipi">লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <img 
              src={session.user?.image || '/khoj-logo.png'} 
              alt="User" 
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-gray-900 font-solaiman-lipi">
              স্বাগতম, {session.user?.name}!
            </h2>
            <p className="text-gray-600 font-solaiman-lipi">
              আপনি সফলভাবে লগ ইন করেছেন
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-solaiman-lipi">
                ✅ এখন আপনি আনলিমিটেড সার্চ করতে পারবেন
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium font-solaiman-lipi"
            >
              লগ আউট করুন
            </button>
            
            <a
              href="/"
              className="block w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium font-solaiman-lipi"
            >
              হোম পেজে যান
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <img 
            src="/khoj-logo.png" 
            alt="খোঁজ লোগো" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="text-xl font-bold text-gray-900 font-solaiman-lipi mb-2">
            খোঁজে লগ ইন করুন
          </h2>
          <p className="text-gray-600 font-solaiman-lipi">
            আপনার সার্চ সীমা শেষ হয়ে গেছে। লগ ইন করে চালিয়ে যান
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium font-solaiman-lipi flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google দিয়ে লগ ইন করুন</span>
          </button>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-sm font-solaiman-lipi">
              <strong>লগ ইন করার সুবিধা:</strong>
              <br />
              • অসীম সার্চ
              <br />
              • সার্চ হিস্টরি সংরক্ষণ
              <br />
              • ব্যক্তিগত ড্যাশবোর্ড
            </p>
          </div>
          
          <a
            href="/"
            className="block text-gray-500 hover:text-gray-700 text-sm font-solaiman-lipi"
          >
            হোম পেজে ফিরে যান
          </a>
        </div>
      </div>
    </div>
  )
}
