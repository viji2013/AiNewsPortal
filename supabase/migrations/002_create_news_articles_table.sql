-- =====================================================
-- NEWS ARTICLES TABLE
-- =====================================================
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

-- =====================================================
-- INDEXES
-- =====================================================

-- Index on category for fast filtering by news category
CREATE INDEX idx_news_articles_category ON news_articles(category);

-- Descending index on published_at for "latest news" queries
-- DESC order optimizes ORDER BY published_at DESC queries
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at DESC);

-- GIN index for full-text search on title and summary
-- Enables fast text search across article content
CREATE INDEX idx_news_articles_search ON news_articles 
  USING GIN (to_tsvector('english', title || ' ' || summary));

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE news_articles IS 'News content storage optimized for read-heavy workloads';
COMMENT ON COLUMN news_articles.id IS 'BIGINT identity for better indexing performance vs UUID';
COMMENT ON COLUMN news_articles.published_at IS 'Business timestamp when article was published';
COMMENT ON INDEX idx_news_articles_category IS 'Optimizes category filtering queries';
COMMENT ON INDEX idx_news_articles_published_at IS 'Optimizes latest news queries with DESC order';
COMMENT ON INDEX idx_news_articles_search IS 'GIN index enables full-text search on title and summary';
