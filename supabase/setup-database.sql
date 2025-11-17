-- AI News App - Complete Database Setup
-- Run this script in Supabase SQL Editor to set up the entire database

-- ============================================================================
-- 1. CREATE PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for phone number lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON profiles(phone_number);

-- Trigger function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. CREATE NEWS_ARTICLES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS news_articles (
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_articles_search ON news_articles USING GIN (to_tsvector('english', title || ' ' || summary));

-- ============================================================================
-- 3. CREATE SAVED_ARTICLES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_article_id ON saved_articles(article_id);

-- ============================================================================
-- 4. CREATE SOURCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('api', 'rss', 'custom')),
  api_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Index
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);

-- ============================================================================
-- 5. CREATE AI_ACTIVITY_LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_activity_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT REFERENCES news_articles(id) ON DELETE SET NULL,
  llm_provider TEXT NOT NULL,
  tokens_used INTEGER,
  cost_estimate NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_ai_activity_logs_created_at ON ai_activity_logs(created_at DESC);

-- ============================================================================
-- 6. CREATE COLLECTIONS TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS collections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);

-- Trigger for collections
DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS collection_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id BIGINT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, article_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_articles_collection_id ON collection_articles(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_articles_article_id ON collection_articles(article_id);

-- ============================================================================
-- 7. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_articles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 8. CREATE RLS POLICIES FOR PROFILES
-- ============================================================================

DROP POLICY IF EXISTS profiles_select_own ON profiles;
CREATE POLICY profiles_select_own ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS profiles_insert_own ON profiles;
CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 9. CREATE RLS POLICIES FOR SAVED_ARTICLES
-- ============================================================================

DROP POLICY IF EXISTS saved_articles_select_own ON saved_articles;
CREATE POLICY saved_articles_select_own ON saved_articles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_articles_insert_own ON saved_articles;
CREATE POLICY saved_articles_insert_own ON saved_articles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS saved_articles_delete_own ON saved_articles;
CREATE POLICY saved_articles_delete_own ON saved_articles
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- 10. CREATE RLS POLICIES FOR COLLECTIONS
-- ============================================================================

DROP POLICY IF EXISTS collections_all_own ON collections;
CREATE POLICY collections_all_own ON collections
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS collection_articles_all_own ON collection_articles;
CREATE POLICY collection_articles_all_own ON collection_articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_articles.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- ============================================================================
-- 11. INSERT SAMPLE NEWS SOURCES
-- ============================================================================

INSERT INTO sources (name, type, api_url, is_active) VALUES
  ('VentureBeat AI', 'rss', 'https://feeds.feedburner.com/venturebeat/SZYF', true),
  ('AI News', 'rss', 'https://www.artificialintelligence-news.com/feed/', true),
  ('MIT Technology Review AI', 'rss', 'https://www.technologyreview.com/topic/artificial-intelligence/feed', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================

SELECT 'Database setup completed successfully!' AS status;
