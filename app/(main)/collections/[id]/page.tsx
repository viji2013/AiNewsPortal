import { getCollectionWithArticles } from '@/lib/supabase/queries'
import { getUser } from '@/lib/auth/actions'
import { CollectionDetail } from '@/components/article/CollectionDetail'
import { redirect, notFound } from 'next/navigation'

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const collectionId = parseInt(params.id)
  if (isNaN(collectionId)) {
    notFound()
  }

  const result = await getCollectionWithArticles(collectionId)

  if (!result) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <CollectionDetail
          collection={result.collection}
          initialArticles={result.articles}
          userId={user.id}
        />
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const collectionId = parseInt(params.id)
  const result = await getCollectionWithArticles(collectionId)

  if (!result) {
    return {
      title: 'Collection Not Found',
    }
  }

  return {
    title: `${result.collection.name} | Collections`,
    description: result.collection.description || 'View articles in this collection',
  }
}
