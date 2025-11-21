'use client'

import { useState, useEffect, useMemo } from 'react'
import { ArticleCard } from './ArticleCard'
import { AddToCollectionModal } from './AddToCollectionModal'
import { ShareModal } from './ShareModal'
import { ArticleCardSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { Article } from '@/types/database'
import { toggleBookmark, isArticleSaved } from '@/app/actions/bookmarks'
import { deduplicateArticles } from '@/lib/utils/deduplication'
import { filterBySearch } from '@/lib/utils/articleFilters'

interface ArticleFeedProps {
  initialArticles: Article[]
  userId?: string
  currentPage: number
  categories?: string
  searchQuery?: string
}

export function ArticleFeed({
  initialArticles,
  userId,
  currentPage,
  categories,
  searchQuery,
}: ArticleFeedProps) {
  // Deduplicate articles by image URL
  const deduplicatedArticles = useMemo(() => deduplicateArticles(initialArticles), [initialArticles])
  
  // Apply client-side search filter
  const filteredArticles = useMemo(() => {
    console.log('ArticleFeed - Search Query:', searchQuery)
    console.log('ArticleFeed - Total articles before filter:', deduplicatedArticles.length)
    
    // If no search query, return all deduplicated articles
    if (!searchQuery || searchQuery.trim() === '') {
      return deduplicatedArticles
    }
    
    // Apply search filter
    const filtered = filterBySearch(deduplicatedArticles, searchQuery)
    console.log('ArticleFeed - Filtered articles:', filtered.length)
    return filtered
  }, [deduplicatedArticles, searchQuery])
  
  const [articles, setArticles] = useState(filteredArticles)
  const [showGoogleFallback, setShowGoogleFallback] = useState(false)
  
  // Update articles when filters change
  useEffect(() => {
    setArticles(filteredArticles)
    // Show Google fallback only if search query exists and no results found
    setShowGoogleFallback(filteredArticles.length === 0 && !!searchQuery && searchQuery.trim() !== '')
  }, [filteredArticles, searchQuery])
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [shareArticle, setShareArticle] = useState<Article | null>(null)
  const [collectionArticle, setCollectionArticle] = useState<Article | null>(null)
  const { showToast, ToastContainer } = useToast()

  // Load bookmarked status for all articles
  useEffect(() => {
    if (!userId) return

    const loadBookmarks = async () => {
      const bookmarked = new Set<number>()
      for (const article of articles) {
        const saved = await isArticleSaved(article.id)
        if (saved) bookmarked.add(article.id)
      }
      setBookmarkedIds(bookmarked)
    }

    loadBookmarks()
  }, [articles, userId])

  // Listen for add to collection events
  useEffect(() => {
    const handleAddToCollection = (event: any) => {
      setCollectionArticle(event.detail.article)
    }

    window.addEventListener('addToCollection', handleAddToCollection)
    return () => window.removeEventListener('addToCollection', handleAddToCollection)
  }, [])

  const handleBookmark = async (articleId: number) => {
    if (!userId) {
      showToast({ message: 'Please sign in to bookmark articles', type: 'warning' })
      return
    }

    try {
      await toggleBookmark(articleId)
      
      setBookmarkedIds((prev) => {
        const next = new Set(prev)
        if (next.has(articleId)) {
          next.delete(articleId)
          showToast({ message: 'Bookmark removed', type: 'success' })
        } else {
          next.add(articleId)
          showToast({ message: 'Article bookmarked', type: 'success' })
        }
        return next
      })
    } catch (error) {
      showToast({ message: 'Failed to update bookmark', type: 'error' })
    }
  }

  const handleShare = (article: Article) => {
    setShareArticle(article)
  }

  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    const params = new URLSearchParams()
    params.set('page', nextPage.toString())
    if (categories) params.set('categories', categories)
    if (searchQuery) params.set('q', searchQuery)
    
    window.location.href = `/feed?${params.toString()}`
  }

  // Handle Google search fallback
  const handleGoogleSearch = () => {
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' AI news')}`
      window.open(searchUrl, '_blank', 'noopener,noreferrer')
    }
  }

  if (articles.length === 0) {
    return (
      <div className="py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-slate-400 dark:text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No local results found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {searchQuery
              ? `No articles match "${searchQuery}". Try searching the web for more results.`
              : categories
              ? 'Try adjusting your category filters to find more articles'
              : 'Check back soon for the latest AI news and updates'}
          </p>
          
          {/* Google Search Fallback */}
          {showGoogleFallback && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  💡 No local results found. Search the web for "{searchQuery}"?
                </p>
                <button
                  onClick={handleGoogleSearch}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search on Google
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Reuters-style responsive grid - max-width container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={`article-${article.id}`}
              article={article}
              isBookmarked={bookmarkedIds.has(article.id)}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          ))}
        </div>
      </div>

      {/* Load More */}
      {articles.length >= 20 && (
        <div className="mt-16 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More Stories'
            )}
          </button>
        </div>
      )}

      <ToastContainer />
      
      {userId && (
        <AddToCollectionModal
          isOpen={!!collectionArticle}
          onClose={() => setCollectionArticle(null)}
          article={collectionArticle}
          userId={userId}
        />
      )}
      
      <ShareModal
        isOpen={!!shareArticle}
        onClose={() => setShareArticle(null)}
        article={shareArticle}
      />
    </>
  )
}
