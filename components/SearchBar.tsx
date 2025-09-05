'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onSearch?: (query: string) => void
  'data-tour'?: string
}

const SearchBar = memo(function SearchBar({ 
  placeholder = "যেকোনো দাবি বা তথ্য লিখুন...", 
  className = "",
  onSearch,
  'data-tour': dataTour
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/factcheck-detail?query=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} data-tour={dataTour}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input pr-12"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md transition-colors duration-200"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
})

export default SearchBar
