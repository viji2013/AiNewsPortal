export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone_number: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: number
          title: string
          summary: string
          category: string | null
          source: string | null
          url: string | null
          image_url: string | null
          published_at: string
          created_at: string
        }
        Insert: {
          id?: never
          title: string
          summary: string
          category?: string | null
          source?: string | null
          url?: string | null
          image_url?: string | null
          published_at: string
          created_at?: string
        }
        Update: {
          id?: never
          title?: string
          summary?: string
          category?: string | null
          source?: string | null
          url?: string | null
          image_url?: string | null
          published_at?: string
          created_at?: string
        }
      }
      saved_articles: {
        Row: {
          id: number
          user_id: string
          article_id: number
          saved_at: string
        }
        Insert: {
          id?: never
          user_id: string
          article_id: number
          saved_at?: string
        }
        Update: {
          id?: never
          user_id?: string
          article_id?: number
          saved_at?: string
        }
      }
      collections: {
        Row: {
          id: number
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      collection_articles: {
        Row: {
          id: number
          collection_id: number
          article_id: number
          added_at: string
        }
        Insert: {
          id?: never
          collection_id: number
          article_id: number
          added_at?: string
        }
        Update: {
          id?: never
          collection_id?: number
          article_id?: number
          added_at?: string
        }
      }
      sources: {
        Row: {
          id: number
          name: string
          type: 'api' | 'rss' | 'custom'
          api_url: string | null
          is_active: boolean
        }
        Insert: {
          id?: never
          name: string
          type: 'api' | 'rss' | 'custom'
          api_url?: string | null
          is_active?: boolean
        }
        Update: {
          id?: never
          name?: string
          type?: 'api' | 'rss' | 'custom'
          api_url?: string | null
          is_active?: boolean
        }
      }
      ai_activity_logs: {
        Row: {
          id: number
          article_id: number | null
          llm_provider: string
          tokens_used: number | null
          cost_estimate: number | null
          created_at: string
        }
        Insert: {
          id?: never
          article_id?: number | null
          llm_provider: string
          tokens_used?: number | null
          cost_estimate?: number | null
          created_at?: string
        }
        Update: {
          id?: never
          article_id?: number | null
          llm_provider?: string
          tokens_used?: number | null
          cost_estimate?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
