'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Article } from '@/types/database'
import { formatDistanceToNow } from '@/lib/utils/date'

interface ArticleCardProps {
  article: Article
  isBookmarked: boolean
  onBookmark: (articleId: number) => Promise<void>
  onShare: (article: Article) => void
}

export function ArticleCard({ article, isBookmarked, onBookmark, onShare }: ArticleCardProps) {
  const [bookmarking, setBookmarking] = useState(false)

  const handleBookmark = async () => {
    setBookmarking(true)
    try {
      await onBookmark(article.id)
    } finally {
      setBookmarking(false)
    }
  }

  return (
    <Card className="group overflow-hidden hover:border-blue-500/50 transition-all duration-300">
      {/* Image */}
      {article.image_url && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-700">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardContent className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <Badge variant="primary">{article.category.toUpperCase()}</Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <span>{article.source || 'Unknown Source'}</span>
          <span>{formatDistanceToNow(article.published_at)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(article.url || '#', '_blank')}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read More
          </Button>

          <Button
            variant={isBookmarked ? 'primary' : 'ghost'}
            size="sm"
            onClick={handleBookmark}
            disabled={bookmarking}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            <svg
              className="w-5 h-5"
              fill={isBookmarked ? 'currentColor' : 'none'}
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
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShare(article)}
            aria-label="Share article"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </Button>
        </div>
        
        {/* Add to Collection button - shown on hover */}
        <button
          onClick={() => {
            // This will be handled by parent component
            const event = new CustomEvent('addToCollection', { detail: { article } })
            window.dispatchEvent(event)
          }}
          className="mt-2 w-full text-sm text-blue-400 hover:text-blue-300 transition-colors opacity-0 group-hover:opacity-100"
        >
          + Add to Collection
        </button>
      </CardContent>
    </Card>
  )
}
