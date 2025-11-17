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
      <Button
        variant={!activeCategory ? 'primary' : 'outline'}
        size="sm"
        onClick={() => handleCategoryClick(null)}
      >
        All
      </Button>
      {AI_CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          variant={activeCategory === cat.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(cat.value)}
          className={cn(
            'transition-all',
            activeCategory === cat.value && 'ring-2 ring-blue-500/50'
          )}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  )
}
