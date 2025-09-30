// RapidAPI Key Management with Fallback System
export class RapidAPIKeyManager {
  private static instance: RapidAPIKeyManager
  private keys: string[] = []
  private currentKeyIndex: number = 0
  private failedKeys: Set<number> = new Set()

  private constructor() {
    // Initialize all available API keys
    this.keys = [
      process.env.APP_KEY,
      process.env.APP_KEY_2,
      process.env.APP_KEY_3,
      process.env.APP_KEY_4,
      process.env.APP_KEY_5,
      process.env.APP_KEY_6,
      process.env.APP_KEY_7,
      process.env.APP_KEY_8,
      process.env.APP_KEY_9,
      process.env.APP_KEY_10,
      process.env.APP_KEY_11,
      process.env.APP_KEY_12,
      process.env.APP_KEY_13,
      process.env.APP_KEY_14,
      process.env.APP_KEY_15
    ].filter(Boolean) as string[] // Remove undefined keys

    console.log(`🔑 RapidAPI Key Manager initialized with ${this.keys.length} keys`)
  }

  public static getInstance(): RapidAPIKeyManager {
    if (!RapidAPIKeyManager.instance) {
      RapidAPIKeyManager.instance = new RapidAPIKeyManager()
    }
    return RapidAPIKeyManager.instance
  }

  public getCurrentKey(): string | null {
    if (this.keys.length === 0) {
      console.error('❌ No RapidAPI keys configured')
      return null
    }

    const key = this.keys[this.currentKeyIndex]
    console.log(`🔑 Using RapidAPI key ${this.currentKeyIndex + 1}/${this.keys.length}`)
    return key
  }

  public markKeyAsFailed(): void {
    console.log(`❌ Marking key ${this.currentKeyIndex + 1} as failed`)
    this.failedKeys.add(this.currentKeyIndex)
    this.moveToNextKey()
  }

  private moveToNextKey(): void {
    const originalIndex = this.currentKeyIndex
    
    do {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length
    } while (this.failedKeys.has(this.currentKeyIndex) && this.failedKeys.size < this.keys.length)

    if (this.failedKeys.size >= this.keys.length) {
      console.error('❌ All RapidAPI keys have failed')
      return
    }

    if (originalIndex !== this.currentKeyIndex) {
      console.log(`🔄 Switched to RapidAPI key ${this.currentKeyIndex + 1}/${this.keys.length}`)
    }
  }

  public getAvailableKeysCount(): number {
    return this.keys.length - this.failedKeys.size
  }

  public resetFailedKeys(): void {
    console.log('🔄 Resetting all failed keys')
    this.failedKeys.clear()
    this.currentKeyIndex = 0
  }

  public getKeyStatus(): { total: number; failed: number; current: number; available: number } {
    return {
      total: this.keys.length,
      failed: this.failedKeys.size,
      current: this.currentKeyIndex + 1,
      available: this.getAvailableKeysCount()
    }
  }
}

// Enhanced RapidAPI search function with fallback
export async function searchWithRapidAPIFallback(query: string, limit: number = 20): Promise<any> {
  const keyManager = RapidAPIKeyManager.getInstance()
  const maxRetries = keyManager.getAvailableKeysCount()

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = keyManager.getCurrentKey()
    if (!apiKey) {
      console.error('❌ No valid RapidAPI key available')
      return null
    }

    try {
      console.log(`🔍 Attempt ${attempt + 1}/${maxRetries}: Searching with RapidAPI (google-search74)...`)
      
      const params = new URLSearchParams({
        query: query,
        limit: limit.toString(),
        related_keywords: 'true'
      })
      
      const response = await fetch(`https://google-search74.p.rapidapi.com/?${params}`, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'google-search74.p.rapidapi.com'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Success with key ${keyManager['currentKeyIndex'] + 1}: Found ${data.results?.length || 0} results`)
        return data
      } else {
        console.log(`❌ Key ${keyManager['currentKeyIndex'] + 1} failed with status: ${response.status}`)
        keyManager.markKeyAsFailed()
      }
    } catch (error) {
      console.error(`❌ Key ${keyManager['currentKeyIndex'] + 1} error:`, error)
      keyManager.markKeyAsFailed()
    }
  }

  console.error('❌ All RapidAPI keys exhausted')
  return null
}

// Alternative RapidAPI search with fallback
export async function searchWithRapidAPIFallbackAlternative(query: string, num: number = 10): Promise<any> {
  const keyManager = RapidAPIKeyManager.getInstance()
  const maxRetries = keyManager.getAvailableKeysCount()

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = keyManager.getCurrentKey()
    if (!apiKey) {
      console.error('❌ No valid RapidAPI key available')
      return null
    }

    try {
      console.log(`🔍 Attempt ${attempt + 1}/${maxRetries}: Trying alternative RapidAPI (google-search3)...`)
      
      const response = await fetch('https://google-search3.p.rapidapi.com/api/v1/search/q=' + encodeURIComponent(query) + '&num=' + num, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': 'google-search3.p.rapidapi.com'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ Success with key ${keyManager['currentKeyIndex'] + 1}: Found ${data.results?.length || 0} results`)
        return data
      } else {
        console.log(`❌ Key ${keyManager['currentKeyIndex'] + 1} failed with status: ${response.status}`)
        keyManager.markKeyAsFailed()
      }
    } catch (error) {
      console.error(`❌ Key ${keyManager['currentKeyIndex'] + 1} error:`, error)
      keyManager.markKeyAsFailed()
    }
  }

  console.error('❌ All RapidAPI keys exhausted')
  return null
}

// Get API key status for monitoring
export function getRapidAPIStatus() {
  const keyManager = RapidAPIKeyManager.getInstance()
  return keyManager.getKeyStatus()
}
