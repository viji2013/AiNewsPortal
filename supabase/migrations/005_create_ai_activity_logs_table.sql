-- =====================================================
-- AI ACTIVITY LOGS TABLE
-- =====================================================
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

-- =====================================================
-- INDEXES
-- =====================================================

-- Descending index on created_at for retrieving recent AI activity
CREATE INDEX idx_ai_activity_logs_created_at ON ai_activity_logs(created_at DESC);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE ai_activity_logs IS 'AI summarization activity tracking for monitoring and cost analysis';
COMMENT ON COLUMN ai_activity_logs.article_id IS 'References news_articles.id, SET NULL preserves logs if article deleted';
COMMENT ON COLUMN ai_activity_logs.llm_provider IS 'AI provider name (e.g., OpenAI, Anthropic, Gemini)';
COMMENT ON COLUMN ai_activity_logs.tokens_used IS 'Total tokens consumed in the AI operation';
COMMENT ON COLUMN ai_activity_logs.cost_estimate IS 'Estimated cost in USD with 6 decimal precision';
COMMENT ON INDEX idx_ai_activity_logs_created_at IS 'Optimizes queries for recent AI activity with DESC order';
