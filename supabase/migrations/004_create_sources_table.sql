-- =====================================================
-- SOURCES TABLE
-- =====================================================
-- Manages news source configurations for content aggregation
-- Supports multiple source types: API, RSS, custom

CREATE TABLE sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index on is_active for filtering active sources
CREATE INDEX idx_sources_is_active ON sources(is_active);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE sources IS 'News source configurations for content aggregation';
COMMENT ON COLUMN sources.type IS 'Source type: api, rss, or custom';
COMMENT ON COLUMN sources.api_url IS 'API endpoint or RSS feed URL';
COMMENT ON COLUMN sources.is_active IS 'Soft disable flag - FALSE disables source without deletion';
COMMENT ON INDEX idx_sources_is_active IS 'Optimizes queries filtering for active sources only';
