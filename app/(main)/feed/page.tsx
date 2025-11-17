import { getArticles, getProfile } from '@/lib/supabase/queries'
import { getUser } from '@/lib/auth/actions'
import { ArticleFeed } from '@/components/article/ArticleFeed'
import { SearchBar } from '@/components/article/SearchBar'
import { CategoryFilter } from '@/components/article/CategoryFilter'
import { ActiveFilters } from '@/components/article/ActiveFilters'
import { PageLoader } from '@/components/ui/Loading'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="max-w-2xl">
            <SearchBar />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-slate-400 mb-3">Filter by Category</h3>
            <CategoryFilter />
          </div>
          
          <ActiveFilters />
        </div>

        {/* Article Feed */}
        <Suspense fallback={<PageLoader />}>
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
