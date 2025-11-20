import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils/date'
import type { Database } from '@/types/database.types'

type NewsArticle = Database['public']['Tables']['news_articles']['Row']

interface ArticlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const articleId = parseInt(id)

  if (isNaN(articleId)) {
    notFound()
  }

  const { data: article, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', articleId)
    .single()

  if (error || !article) {
    notFound()
  }

  const typedArticle = article as NewsArticle

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/feed"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Feed
        </Link>

        <article className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
          <div className="mb-6">
            <Badge variant="primary" className="mb-4">
              {(typedArticle.category || 'uncategorized').toUpperCase()}
            </Badge>
            <h1 className="text-4xl font-bold text-white mb-4">{typedArticle.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{typedArticle.source || 'Unknown Source'}</span>
              <span>•</span>
              <span>{formatDate(typedArticle.published_at)}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300 leading-relaxed">{typedArticle.summary}</p>
          </div>

          {typedArticle.url && (
            <div className="mt-8 pt-8 border-t border-slate-700">
              <a
                href={typedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Read Full Article
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()
  const articleId = parseInt(id)

  if (isNaN(articleId)) {
    return {
      title: 'Article Not Found',
    }
  }

  const { data: article } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', articleId)
    .single()

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  const typedArticle = article as NewsArticle
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const ogImageUrl = `${appUrl}/api/og?title=${encodeURIComponent(typedArticle.title)}&summary=${encodeURIComponent(typedArticle.summary)}&category=${encodeURIComponent(typedArticle.category || 'uncategorized')}`

  return {
    title: `${typedArticle.title} | AI News`,
    description: typedArticle.summary,
    openGraph: {
      title: typedArticle.title,
      description: typedArticle.summary,
      type: 'article',
      publishedTime: typedArticle.published_at,
      authors: [typedArticle.source || 'AI News'],
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: typedArticle.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: typedArticle.title,
      description: typedArticle.summary,
      images: [ogImageUrl],
    },
  }
}
