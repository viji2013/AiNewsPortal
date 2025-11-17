-- =====================================================
-- SAVED ARTICLES TABLE
-- =====================================================
-- Junction table for user bookmarking functionality
-- Links users to their saved articles with duplicate prevention

CREATE TABLE saved_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index on user_id for retrieving a user's saved articles
CREATE INDEX idx_saved_articles_user_id ON saved_articles(user_id);

-- Index on article_id for checking if an article is saved
CREATE INDEX idx_saved_articles_article_id ON saved_articles(article_id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE saved_articles IS 'Many-to-many junction table for user article bookmarks';
COMMENT ON COLUMN saved_articles.user_id IS 'References profiles.id, CASCADE deletes saves when user is deleted';
COMMENT ON COLUMN saved_articles.article_id IS 'References news_articles.id, CASCADE deletes saves when article is deleted';
COMMENT ON CONSTRAINT saved_articles_user_id_article_id_key ON saved_articles IS 'Prevents duplicate saves of same article by same user';
COMMENT ON INDEX idx_saved_articles_user_id IS 'Optimizes queries fetching user saved articles';
COMMENT ON INDEX idx_saved_articles_article_id IS 'Optimizes queries checking article save status';
