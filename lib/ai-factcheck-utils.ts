// Utility functions for AI FactCheck storage
export interface AIFactCheck {
  id: string
  query: string
  result: string
  timestamp: number
  verdict: 'true' | 'false' | 'misleading' | 'unverified'
  sources: Array<{
    id: number
    title: string
    url: string
    snippet: string
    language?: string
  }>
  sourceInfo?: {
    hasBengaliSources: boolean
    hasEnglishSources: boolean
    totalSources: number
  }
  generatedAt: string
}

export const addAIFactCheck = (query: string, result: string, verdict: AIFactCheck['verdict'], sources?: any[], sourceInfo?: any) => {
  try {
    const stored = localStorage.getItem('ai-fact-checks')
    const existingChecks: AIFactCheck[] = stored ? JSON.parse(stored) : []
    
    // Check if this exact query already exists to prevent duplicates
    const existingCheck = existingChecks.find(check => check.query === query)
    if (existingCheck) {
      console.log('Fact check for this query already exists, skipping duplicate')
      return true
    }
    
    // Also check for recent duplicates (within last 5 seconds) to prevent rapid duplicates
    const fiveSecondsAgo = Date.now() - 5000
    const recentDuplicate = existingChecks.find(check => 
      check.query === query && check.timestamp > fiveSecondsAgo
    )
    if (recentDuplicate) {
      console.log('Recent duplicate detected, skipping')
      return true
    }
    
    const newFactCheck: AIFactCheck = {
      id: Date.now().toString(),
      query,
      result,
      timestamp: Date.now(),
      verdict,
      sources: sources || [],
      sourceInfo: sourceInfo || {
        hasBengaliSources: false,
        hasEnglishSources: false,
        totalSources: 0
      },
      generatedAt: new Date().toISOString()
    }
    
    // Add new check at the beginning and keep only latest 10
    const updatedChecks = [newFactCheck, ...existingChecks.slice(0, 9)]
    localStorage.setItem('ai-fact-checks', JSON.stringify(updatedChecks))
    
    return true
  } catch (error) {
    console.error('Error adding AI fact check:', error)
    return false
  }
}

export const getAIFactChecks = (): AIFactCheck[] => {
  try {
    const stored = localStorage.getItem('ai-fact-checks')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting AI fact checks:', error)
    return []
  }
}

export const clearAIFactChecks = () => {
  try {
    localStorage.removeItem('ai-fact-checks')
    return true
  } catch (error) {
    console.error('Error clearing AI fact checks:', error)
    return false
  }
}
