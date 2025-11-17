'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AI_CATEGORIES } from '@/types/database'

export function ActiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const searchQuery = searchParams.get('q')

  const hasFilters = category || searchQuery

  if (!hasFilters) return null

  const clearFilter = (filterType: 'category' | 'search') => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (filterType === 'category') {
      params.delete('category')
    } else {
      params.delete('q')
    }
    
    params.delete('page')
    router.push(`/feed?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push('/feed')
  }

  const getCategoryLabel = (value: string) => {
    return AI_CATEGORIES.find((cat) => cat.value === value)?.label || value
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-400">Active filters:</span>
      
      {category && (
        <Badge variant="primary" className="flex items-center gap-1.5">
          <span>Category: {getCategoryLabel(category)}</span>
          <button
            onClick={() => clearFilter('category')}
            className="hover:text-white transition-colors"
            aria-label="Remove category filter"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Badge>
      )}
      
      {searchQuery && (
        <Badge variant="primary" className="flex items-center gap-1.5">
          <span>Search: "{searchQuery}"</span>
          <button
            onClick={() => clearFilter('search')}
            className="hover:text-white transition-colors"
            aria-label="Remove search filter"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </Badge>
      )}
      
      <button
        onClick={clearAllFilters}
        className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
      >
        Clear all
      </button>
    </div>
  )
}
