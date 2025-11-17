import { getCollections } from '@/lib/supabase/queries'
import { getUser } from '@/lib/auth/actions'
import { CollectionsList } from '@/components/article/CollectionsList'
import { redirect } from 'next/navigation'

export default async function CollectionsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const collections = await getCollections(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Collections</h1>
          <p className="text-slate-400">
            Organize your saved articles into collections
          </p>
        </div>

        <CollectionsList initialCollections={collections} userId={user.id} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Collections | AI News',
  description: 'Organize your AI news articles into collections',
}
