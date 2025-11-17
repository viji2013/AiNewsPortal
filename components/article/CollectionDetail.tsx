'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArticleCard } from './ArticleCard'
import { ShareModal } from './ShareModal'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/Toast'
import type { Article, Collection } from '@/types/database'
import { removeArticleFromCollection } from '@/app/actions/collections'
import { useRouter } from 'next/navigation'

interface CollectionDetailProps {
  collection: Collection
  initialArticles: Article[]
  userId: string
}

export function CollectionDetail({ collection, initialArticles, userId }: CollectionDetailProps) {
  const [articles, setArticles] = useState(initialArticles)
  const { showToast, ToastContainer } = useToast()
  const router = useRouter()

  const handleRemoveArticle = async (articleId: number) => {
    try {
      await removeArticleFromCollection(collection.id, articleId)
      setArticles((prev) => prev.filter((article) => article.id !== articleId))
      showToast({ message: 'Article removed from collection', type: 'success' })
      router.refresh()
    } catch (error) {
      showToast({ message: 'Failed to remove article', type: 'error' })
    }
  }

  const [shareArticle, setShareArticle] = useState<Article | null>(null)

  const handleShare = (article: Article) => {
    setShareArticle(article)
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/collections"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Collections
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">{collection.name}</h1>
        {collection.description && (
          <p className="text-slate-400">{collection.description}</p>
        )}
        <p className="text-sm text-slate-500 mt-2">
          {articles.length} {articles.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {/* Articles */}
      {articles.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-white mb-2">No articles yet</h2>
            <p className="text-slate-400 mb-6">
              Add articles to this collection from the feed or saved articles
            </p>
            <Link href="/feed">
              <Button>Browse Articles</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="relative">
              <ArticleCard
                article={article}
                isBookmarked={true}
                onBookmark={() => handleRemoveArticle(article.id)}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
      
      <ShareModal
        isOpen={!!shareArticle}
        onClose={() => setShareArticle(null)}
        article={shareArticle}
      />
    </>
  )
}
