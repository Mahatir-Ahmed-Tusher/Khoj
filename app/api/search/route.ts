import { NextRequest, NextResponse } from 'next/server'
import { tavilyManager } from '@/lib/tavily-manager'
import { PRIORITY_SITES } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    // Enhanced search strategy: Search within specific Bangladeshi news sites first
    const bangladeshiNewsSites = [
      'https://www.prothomalo.com',
      'https://www.bd-pratidin.com', 
      'https://www.jugantor.com',
      'https://www.kalerkantho.com',
      'https://www.samakal.com',
      'https://www.thedailystar.net',
      'https://www.bdnews24.com',
      'https://www.dhakatribune.com'
    ]

    let searchResults: any = { results: [] }
    let allResults: any[] = []

    // Step 1: Search within each major Bangladeshi news site individually
    for (const site of bangladeshiNewsSites) {
      try {
        const siteResults = await tavilyManager.search(query, {
          sites: [site],
          max_results: 5,
          search_depth: "advanced"
        })
        
        if (siteResults.results && siteResults.results.length > 0) {
          allResults.push(...siteResults.results)
        }
      } catch (error) {
        console.error(`Failed to search ${site}:`, error)
      }
    }

    // Step 2: If we don't have enough results from Bangladeshi sites, search within all priority sites
    if (allResults.length < 8) {
      try {
        const priorityResults = await tavilyManager.search(query, {
          sites: PRIORITY_SITES,
          max_results: 15,
          search_depth: "advanced"
        })
        
        if (priorityResults.results) {
          allResults.push(...priorityResults.results)
        }
      } catch (error) {
        console.error('Failed to search priority sites:', error)
      }
    }

    // Step 3: If still insufficient, fall back to general web search
    if (allResults.length < 5) {
      try {
        const generalResults = await tavilyManager.search(query, {
          max_results: 10,
          search_depth: "advanced"
        })
        
        if (generalResults.results) {
          allResults.push(...generalResults.results)
        }
      } catch (error) {
        console.error('Failed to search general web:', error)
      }
    }

    // Remove duplicates and limit results
    const uniqueResults = allResults.filter((result, index, self) => 
      index === self.findIndex(r => r.url === result.url)
    ).slice(0, 20)

    searchResults.results = uniqueResults

    return NextResponse.json({
      query,
      results: searchResults.results || [],
      totalResults: searchResults.results?.length || 0
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}
