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
    <article className="group border-b border-slate-200 dark:border-slate-800 pb-6 mb-6 last:border-b-0">
      {/* Standard Image - Reuters Editorial Style - 16:9 aspect ratio */}
      <Link href={`/article/${article.id}`} className="block mb-4">
        <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
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
        </div>
      </Link>

      {/* Content - Reuters Editorial Style */}
      <div className="space-y-3">
        {/* Category & Meta */}
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 bg-slate-900 dark:bg-slate-700 text-white font-semibold uppercase tracking-wide">
            {article.category || 'AI'}
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {article.source || 'AI News'}
          </span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <time className="text-slate-500 dark:text-slate-400">
            {formatDistanceToNow(article.published_at)}
          </time>
        </div>

        {/* Headline - Reuters Style: Bold, Readable */}
        <Link href={`/article/${article.id}`}>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* Summary - Clean, readable */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
          {article.summary}
        </p>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-2">
          <Link 
            href={`/article/${article.id}`}
            className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Read more →
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              disabled={bookmarking}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <svg
                className={`w-5 h-5 ${
                  isBookmarked 
                    ? 'fill-slate-900 dark:fill-white' 
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
