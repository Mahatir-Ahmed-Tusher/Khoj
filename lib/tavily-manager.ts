import { tavily } from '@tavily/core'

interface TavilyClient {
  client: any
  apiKey: string
  isActive: boolean
  monthlyUsage: number
  lastUsed: Date
}

class TavilyManager {
  private clients: TavilyClient[] = []
  private currentIndex = 0

  constructor() {
    this.initializeClients()
  }

  private initializeClients() {
    // Primary key
    if (process.env.TAVILY_API_KEY) {
      this.clients.push({
        client: tavily({ apiKey: process.env.TAVILY_API_KEY }),
        apiKey: process.env.TAVILY_API_KEY,
        isActive: true,
        monthlyUsage: 0,
        lastUsed: new Date()
      })
    }

    // Fallback keys (2-16)
    for (let i = 2; i <= 16; i++) {
      const key = process.env[`TAVILY_API_KEY_${i}`]
      if (key) {
        this.clients.push({
          client: tavily({ apiKey: key }),
          apiKey: key,
          isActive: true,
          monthlyUsage: 0,
          lastUsed: new Date()
        })
      }
    }

    console.log(`🚀 Tavily Manager initialized with ${this.clients.length} API keys`)
  }

  private getNextAvailableClient(): TavilyClient | null {
    // Try current index first
    if (this.clients[this.currentIndex]?.isActive) {
      return this.clients[this.currentIndex]
    }

    // Find next available client
    for (let i = 0; i < this.clients.length; i++) {
      const client = this.clients[i]
      if (client.isActive && client.monthlyUsage < 100) {
        this.currentIndex = i
        return client
      }
    }

    // If all clients are at limit, reset usage and start over
    this.resetMonthlyUsage()
    return this.clients[0] || null
  }

  private resetMonthlyUsage() {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    this.clients.forEach(client => {
      if (client.lastUsed < firstDayOfMonth) {
        client.monthlyUsage = 0
        client.isActive = true
      }
    })
  }

  async search(query: string, options: any = {}) {
    const client = this.getNextAvailableClient()
    
    if (!client) {
      throw new Error('No available Tavily API keys')
    }

    try {
      console.log(`🔑 Using Tavily API key ${this.currentIndex + 1} (${client.apiKey.slice(0, 8)}...)`)
      
      const result = await client.client.search(query, options)
      
      // Update usage stats
      client.monthlyUsage++
      client.lastUsed = new Date()
      
      console.log(`✅ Search successful with key ${this.currentIndex + 1}. Monthly usage: ${client.monthlyUsage}/100`)
      
      return result
    } catch (error: any) {
      // Check if it's a rate limit error
      if (error.message?.includes('rate limit') || error.message?.includes('quota') || error.status === 429) {
        console.log(`⚠️ Rate limit hit for key ${this.currentIndex + 1}, deactivating...`)
        client.isActive = false
        client.monthlyUsage = 100 // Mark as exhausted
        
        // Try with next available client
        return this.search(query, options)
      }
      
      throw error
    }
  }

  async crawl(url: string, options: any = {}) {
    const client = this.getNextAvailableClient()
    
    if (!client) {
      throw new Error('No available Tavily API keys')
    }

    try {
      console.log(`🔑 Using Tavily API key ${this.currentIndex + 1} for crawling`)
      
      const result = await client.client.crawl(url, options)
      
      // Update usage stats
      client.monthlyUsage++
      client.lastUsed = new Date()
      
      return result
    } catch (error: any) {
      if (error.message?.includes('rate limit') || error.message?.includes('quota') || error.status === 429) {
        console.log(`⚠️ Rate limit hit for key ${this.currentIndex + 1}, deactivating...`)
        client.isActive = false
        client.monthlyUsage = 100
        
        return this.crawl(url, options)
      }
      
      throw error
    }
  }

  getStatus() {
    return {
      totalKeys: this.clients.length,
      activeKeys: this.clients.filter(c => c.isActive).length,
      currentKeyIndex: this.currentIndex,
      keyStatus: this.clients.map((client, index) => ({
        index: index + 1,
        isActive: client.isActive,
        monthlyUsage: client.monthlyUsage,
        lastUsed: client.lastUsed
      }))
    }
  }
}

// Export singleton instance
export const tavilyManager = new TavilyManager()
