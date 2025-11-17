'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Collection } from '@/types/database'

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }

  return data || []
}

export async function createCollection(data: {
  name: string
  description: string | null
}): Promise<Collection> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .insert({
      user_id: user.id,
      name: data.name,
      description: data.description,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/collections')
  return collection
}

export async function deleteCollection(collectionId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId)
    .eq('user_id', user.id)

  if (error) throw error

  revalidatePath('/collections')
}

export async function addArticleToCollection(collectionId: number, articleId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify collection belongs to user
  const { data: collection } = await supabase
    .from('collections')
    .select('id')
    .eq('id', collectionId)
    .eq('user_id', user.id)
    .single()

  if (!collection) {
    throw new Error('Collection not found')
  }

  const { error } = await supabase
    .from('collection_articles')
    .insert({
      collection_id: collectionId,
      article_id: articleId,
    })

  if (error) throw error

  revalidatePath(`/collections/${collectionId}`)
}

export async function removeArticleFromCollection(collectionId: number, articleId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('collection_articles')
    .delete()
    .eq('collection_id', collectionId)
    .eq('article_id', articleId)

  if (error) throw error

  revalidatePath(`/collections/${collectionId}`)
}
