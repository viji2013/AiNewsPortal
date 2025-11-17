import type { Database as DatabaseGenerated } from './database.types'

export type Database = DatabaseGenerated

// Table types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

// Specific table types for convenience
export type Article = Tables<'news_articles'>
export type Profile = Tables<'profiles'>
export type SavedArticle = Tables<'saved_articles'>
export type Collection = Tables<'collections'>
export type CollectionArticle = Tables<'collection_articles'>
export type Source = Tables<'sources'>
export type AIActivityLog = Tables<'ai_activity_logs'>
