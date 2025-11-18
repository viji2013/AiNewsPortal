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

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop'

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

  // SINGLE image URL - guaranteed no duplicates
  const finalImageUrl = imageError || !article.image_url ? FALLBACK_IMAGE : article.image_url

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* InShorts-Style Image - Larger, more prominent */}
      <Link href={`/article/${article.id}`} className="block relative">
        <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={finalImageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            onError={() => setImageError(true)}
            priority={false}
            quality={85}
          />
          {/* Category badge overlay on image */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-wide rounded-full">
              {article.category || 'AI'}
            </span>
          </div>
        </div>
      </Link>

      {/* Content - InShorts Style */}
      <div className="p-5 sm:p-6 space-y-3">
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium">{article.source || 'AI News'}</span>
          <span>•</span>
          <time>{formatDistanceToNow(article.published_at)}</time>
        </div>

        {/* Headline - InShorts Style: Bold, Prominent */}
        <Link href={`/article/${article.id}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* Summary - Clean, readable */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <Link 
            href={`/article/${article.id}`}
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            Read full story
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <svg
                className={`w-5 h-5 ${
                  isBookmarked 
                    ? 'fill-blue-600 dark:fill-blue-400' 
                    : 'fill-none stroke-slate-400 dark:stroke-slate-500'
                }`}
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

            <button
              onClick={handleShare}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Share article"
            >
              <svg 
                className="w-5 h-5 stroke-slate-400 dark:stroke-slate-500" 
                fill="none" 
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
