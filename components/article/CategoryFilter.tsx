'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AI_CATEGORIES } from '@/types/database'
import { cn } from '@/lib/utils'

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    // Reset to page 1 when category changes
    params.delete('page')
    
    router.push(`/feed?${params.toString()}`)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'px-4 py-2 rounded-lg font-medium text-sm transition-all',
          !activeCategory
            ? 'bg-blue-600 text-white shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500'
        )}
      >
        All
      </button>
      {AI_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryClick(cat.value)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium text-sm transition-all',
            activeCategory === cat.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
