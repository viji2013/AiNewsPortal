'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateArticle(
  articleId: number,
  data: {
    title: string
    summary: string
    category: string
    source: string
    url: string
    image_url?: string
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  const { error } = await supabase
    .from('news_articles')
    .update({
      title: data.title,
      summary: data.summary,
      category: data.category,
      source: data.source,
      url: data.url,
      image_url: data.image_url || null,
    })
    .eq('id', articleId)

  if (error) throw error

  revalidatePath('/admin/articles')
  revalidatePath('/feed')
}

export async function deleteArticle(articleId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  const { error } = await supabase
    .from('news_articles')
    .delete()
    .eq('id', articleId)

  if (error) throw error

  revalidatePath('/admin/articles')
  revalidatePath('/feed')
}

export async function createSource(data: {
  name: string
  type: 'api' | 'rss' | 'custom'
  api_url: string | null
  is_active: boolean
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  const { error } = await supabase.from('sources').insert(data)

  if (error) throw error

  revalidatePath('/admin/sources')
}

export async function updateSource(
  sourceId: number,
  data: {
    name: string
    type: 'api' | 'rss' | 'custom'
    api_url: string | null
    is_active: boolean
  }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  const { error } = await supabase
    .from('sources')
    .update(data)
    .eq('id', sourceId)

  if (error) throw error

  revalidatePath('/admin/sources')
}

export async function deleteSource(sourceId: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }

  const { error } = await supabase.from('sources').delete().eq('id', sourceId)

  if (error) throw error

  revalidatePath('/admin/sources')
}
