import { createClient } from './server'
import type { Article, Profile, SavedArticle, Collection } from '@/types/supabase'

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return data
}

/**
 * Get articles with optional filtering
 */
export async function getArticles(options?: {
  category?: string
  categories?: string[]
  searchQuery?: string
  limit?: number
  offset?: number
}): Promise<Article[]> {
  const supabase = await createClient()
  const { category, categories, searchQuery, limit = 20, offset = 0 } = options || {}

  let query = supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  } else if (categories && categories.length > 0) {
    query = query.in('category', categories)
  }

  if (searchQuery) {
    query = query.textSearch('title,summary', searchQuery)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

/**
 * Get saved articles for a user
 */
export async function getSavedArticles(userId: string): Promise<Article[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_articles')
    .select('article_id, news_articles(*)')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })

  if (error) {
    console.error('Error fetching saved articles:', error)
    return []
  }

  return (data?.map((item: any) => item.news_articles) || []) as Article[]
}

/**
 * Check if article is saved by user
 */
export async function isArticleSaved(
  userId: string,
  articleId: number
): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_articles')
    .select('id')
    .eq('user_id', userId)
    .eq('article_id', articleId)
    .single()

  return !error && !!data
}

/**
 * Get user's collections
 */
export async function getCollections(userId: string): Promise<Collection[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching collections:', error)
    return []
  }

  return data || []
}

/**
 * Get collection with articles
 */
export async function getCollectionWithArticles(
  collectionId: number
): Promise<{ collection: Collection; articles: Article[] } | null> {
  const supabase = await createClient()

  // Get collection
  const { data: collection, error: collectionError } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single()

  if (collectionError || !collection) {
    console.error('Error fetching collection:', collectionError)
    return null
  }

  // Get articles in collection
  const { data: collectionArticles, error: articlesError } = await supabase
    .from('collection_articles')
    .select('article_id, news_articles(*)')
    .eq('collection_id', collectionId)
    .order('added_at', { ascending: false })

  if (articlesError) {
    console.error('Error fetching collection articles:', articlesError)
    return { collection, articles: [] }
  }

  const articles = (collectionArticles?.map((item: any) => item.news_articles) || []) as Article[]

  return { collection, articles }
}

/**
 * Get active sources
 */
export async function getActiveSources() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching sources:', error)
    return []
  }

  return data || []
}
