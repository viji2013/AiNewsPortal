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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            AI News Feed
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Stay updated with the latest in artificial intelligence
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

        {/* Article Feed */}
        <Suspense fallback={<ArticleFeedSkeleton count={9} />}>
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
