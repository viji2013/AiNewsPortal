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
    category?: string
    q?: string
    page?: string
  }>
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams
  const user = await getUser()
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  // Get user profile for preferences
  const profile = user ? await getProfile(user.id) : null
  const preferences = profile?.preferences as { categories?: string[] } | null
  
  // Apply category filter: URL param takes precedence, then preferences, then show all
  const categoryFilter = params.category
  const categoriesFilter = !categoryFilter && preferences?.categories && preferences.categories.length > 0
    ? preferences.categories
    : undefined

  // Fetch articles with filters
  const articles = await getArticles({
    category: categoryFilter,
    categories: categoriesFilter,
    searchQuery: params.q,
    limit,
    offset,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 max-w-7xl">
        {/* Header - InShorts Style */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-3">
            AI News Shorts
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Quick reads on the latest in artificial intelligence
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-5">
          <div className="max-w-2xl mx-auto sm:mx-0">
            <SearchBar />
          </div>
          
          <div>
            <CategoryFilter />
          </div>
          
          <ActiveFilters />
        </div>

        {/* Article Feed - InShorts Style */}
        <Suspense fallback={<ArticleFeedSkeleton count={6} />}>
          <ArticleFeed
            initialArticles={articles}
            userId={user?.id}
            currentPage={page}
            category={params.category}
            searchQuery={params.q}
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

// Revalidate every 5 minutes
export const revalidate = 300
