-- =====================================================
-- ROW-LEVEL SECURITY: SAVED ARTICLES TABLE
-- =====================================================
-- Ensures users can only manage their own saved articles
-- Supports INSERT, SELECT, and DELETE operations

-- Enable Row-Level Security
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SELECT POLICY
-- =====================================================
-- Users can view their own saved articles
CREATE POLICY saved_articles_select_own 
  ON saved_articles 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- =====================================================
-- INSERT POLICY
-- =====================================================
-- Users can save articles to their own collection
CREATE POLICY saved_articles_insert_own 
  ON saved_articles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- DELETE POLICY
-- =====================================================
-- Users can remove articles from their own collection
CREATE POLICY saved_articles_delete_own 
  ON saved_articles 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON POLICY saved_articles_select_own ON saved_articles IS 'Users can SELECT only their own saved articles';
COMMENT ON POLICY saved_articles_insert_own ON saved_articles IS 'Users can INSERT articles only to their own collection';
COMMENT ON POLICY saved_articles_delete_own ON saved_articles IS 'Users can DELETE only their own saved articles';
