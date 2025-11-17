-- =====================================================
-- SCHEMA EXTENSIONS FOR AI NEWS APP
-- =====================================================
-- Adds collections, role management, and user preferences
-- to support full application functionality

-- =====================================================
-- 1. ADD ROLE AND PREFERENCES TO PROFILES
-- =====================================================

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
COMMENT ON INDEX idx_profiles_role IS 'Optimizes admin user queries';

-- =====================================================
-- 2. CREATE COLLECTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS collections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for user's collections queries
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);

COMMENT ON TABLE collections IS 'User-created collections for organizing saved articles';
COMMENT ON COLUMN collections.user_id IS 'References profiles.id, CASCADE deletes collections when user is deleted';
COMMENT ON INDEX idx_collections_user_id IS 'Optimizes queries fetching user collections';

-- =====================================================
-- 3. CREATE COLLECTION_ARTICLES JUNCTION TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS collection_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  collection_id BIGINT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, article_id)
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_collection_articles_collection_id ON collection_articles(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_articles_article_id ON collection_articles(article_id);

COMMENT ON TABLE collection_articles IS 'Junction table linking collections to articles';
COMMENT ON COLUMN collection_articles.collection_id IS 'References collections.id, CASCADE deletes when collection is deleted';
COMMENT ON COLUMN collection_articles.article_id IS 'References news_articles.id, CASCADE deletes when article is deleted';
COMMENT ON CONSTRAINT collection_articles_collection_id_article_id_key ON collection_articles IS 'Prevents duplicate articles in same collection';
COMMENT ON INDEX idx_collection_articles_collection_id IS 'Optimizes queries fetching articles in a collection';
COMMENT ON INDEX idx_collection_articles_article_id IS 'Optimizes queries checking which collections contain an article';

-- =====================================================
-- 4. CREATE TRIGGER FOR COLLECTIONS UPDATED_AT
-- =====================================================

-- Reuse the existing update_updated_at_column function
CREATE TRIGGER IF NOT EXISTS set_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. ROW-LEVEL SECURITY FOR COLLECTIONS
-- =====================================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Users can view their own collections
CREATE POLICY collections_select_own 
  ON collections 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own collections
CREATE POLICY collections_insert_own 
  ON collections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY collections_update_own 
  ON collections 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY collections_delete_own 
  ON collections 
  FOR DELETE 
  USING (auth.uid() = user_id);

COMMENT ON POLICY collections_select_own ON collections IS 'Users can SELECT only their own collections';
COMMENT ON POLICY collections_insert_own ON collections IS 'Users can INSERT collections only for themselves';
COMMENT ON POLICY collections_update_own ON collections IS 'Users can UPDATE only their own collections';
COMMENT ON POLICY collections_delete_own ON collections IS 'Users can DELETE only their own collections';

-- =====================================================
-- 6. ROW-LEVEL SECURITY FOR COLLECTION_ARTICLES
-- =====================================================

ALTER TABLE collection_articles ENABLE ROW LEVEL SECURITY;

-- Users can view articles in their own collections
CREATE POLICY collection_articles_select_own 
  ON collection_articles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_articles.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can add articles to their own collections
CREATE POLICY collection_articles_insert_own 
  ON collection_articles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_articles.collection_id
      AND collections.user_id = auth.uid()
    )
  );

-- Users can remove articles from their own collections
CREATE POLICY collection_articles_delete_own 
  ON collection_articles 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM collections
      WHERE collections.id = collection_articles.collection_id
      AND collections.user_id = auth.uid()
    )
  );

COMMENT ON POLICY collection_articles_select_own ON collection_articles IS 'Users can SELECT articles only from their own collections';
COMMENT ON POLICY collection_articles_insert_own ON collection_articles IS 'Users can INSERT articles only to their own collections';
COMMENT ON POLICY collection_articles_delete_own ON collection_articles IS 'Users can DELETE articles only from their own collections';

-- =====================================================
-- SCHEMA EXTENSION COMPLETE
-- =====================================================
-- Added: role and preferences to profiles
-- Added: collections table with RLS
-- Added: collection_articles junction table with RLS
-- =====================================================
