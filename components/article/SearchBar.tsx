'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [searchMode, setSearchMode] = useState<'local' | 'global'>(
    searchParams.get('mode') === 'global' ? 'global' : 'local'
  )
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
      params.set('mode', searchMode)
    } else {
      params.delete('q')
      params.delete('mode')
    }
    
    // Reset to page 1 when search changes
    params.delete('page')
    
    router.push(`/feed?${params.toString()}`)
  }, [debouncedQuery, searchMode, router, searchParams])

  const handleGlobalSearch = () => {
    if (query.trim()) {
      // Open Google search in new tab
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' AI news')}`
      window.open(searchUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="search"
          placeholder={searchMode === 'local' ? "Search articles..." : "Search AI news globally..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchMode === 'global') {
              handleGlobalSearch()
            }
          }}
          className="w-full pl-11 pr-32 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {searchMode === 'global' && query && (
            <button
              onClick={handleGlobalSearch}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Search on Google"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          )}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      {/* Search Mode Toggle */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400">Search:</span>
        <button
          onClick={() => setSearchMode('local')}
          className={`px-3 py-1 rounded-full font-medium transition-colors ${
            searchMode === 'local'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          This Site
        </button>
        <button
          onClick={() => setSearchMode('global')}
          className={`px-3 py-1 rounded-full font-medium transition-colors ${
            searchMode === 'global'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Web (Google)
        </button>
      </div>
    </div>
  )
}
