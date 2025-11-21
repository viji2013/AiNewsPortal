'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { AI_CATEGORIES } from '@/types/database'

export function ActiveFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriesParam = searchParams.get('categories')
  const categories = categoriesParam ? categoriesParam.split(',') : []
  const searchQuery = searchParams.get('q')

  const hasFilters = categories.length > 0 || searchQuery

  if (!hasFilters) return null

  const removeCategory = (categoryToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const newCategories = categories.filter(c => c !== categoryToRemove)
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','))
    } else {
      params.delete('categories')
    }
    
    params.delete('page')
    router.push(`/feed?${params.toString()}`)
  }

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
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
    <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active filters:</span>
      
      {categories.map((category) => (
        <span key={category} className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          {getCategoryLabel(category)}
          <button
            onClick={() => removeCategory(category)}
            className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
            aria-label={`Remove ${getCategoryLabel(category)} filter`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      
      {searchQuery && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
          "{searchQuery}"
          <button
            onClick={clearSearch}
            className="hover:bg-blue-700 rounded-full p-0.5 transition-colors"
            aria-label="Remove search filter"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      )}
      
      <button
        onClick={clearAllFilters}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
      >
        Clear all
      </button>
    </div>
  )
}
