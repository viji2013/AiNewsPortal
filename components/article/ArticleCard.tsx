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

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop'

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

  // Single image URL - no duplicates
  const imageUrl = imageError || !article.image_url ? FALLBACK_IMAGE : article.image_url

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300">
      {/* SINGLE Large Image - InShorts Style - 16:9 aspect ratio */}
      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700">
        <Link href={`/article/${article.id}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
            onError={() => setImageError(true)}
            priority={false}
            quality={90}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
        
        {/* Category Badge - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-lg backdrop-blur-sm">
            {(article.category || 'AI NEWS').toUpperCase()}
          </span>
        </div>

        {/* Quick Actions - Top Right */}
        <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleBookmark}
            disabled={bookmarking}
            className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <svg
              className={`w-5 h-5 transition-colors ${
                isBookmarked 
                  ? 'fill-blue-600 text-blue-600' 
                  : 'text-slate-600 dark:text-slate-300'
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

          <button
            onClick={handleShare}
            className="p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all shadow-lg"
            aria-label="Share article"
          >
            <svg 
              className="w-5 h-5 text-slate-600 dark:text-slate-300" 
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

      {/* Content Section */}
      <div className="p-5 sm:p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="font-semibold text-slate-600 dark:text-slate-300">{article.source || 'AI News'}</span>
          <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-600" />
          <time className="font-medium">{formatDistanceToNow(article.published_at)}</time>
        </div>

        {/* Title - Large and Bold */}
        <Link href={`/article/${article.id}`}>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
            {article.title}
          </h2>
        </Link>

        {/* Summary - 2-3 lines */}
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed">
          {article.summary}
        </p>

        {/* Read More Link */}
        <Link 
          href={`/article/${article.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group/link"
        >
          <span>Read full story</span>
          <svg 
            className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </article>
  )
}
