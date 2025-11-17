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
      <div className="py-16">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto text-slate-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-white mb-2">No articles found</h2>
          <p className="text-slate-400">
            {searchQuery || category
              ? 'Try adjusting your filters or search query'
              : 'Check back later for new content'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <Button onClick={handleLoadMore} disabled={loading} size="lg">
            {loading ? 'Loading...' : 'Load More Articles'}
          </Button>
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
