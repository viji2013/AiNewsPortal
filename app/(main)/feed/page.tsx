import { getArticles, getProfile } from '@/lib/supabase/queries'
import { getUser } from '@/lib/auth/actions'
import { ArticleFeed } from '@/components/article/ArticleFeed'
import { SearchBar } from '@/components/article/SearchBar'
import { CategoryFilter } from '@/components/article/CategoryFilter'
import { ActiveFilters } from '@/components/article/ActiveFilters'
import { ArticleFeedSkeleton } from '@/components/article/ArticleCardSkeleton'
import { Suspense } from 'react'

interface FeedPageProps {
  searchParams: Promise<{
    categories?: string
    q?: string
    page?: string
  }>
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams
  const user = await getUser()
  const page = parseInt(params.page || '1')
  const limit = 100 // Fetch more for client-side filtering
  const offset = (page - 1) * limit

  // Get user profile for preferences
  const profile = user ? await getProfile(user.id) : null
  const preferences = profile?.preferences as { categories?: string[] } | null
  
  // Parse categories from URL
  const urlCategories = params.categories ? params.categories.split(',') : []
  
  // Apply category filter: URL param takes precedence, then preferences, then show all
  const categoriesFilter = urlCategories.length > 0
    ? urlCategories
    : preferences?.categories && preferences.categories.length > 0
    ? preferences.categories
    : undefined

  // Fetch ALL articles (or category-filtered) - search will be done client-side
  const articles = await getArticles({
    categories: categoriesFilter,
    limit,
    offset,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header - InShorts Style */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
            AI News Shorts
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400">
            Quick reads on the latest in artificial intelligence
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="max-w-2xl">
            <SearchBar />
          </div>
          
          <div>
            <CategoryFilter />
          </div>
          
          <ActiveFilters />
        </div>

        {/* Article Feed - Reuters Style */}
        <Suspense fallback={<ArticleFeedSkeleton count={6} />}>
          <ArticleFeed
            initialArticles={articles}
            userId={user?.id}
            currentPage={page}
            categories={params.categories}
          />
        </Suspense>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'AI News Feed | Stay Updated',
  description: 'Browse the latest AI news across LLMs, Computer Vision, Machine Learning, and more',
}

// Force dynamic rendering to ensure searchParams are always fresh
export const dynamic = 'force-dynamic'
