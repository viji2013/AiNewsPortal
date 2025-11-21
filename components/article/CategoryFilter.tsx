'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AI_CATEGORIES } from '@/types/database'
import { cn } from '@/lib/utils'

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoriesParam = searchParams.get('categories')
  const activeCategories = categoriesParam ? categoriesParam.split(',') : []

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    let newCategories: string[]
    
    if (activeCategories.includes(category)) {
      // Remove category
      newCategories = activeCategories.filter(c => c !== category)
    } else {
      // Add category
      newCategories = [...activeCategories, category]
    }
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','))
    } else {
      params.delete('categories')
    }
    
    // Reset to page 1 when category changes
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/feed?${queryString}` : '/feed'
    
    router.push(url, { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('categories')
    params.delete('page')
    
    const queryString = params.toString()
    const url = queryString ? `/feed?${queryString}` : '/feed'
    router.push(url, { scroll: false })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Categories {activeCategories.length > 0 && `(${activeCategories.length} selected)`}
        </span>
        {activeCategories.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {AI_CATEGORIES.map((cat) => {
          const isActive = activeCategories.includes(cat.value)
          return (
            <button
              key={cat.value}
              onClick={() => handleCategoryClick(cat.value)}
              className={cn(
                'px-4 py-2 font-semibold text-xs uppercase tracking-wide transition-all rounded-lg',
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {isActive && (
                <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
