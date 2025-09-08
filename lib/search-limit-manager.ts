// Search limit management for KALOPATHOR
export interface SearchLimitInfo {
  remainingSearches: number
  totalSearches: number
  isLoggedIn: boolean
  lastResetDate: string | null
}

export interface SearchRecord {
  id: string
  query: string
  page: 'factcheck' | 'mukti-corner' | 'mythbusting'
  timestamp: number
  userId?: string
}

class SearchLimitManager {
  private readonly SEARCH_LIMIT_KEY = 'kalopathor_search_limit'
  private readonly SEARCH_RECORDS_KEY = 'kalopathor_search_records'
  private readonly MAX_FREE_SEARCHES = 3
  private readonly RESET_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

  // Check if user can perform search
  canSearch(): boolean {
    if (typeof window === 'undefined') return true
    
    const limitInfo = this.getSearchLimitInfo()
    return limitInfo.isLoggedIn || limitInfo.remainingSearches > 0
  }

  // Get remaining searches
  getRemainingSearches(): number {
    if (typeof window === 'undefined') return this.MAX_FREE_SEARCHES
    
    const limitInfo = this.getSearchLimitInfo()
    return limitInfo.isLoggedIn ? Infinity : limitInfo.remainingSearches
  }

  // Record a search
  recordSearch(query: string, page: 'factcheck' | 'mukti-corner' | 'mythbusting', userId?: string): boolean {
    if (typeof window === 'undefined') return true
    
    const limitInfo = this.getSearchLimitInfo()
    
    // If logged in, no limit
    if (limitInfo.isLoggedIn) {
      this.addSearchRecord(query, page, userId)
      return true
    }
    
    // Check if user has remaining searches
    if (limitInfo.remainingSearches <= 0) {
      return false
    }
    
    // Record the search
    this.addSearchRecord(query, page)
    
    // Update limit
    const updatedLimitInfo: SearchLimitInfo = {
      ...limitInfo,
      remainingSearches: limitInfo.remainingSearches - 1,
      totalSearches: limitInfo.totalSearches + 1
    }
    
    localStorage.setItem(this.SEARCH_LIMIT_KEY, JSON.stringify(updatedLimitInfo))
    
    return true
  }

  // Set user as logged in
  setLoggedIn(userId: string): void {
    if (typeof window === 'undefined') return
    
    const limitInfo = this.getSearchLimitInfo()
    const updatedLimitInfo: SearchLimitInfo = {
      ...limitInfo,
      isLoggedIn: true,
      remainingSearches: Infinity
    }
    
    localStorage.setItem(this.SEARCH_LIMIT_KEY, JSON.stringify(updatedLimitInfo))
  }

  // Set user as logged out
  setLoggedOut(): void {
    if (typeof window === 'undefined') return
    
    const limitInfo = this.getSearchLimitInfo()
    const updatedLimitInfo: SearchLimitInfo = {
      ...limitInfo,
      isLoggedIn: false,
      remainingSearches: this.MAX_FREE_SEARCHES
    }
    
    localStorage.setItem(this.SEARCH_LIMIT_KEY, JSON.stringify(updatedLimitInfo))
  }

  // Get search limit info
  private getSearchLimitInfo(): SearchLimitInfo {
    if (typeof window === 'undefined') {
      return {
        remainingSearches: this.MAX_FREE_SEARCHES,
        totalSearches: 0,
        isLoggedIn: false,
        lastResetDate: null
      }
    }

    try {
      const stored = localStorage.getItem(this.SEARCH_LIMIT_KEY)
      if (!stored) {
        // First time user
        const initialInfo: SearchLimitInfo = {
          remainingSearches: this.MAX_FREE_SEARCHES,
          totalSearches: 0,
          isLoggedIn: false,
          lastResetDate: new Date().toISOString()
        }
        localStorage.setItem(this.SEARCH_LIMIT_KEY, JSON.stringify(initialInfo))
        return initialInfo
      }

      const limitInfo: SearchLimitInfo = JSON.parse(stored)
      
      // Check if 24 hours have passed for reset
      if (limitInfo.lastResetDate) {
        const lastReset = new Date(limitInfo.lastResetDate)
        const now = new Date()
        const timeDiff = now.getTime() - lastReset.getTime()
        
        if (timeDiff >= this.RESET_INTERVAL && !limitInfo.isLoggedIn) {
          // Reset searches
          const resetInfo: SearchLimitInfo = {
            remainingSearches: this.MAX_FREE_SEARCHES,
            totalSearches: 0,
            isLoggedIn: false,
            lastResetDate: new Date().toISOString()
          }
          localStorage.setItem(this.SEARCH_LIMIT_KEY, JSON.stringify(resetInfo))
          return resetInfo
        }
      }
      
      return limitInfo
    } catch (error) {
      console.error('Error getting search limit info:', error)
      return {
        remainingSearches: this.MAX_FREE_SEARCHES,
        totalSearches: 0,
        isLoggedIn: false,
        lastResetDate: new Date().toISOString()
      }
    }
  }

  // Add search record
  private addSearchRecord(query: string, page: 'factcheck' | 'mukti-corner' | 'mythbusting', userId?: string): void {
    try {
      const stored = localStorage.getItem(this.SEARCH_RECORDS_KEY)
      const records: SearchRecord[] = stored ? JSON.parse(stored) : []
      
      const newRecord: SearchRecord = {
        id: Date.now().toString(),
        query,
        page,
        timestamp: Date.now(),
        userId
      }
      
      // Keep only last 50 records
      const updatedRecords = [newRecord, ...records].slice(0, 50)
      localStorage.setItem(this.SEARCH_RECORDS_KEY, JSON.stringify(updatedRecords))
    } catch (error) {
      console.error('Error adding search record:', error)
    }
  }

  // Get search records
  getSearchRecords(): SearchRecord[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(this.SEARCH_RECORDS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error getting search records:', error)
      return []
    }
  }

  // Reset search limit (for testing)
  resetSearchLimit(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.SEARCH_LIMIT_KEY)
    localStorage.removeItem(this.SEARCH_RECORDS_KEY)
  }
}

// Export singleton instance
export const searchLimitManager = new SearchLimitManager()

// Convenience functions
export const canSearch = () => searchLimitManager.canSearch()
export const getRemainingSearches = () => searchLimitManager.getRemainingSearches()
export const recordSearch = (query: string, page: 'factcheck' | 'mukti-corner' | 'mythbusting', userId?: string) => 
  searchLimitManager.recordSearch(query, page, userId)
export const setLoggedIn = (userId: string) => searchLimitManager.setLoggedIn(userId)
export const setLoggedOut = () => searchLimitManager.setLoggedOut()
export const getSearchRecords = () => searchLimitManager.getSearchRecords()
export const resetSearchLimit = () => searchLimitManager.resetSearchLimit()
