'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/types/database'
import { formatDistanceToNow } from '@/lib/utils/date'

interface ArticleCardProps {
  article: Article
  isBookmarked: boolean
  onBookmark: (articleId: number) => Promise<void>
  onShare: (article: Article) => void
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop'

export function ArticleCard({ article, isBookmarked, onBookmark, onShare }: ArticleCardProps) {
  const [bookmarking, setBookmarking] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setBookmarking(true)
    try {
      await onBookmark(article.id)
    } finally {
      setBookmarking(false)
    }
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onShare(article)
  }

  const imageUrl = imageError || !article.image_url ? FALLBACK_IMAGE : article.image_url

  return (
    <article className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container - 16:9 aspect ratio */}
      <Link href={`/article/${article.id}`} className="block relative aspect-video overflow-hidden bg-slate-200 dark:bg-slate-700">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
          priority={false}
        />
        
        {/* Category Badge - Overlay on image */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-lg">
            {(article.category || 'News').toUpperCase()}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium">{article.source || 'Unknown'}</span>
          <span>•</span>
          <time>{formatDistanceToNow(article.published_at)}</time>
        </div>

        {/* Title */}
        <Link href={`/article/${article.id}`}>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-1">
          {article.summary}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <Link 
            href={`/article/${article.id}`}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Read more →
          </Link>
          
          <div className="flex items-center gap-1">
            {/* Bookmark */}
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isBookmarked 
                    ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' 
                    : 'text-slate-400 dark:text-slate-500'
                }`}
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Share article"
            >
              <svg 
                className="w-5 h-5 text-slate-400 dark:text-slate-500" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
