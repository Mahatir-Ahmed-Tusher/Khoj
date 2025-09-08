// Create a shared types file
interface Source {
  id?: number
  title: string
  url: string
  snippet: string
  book_title?: string
  page?: number
  category?: string
  language?: string
  content_preview?: string
}

interface SearchHistory {
  id: string
  query: string
  response: string
  timestamp: Date
  verdict?: string
  summary?: string
  conclusion?: string
  keyTakeaways?: string[]
  category?: string
  subcategory?: string | null
  sources?: Source[]
  ourSiteArticles?: Source[]
}

export type { SearchHistory, Source }
