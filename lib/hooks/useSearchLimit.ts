'use client'

import { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { searchLimitManager } from '@/lib/search-limit-manager'

export function useSearchLimit() {
  const { data: session, status } = useSession()
  const [remainingSearches, setRemainingSearches] = useState(3)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateState = () => {
      const loggedIn = !!session?.user
      const remaining = searchLimitManager.getRemainingSearches()
      
      setIsLoggedIn(loggedIn)
      setRemainingSearches(loggedIn ? Infinity : remaining)
      setIsLoading(false)
    }

    updateState()

    // Listen for auth changes
    const handleStorageChange = () => {
      updateState()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [session])

  // Update search limit manager when session changes
  useEffect(() => {
    if (session?.user?.email) {
      searchLimitManager.setLoggedIn(session.user.email)
    } else {
      searchLimitManager.setLoggedOut()
    }
  }, [session])

  const canSearch = () => {
    return searchLimitManager.canSearch()
  }

  const recordSearch = (query: string, page: 'factcheck' | 'mukti-corner' | 'mythbusting') => {
    const userId = session?.user?.email || undefined
    return searchLimitManager.recordSearch(query, page, userId)
  }

  const loginWithGoogle = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const logout = () => {
    // NextAuth handles logout
    searchLimitManager.setLoggedOut()
  }

  return {
    remainingSearches,
    isLoggedIn,
    isLoading: isLoading || status === 'loading',
    canSearch,
    recordSearch,
    loginWithGoogle,
    logout,
    session
  }
}
