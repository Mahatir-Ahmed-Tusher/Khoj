// Create a shared types file
interface Source {
  title: string
  url: string
  snippet: string
}

interface SearchHistory {
  id: string
  query: string
  response: string
  timestamp: Date
  verdict?: string
  summary?: string
  category?: string
  subcategory?: string | null
  sources?: Source[]
  ourSiteArticles?: Source[]
}

export type { SearchHistory, Source }
