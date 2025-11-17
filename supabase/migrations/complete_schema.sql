-- =====================================================
-- AI NEWS APP - COMPLETE DATABASE SCHEMA
-- =====================================================
-- High-performance Supabase PostgreSQL schema
-- Optimized for fast reads, minimal writes, and scalability
-- 
-- Tables: profiles, news_articles, saved_articles, sources, ai_activity_logs
-- Features: Row-Level Security, Full-text search, Optimized indexes
-- =====================================================

-- =====================================================
-- SECTION 1: TABLES
-- =====================================================

-- -----------------------------------------------------
-- PROFILES TABLE
-- -----------------------------------------------------
-- Extends Supabase Auth with custom user profile data
-- Linked 1:1 with auth.users table

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE profiles IS 'User profile data extending Supabase Auth';
COMMENT ON COLUMN profiles.id IS 'References auth.users.id, CASCADE deletes profile when user is deleted';
COMMENT ON COLUMN profiles.phone_number IS 'Unique phone number for OTP authentication';

-- -----------------------------------------------------
-- NEWS ARTICLES TABLE
-- -----------------------------------------------------
-- Stores news content with metadata for browsing and searching
-- Uses BIGINT for better indexing performance on high-volume data

CREATE TABLE news_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  source TEXT,
  url TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE news_articles IS 'News content storage optimized for read-heavy workloads';
COMMENT ON COLUMN news_articles.id IS 'BIGINT identity for better indexing performance vs UUID';
COMMENT ON COLUMN news_articles.published_at IS 'Business timestamp when article was published';

-- -----------------------------------------------------
-- SAVED ARTICLES TABLE
-- -----------------------------------------------------
-- Junction table for user bookmarking functionality
-- Links users to their saved articles with duplicate prevention

CREATE TABLE saved_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

COMMENT ON TABLE saved_articles IS 'Many-to-many junction table for user article bookmarks';
COMMENT ON COLUMN saved_articles.user_id IS 'References profiles.id, CASCADE deletes saves when user is deleted';
COMMENT ON COLUMN saved_articles.article_id IS 'References news_articles.id, CASCADE deletes saves when article is deleted';
COMMENT ON CONSTRAINT saved_articles_user_id_article_id_key ON saved_articles IS 'Prevents duplicate saves of same article by same user';

-- -----------------------------------------------------
-- SOURCES TABLE
-- -----------------------------------------------------
-- Manages news source configurations for content aggregation
-- Supports multiple source types: API, RSS, custom

CREATE TABLE sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

COMMENT ON TABLE sources IS 'News source configurations for content aggregation';
COMMENT ON COLUMN sources.type IS 'Source type: api, rss, or custom';
COMMENT ON COLUMN sources.api_url IS 'API endpoint or RSS feed URL';
COMMENT ON COLUMN sources.is_active IS 'Soft disable flag - FALSE disables source without deletion';

-- -----------------------------------------------------
-- AI ACTIVITY LOGS TABLE
-- -----------------------------------------------------
-- Tracks AI summarization operations for monitoring and cost analysis
-- Preserves logs even if associated article is deleted

CREATE TABLE ai_activity_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT REFERENCES news_articles(id) ON DELETE SET NULL,
  llm_provider TEXT NOT NULL,
  tokens_used INTEGER,
  cost_estimate NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE ai_activity_logs IS 'AI summarization activity tracking for monitoring and cost analysis';
COMMENT ON COLUMN ai_activity_logs.article_id IS 'References news_articles.id, SET NULL preserves logs if article deleted';
COMMENT ON COLUMN ai_activity_logs.llm_provider IS 'AI provider name (e.g., OpenAI, Anthropic, Gemini)';
COMMENT ON COLUMN ai_activity_logs.tokens_used IS 'Total tokens consumed in the AI operation';
COMMENT ON COLUMN ai_activity_logs.cost_estimate IS 'Estimated cost in USD with 6 decimal precision';

-- =====================================================
-- SECTION 2: INDEXES
-- =====================================================

-- -----------------------------------------------------
-- PROFILES INDEXES
-- -----------------------------------------------------

-- Index on phone_number for fast OTP-based authentication lookups
CREATE INDEX idx_profiles_phone_number ON profiles(phone_number);

COMMENT ON INDEX idx_profiles_phone_number IS 'Optimizes phone-based user lookups for authentication';

-- -----------------------------------------------------
-- NEWS ARTICLES INDEXES
-- -----------------------------------------------------

-- Index on category for fast filtering by news category
CREATE INDEX idx_news_articles_category ON news_articles(category);

-- Descending index on published_at for "latest news" queries
-- DESC order optimizes ORDER BY published_at DESC queries
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);

-- GIN index for full-text search on title and summary
-- Enables fast text search across article content
CREATE INDEX idx_news_articles_search ON news_articles 
  USING GIN (to_tsvector('english', title || ' ' || summary));

COMMENT ON INDEX idx_news_articles_category IS 'Optimizes category filtering queries';
COMMENT ON INDEX idx_news_articles_published_at IS 'Optimizes latest news queries with DESC order';
COMMENT ON INDEX idx_news_articles_search IS 'GIN index enables full-text search on title and summary';

-- -----------------------------------------------------
-- SAVED ARTICLES INDEXES
-- -----------------------------------------------------

-- Index on user_id for retrieving a user's saved articles
CREATE INDEX idx_saved_articles_user_id ON saved_articles(user_id);

-- Index on article_id for checking if an article is saved
CREATE INDEX idx_saved_articles_article_id ON saved_articles(article_id);

COMMENT ON INDEX idx_saved_articles_user_id IS 'Optimizes queries fetching user saved articles';
COMMENT ON INDEX idx_saved_articles_article_id IS 'Optimizes queries checking article save status';

-- -----------------------------------------------------
-- SOURCES INDEXES
-- -----------------------------------------------------

-- Index on is_active for filtering active sources
CREATE INDEX idx_sources_is_active ON sources(is_active);

COMMENT ON INDEX idx_sources_is_active IS 'Optimizes queries filtering for active sources only';

-- -----------------------------------------------------
-- AI ACTIVITY LOGS INDEXES
-- -----------------------------------------------------

-- Descending index on created_at for retrieving recent AI activity
CREATE INDEX idx_ai_activity_logs_created_at ON ai_activity_logs(created_at DESC);

COMMENT ON INDEX idx_ai_activity_logs_created_at IS 'Optimizes queries for recent AI activity with DESC order';

-- =====================================================
-- SECTION 3: TRIGGERS
-- =====================================================

-- -----------------------------------------------------
-- AUTO-UPDATE TRIGGER FOR PROFILES
-- -----------------------------------------------------

-- Trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires before UPDATE on profiles table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SECTION 4: ROW-LEVEL SECURITY POLICIES
-- =====================================================

-- -----------------------------------------------------
-- PROFILES RLS POLICIES
-- -----------------------------------------------------
-- Ensures users can only access and modify their own profile data
-- No DELETE policy - prevents profile deletion

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY profiles_select_own 
  ON profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY profiles_update_own 
  ON profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

COMMENT ON POLICY profiles_select_own ON profiles IS 'Users can SELECT only their own profile data';
COMMENT ON POLICY profiles_update_own ON profiles IS 'Users can UPDATE only their own profile data';

-- -----------------------------------------------------
-- SAVED ARTICLES RLS POLICIES
-- -----------------------------------------------------
-- Ensures users can only manage their own saved articles
-- Supports INSERT, SELECT, and DELETE operations

ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Users can view their own saved articles
CREATE POLICY saved_articles_select_own 
  ON saved_articles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can save articles to their own collection
CREATE POLICY saved_articles_insert_own 
  ON saved_articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can remove articles from their own collection
CREATE POLICY saved_articles_delete_own 
  ON saved_articles 
  FOR DELETE 
  USING (auth.uid() = user_id);

COMMENT ON POLICY saved_articles_select_own ON saved_articles IS 'Users can SELECT only their own saved articles';
COMMENT ON POLICY saved_articles_insert_own ON saved_articles IS 'Users can INSERT articles only to their own collection';
COMMENT ON POLICY saved_articles_delete_own ON saved_articles IS 'Users can DELETE only their own saved articles';

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
-- All tables, indexes, triggers, and RLS policies created
-- Ready for production deployment
-- =====================================================


-- =====================================================
-- SCHEMA EXTENSIONS FOR AI NEWS APP
-- =====================================================
-- Adds collections, role management, and user preferences

-- -----------------------------------------------------
-- EXTEND PROFILES TABLE
-- -----------------------------------------------------

-- Add role column for admin access control
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Add preferences column for category personalization
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT NULL;

-- Create index on role for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

COMMENT ON COLUMN profiles.role IS 'User role: user or admin';
COMMENT ON COLUMN profiles.preferences IS 'User preferences including category selections (JSONB)';

-- -----------------------------------------------------
-- COLLECTIONS TABLE
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS collections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE collections IS 'User-created collections for organizing saved articles';

-- -----------------------------------------------------
-- COLLECTION_ARTICLES JUNCTION TABLE
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS collection_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id BIGINT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, article_id)
);

COMMENT ON TABLE collection_articles IS 'Junction table linking collections to articles';

-- -----------------------------------------------------
-- COLLECTIONS INDEXES
-- -----------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_articles_collection_id ON collection_articles(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_articles_article_id ON collection_articles(article_id);

COMMENT ON INDEX idx_collections_user_id IS 'Optimizes queries fetching user collections';
COMMENT ON INDEX idx_collection_articles_collection_id IS 'Optimizes queries fetching articles in a collection';
COMMENT ON INDEX idx_collection_articles_article_id IS 'Optimizes queries checking which collections contain an article';

-- -----------------------------------------------------
-- COLLECTIONS TRIGGER
-- -----------------------------------------------------

CREATE TRIGGER IF NOT EXISTS set_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------
-- COLLECTIONS RLS POLICIES
-- -----------------------------------------------------

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY collections_select_own ON collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY collections_insert_own ON collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY collections_update_own ON collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY collections_delete_own ON collections FOR DELETE USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- COLLECTION_ARTICLES RLS POLICIES
-- -----------------------------------------------------

ALTER TABLE collection_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY collection_articles_select_own ON collection_articles FOR SELECT 
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_articles.collection_id AND collections.user_id = auth.uid()));

CREATE POLICY collection_articles_insert_own ON collection_articles FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_articles.collection_id AND collections.user_id = auth.uid()));

CREATE POLICY collection_articles_delete_own ON collection_articles FOR DELETE 
  USING (EXISTS (SELECT 1 FROM collections WHERE collections.id = collection_articles.collection_id AND collections.user_id = auth.uid()));
