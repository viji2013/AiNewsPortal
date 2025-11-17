'use client'

import { useState } from 'react'
import { ArticleCard } from './ArticleCard'
import { ShareModal } from './ShareModal'
import { useToast } from '@/components/ui/Toast'
import type { Article } from '@/types/database'
import { toggleBookmark } from '@/app/actions/bookmarks'
import { useRouter } from 'next/navigation'

interface SavedArticlesListProps {
  initialArticles: Article[]
  userId: string
}

export function SavedArticlesList({ initialArticles, userId }: SavedArticlesListProps) {
  const [articles, setArticles] = useState(initialArticles)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const handleRemoveBookmark = async (articleId: number) => {
    try {
      await toggleBookmark(articleId)
      
      // Remove from local state
      setArticles((prev) => prev.filter((article) => article.id !== articleId))
      
      showToast({ message: 'Article removed from saved', type: 'success' })
      router.refresh()
    } catch (error) {
      showToast({ message: 'Failed to remove bookmark', type: 'error' })
    }
  }

  const [shareArticle, setShareArticle] = useState<Article | null>(null)

  const handleShare = (article: Article) => {
    setShareArticle(article)
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-white mb-2">No saved articles yet</h2>
          <p className="text-slate-400 mb-6">
            Start bookmarking articles from the feed to see them here
          </p>
          <a
            href="/feed"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Articles
          </a>
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
            isBookmarked={true}
            onBookmark={handleRemoveBookmark}
            onShare={handleShare}
          />
        ))}
      </div>
      <ToastContainer />
      
      <ShareModal
        isOpen={!!shareArticle}
        onClose={() => setShareArticle(null)}
        article={shareArticle}
      />
    </>
  )
}
