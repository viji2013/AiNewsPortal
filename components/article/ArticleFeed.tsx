'use client'

import { useState, useEffect } from 'react'
import { ArticleCard } from './ArticleCard'
import { AddToCollectionModal } from './AddToCollectionModal'
import { ShareModal } from './ShareModal'
import { ArticleCardSkeleton } from '@/components/ui/Loading'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { Article } from '@/types/database'
import { toggleBookmark, isArticleSaved } from '@/app/actions/bookmarks'

interface ArticleFeedProps {
  initialArticles: Article[]
  userId?: string
  currentPage: number
  category?: string
  searchQuery?: string
}

export function ArticleFeed({
  initialArticles,
  userId,
  currentPage,
  category,
  searchQuery,
}: ArticleFeedProps) {
  const [articles, setArticles] = useState(initialArticles)
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
    if (category) params.set('category', category)
    if (searchQuery) params.set('q', searchQuery)
    
    window.location.href = `/feed?${params.toString()}`
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No articles found</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {searchQuery || category
              ? 'Try adjusting your filters or search query to find more articles'
              : 'Check back soon for the latest AI news and updates'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isBookmarked={bookmarkedIds.has(article.id)}
            onBookmark={handleBookmark}
            onShare={handleShare}
          />
        ))}
      </div>

      {/* Load More */}
      {articles.length >= 20 && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Articles'}
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
