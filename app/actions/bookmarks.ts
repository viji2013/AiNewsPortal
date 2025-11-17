'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(articleId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('saved_articles')
    .select('id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .single()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', existing.id)

    if (error) throw error
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('saved_articles')
      .insert({ user_id: user.id, article_id: articleId })

    if (error) throw error
  }

  revalidatePath('/feed')
  revalidatePath('/saved')
}

export async function isArticleSaved(articleId: number): Promise<boolean> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data } = await supabase
    .from('saved_articles')
    .select('id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .single()

  return !!data
}
