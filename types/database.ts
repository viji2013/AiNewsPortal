export interface Article {
  id: number
  title: string
  summary: string
  category: string
  source: string
  url: string
  image_url: string | null
  published_at: string
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone_number: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  preferences: CategoryPreferences | null
  created_at: string
  updated_at: string
}

export interface SavedArticle {
  id: number
  user_id: string
  article_id: number
  saved_at: string
}

export interface Collection {
  id: number
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface CollectionArticle {
  id: number
  collection_id: number
  article_id: number
  added_at: string
}

export interface Source {
  id: number
  name: string
  type: 'api' | 'rss' | 'custom'
  api_url: string | null
  is_active: boolean
}

export interface AIActivityLog {
  id: number
  article_id: number | null
  llm_provider: string
  tokens_used: number | null
  cost_estimate: number | null
  created_at: string
}

export type CategoryPreferences = {
  categories: string[]
}

export type AICategory = 'llms' | 'cv' | 'ml' | 'agents' | 'nlp' | 'agi' | 'robotics'

export const AI_CATEGORIES: { value: string; label: string }[] = [
  { value: 'llms', label: 'LLMs' },
  { value: 'cv', label: 'Computer Vision' },
  { value: 'ml', label: 'Machine Learning' },
  { value: 'agents', label: 'AI Agents' },
  { value: 'nlp', label: 'NLP' },
  { value: 'agi', label: 'AGI' },
  { value: 'robotics', label: 'Robotics' },
]
