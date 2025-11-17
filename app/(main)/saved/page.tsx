import { getSavedArticles } from '@/lib/supabase/queries'
import { getUser } from '@/lib/auth/actions'
import { SavedArticlesList } from '@/components/article/SavedArticlesList'
import { redirect } from 'next/navigation'

export default async function SavedPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const savedArticles = await getSavedArticles(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Articles</h1>
          <p className="text-slate-400">
            {savedArticles.length} {savedArticles.length === 1 ? 'article' : 'articles'} saved
          </p>
        </div>

        <SavedArticlesList initialArticles={savedArticles} userId={user.id} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Saved Articles | AI News',
  description: 'Your bookmarked AI news articles',
}
