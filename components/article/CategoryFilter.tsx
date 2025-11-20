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
    
    const queryString = params.toString()
    const url = queryString ? `/feed?${queryString}` : '/feed'
    
    // Use replace to avoid adding to history, then refresh
    router.push(url, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleCategoryClick(null)}
        className={cn(
          'px-4 py-2 font-semibold text-xs uppercase tracking-wide transition-colors',
          !activeCategory
            ? 'bg-slate-900 dark:bg-slate-700 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        )}
      >
        All
      </button>
      {AI_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryClick(cat.value)}
          className={cn(
            'px-4 py-2 font-semibold text-xs uppercase tracking-wide transition-colors',
            activeCategory === cat.value
              ? 'bg-slate-900 dark:bg-slate-700 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
