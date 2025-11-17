-- =====================================================
-- PERFORMANCE TEST QUERIES
-- =====================================================
-- EXPLAIN ANALYZE queries to verify index usage and performance
-- Run these with sample data to benchmark query execution
-- =====================================================

-- =====================================================
-- TEST 1: LATEST NEWS BY CATEGORY
-- =====================================================
-- Tests: idx_news_articles_category and idx_news_articles_published_at
-- Expected: Index Scan using idx_news_articles_published_at with Filter on category

EXPLAIN ANALYZE
SELECT 
  id,
  title,
  summary,
  category,
  source,
  image_url,
  published_at
FROM news_articles
WHERE category = 'technology'
ORDER BY published_at DESC
LIMIT 20;

-- Expected query plan:
-- -> Limit
--    -> Index Scan using idx_news_articles_published_at on news_articles
--       Filter: (category = 'technology')
-- 
-- Performance target: < 10ms with 100k rows

-- =====================================================
-- TEST 2: LATEST NEWS (ALL CATEGORIES)
-- =====================================================
-- Tests: idx_news_articles_published_at
-- Expected: Index Scan using idx_news_articles_published_at

EXPLAIN ANALYZE
SELECT 
  id,
  title,
  summary,
  category,
  source,
  image_url,
  published_at
FROM news_articles
ORDER BY published_at DESC
LIMIT 20;

-- Expected query plan:
-- -> Limit
--    -> Index Scan using idx_news_articles_published_at on news_articles
-- 
-- Performance target: < 5ms with 100k rows

-- =====================================================
-- TEST 3: USER'S SAVED ARTICLES
-- =====================================================
-- Tests: idx_saved_articles_user_id and join performance
-- Expected: Index Scan on saved_articles, then join with news_articles

EXPLAIN ANALYZE
SELECT 
  na.id,
  na.title,
  na.summary,
  na.category,
  na.source,
  na.image_url,
  na.published_at,
  sa.saved_at
FROM news_articles na
JOIN saved_articles sa ON na.id = sa.article_id
WHERE sa.user_id = '00000000-0000-0000-0000-000000000000'::uuid
ORDER BY sa.saved_at DESC
LIMIT 20;

-- Expected query plan:
-- -> Limit
--    -> Nested Loop
--       -> Index Scan using idx_saved_articles_user_id on saved_articles sa
--          Index Cond: (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
--       -> Index Scan using news_articles_pkey on news_articles na
--          Index Cond: (id = sa.article_id)
-- 
-- Performance target: < 15ms with 1000 saved articles per user

-- =====================================================
-- TEST 4: CHECK IF ARTICLE IS SAVED BY USER
-- =====================================================
-- Tests: Composite unique index on (user_id, article_id)
-- Expected: Index Only Scan using unique constraint index

EXPLAIN ANALYZE
SELECT EXISTS (
  SELECT 1
  FROM saved_articles
  WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid
    AND article_id = 12345
);

-- Expected query plan:
-- -> Index Only Scan using saved_articles_user_id_article_id_key
--    Index Cond: ((user_id = '00000000-0000-0000-0000-000000000000'::uuid) AND (article_id = 12345))
-- 
-- Performance target: < 1ms

-- =====================================================
-- TEST 5: FULL-TEXT SEARCH ON ARTICLES
-- =====================================================
-- Tests: idx_news_articles_search (GIN index)
-- Expected: Bitmap Index Scan using idx_news_articles_search

EXPLAIN ANALYZE
SELECT 
  id,
  title,
  summary,
  category,
  published_at,
  ts_rank(to_tsvector('english', title || ' ' || summary), to_tsquery('english', 'artificial & intelligence')) AS rank
FROM news_articles
WHERE to_tsvector('english', title || ' ' || summary) @@ to_tsquery('english', 'artificial & intelligence')
ORDER BY rank DESC
LIMIT 20;

-- Expected query plan:
-- -> Limit
--    -> Sort
--       -> Bitmap Heap Scan on news_articles
--          Recheck Cond: (to_tsvector('english', (title || ' '::text) || summary) @@ '''artifici'' & ''intellig'''::tsquery)
--          -> Bitmap Index Scan on idx_news_articles_search
--             Index Cond: (to_tsvector('english', (title || ' '::text) || summary) @@ '''artifici'' & ''intellig'''::tsquery)
-- 
-- Performance target: < 50ms with 100k rows

-- =====================================================
-- TEST 6: SEARCH WITH CATEGORY FILTER
-- =====================================================
-- Tests: Combined use of GIN search index and category filter
-- Expected: Bitmap Index Scan with additional filter

EXPLAIN ANALYZE
SELECT 
  id,
  title,
  summary,
  category,
  published_at
FROM news_articles
WHERE to_tsvector('english', title || ' ' || summary) @@ to_tsquery('english', 'technology')
  AND category = 'tech'
ORDER BY published_at DESC
LIMIT 20;

-- Expected query plan:
-- -> Limit
--    -> Sort
--       -> Bitmap Heap Scan on news_articles
--          Recheck Cond: (to_tsvector('english', (title || ' '::text) || summary) @@ '''technologi'''::tsquery)
--          Filter: (category = 'tech'::text)
--          -> Bitmap Index Scan on idx_news_articles_search
-- 
-- Performance target: < 60ms with 100k rows

-- =====================================================
-- TEST 7: ACTIVE SOURCES LOOKUP
-- =====================================================
-- Tests: idx_sources_is_active
-- Expected: Index Scan or Bitmap Index Scan

EXPLAIN ANALYZE
SELECT 
  id,
  name,
  type,
  api_url
FROM sources
WHERE is_active = true;

-- Expected query plan:
-- -> Index Scan using idx_sources_is_active on sources
--    Index Cond: (is_active = true)
-- 
-- Performance target: < 5ms

-- =====================================================
-- TEST 8: RECENT AI ACTIVITY LOGS
-- =====================================================
-- Tests: idx_ai_activity_logs_created_at
-- Expected: Index Scan using idx_ai_activity_logs_created_at

EXPLAIN ANALYZE
SELECT 
  id,
  article_id,
  llm_provider,
  tokens_used,
  cost_estimate,
  created_at
FROM ai_activity_logs
ORDER BY created_at DESC
LIMIT 50;

-- Expected query plan:
-- -> Limit
--    -> Index Scan using idx_ai_activity_logs_created_at on ai_activity_logs
-- 
-- Performance target: < 5ms

-- =====================================================
-- TEST 9: AI COST ANALYSIS BY PROVIDER
-- =====================================================
-- Tests: Aggregation performance on ai_activity_logs
-- Expected: Sequential Scan (acceptable for aggregations)

EXPLAIN ANALYZE
SELECT 
  llm_provider,
  COUNT(*) AS total_requests,
  SUM(tokens_used) AS total_tokens,
  SUM(cost_estimate) AS total_cost,
  AVG(tokens_used) AS avg_tokens_per_request
FROM ai_activity_logs
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY llm_provider
ORDER BY total_cost DESC;

-- Expected query plan:
-- -> Sort
--    -> HashAggregate
--       -> Index Scan using idx_ai_activity_logs_created_at on ai_activity_logs
--          Index Cond: (created_at >= (now() - '30 days'::interval))
-- 
-- Performance target: < 100ms with 100k log entries

-- =====================================================
-- TEST 10: PROFILE LOOKUP BY PHONE NUMBER
-- =====================================================
-- Tests: idx_profiles_phone_number
-- Expected: Index Scan using idx_profiles_phone_number

EXPLAIN ANALYZE
SELECT 
  id,
  full_name,
  phone_number,
  avatar_url
FROM profiles
WHERE phone_number = '+1234567890';

-- Expected query plan:
-- -> Index Scan using idx_profiles_phone_number on profiles
--    Index Cond: (phone_number = '+1234567890'::text)
-- 
-- Performance target: < 1ms

-- =====================================================
-- TEST 11: PAGINATED CATEGORY BROWSE
-- =====================================================
-- Tests: Pagination performance with offset
-- Expected: Index Scan with offset

EXPLAIN ANALYZE
SELECT 
  id,
  title,
  summary,
  category,
  published_at
FROM news_articles
WHERE category = 'sports'
ORDER BY published_at DESC
LIMIT 20 OFFSET 40;

-- Expected query plan:
-- -> Limit
--    -> Index Scan using idx_news_articles_published_at on news_articles
--       Filter: (category = 'sports'::text)
-- 
-- Performance target: < 15ms with offset up to 1000

-- =====================================================
-- TEST 12: COUNT SAVED ARTICLES PER USER
-- =====================================================
-- Tests: Index-only count on saved_articles
-- Expected: Aggregate with Index Scan

EXPLAIN ANALYZE
SELECT COUNT(*)
FROM saved_articles
WHERE user_id = '00000000-0000-0000-0000-000000000000'::uuid;

-- Expected query plan:
-- -> Aggregate
--    -> Index Only Scan using idx_saved_articles_user_id on saved_articles
--       Index Cond: (user_id = '00000000-0000-0000-0000-000000000000'::uuid)
-- 
-- Performance target: < 5ms

-- =====================================================
-- PERFORMANCE BENCHMARKING SUMMARY
-- =====================================================
-- Run this to get a quick overview of all query timings

DO $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
BEGIN
  RAISE NOTICE 'Performance Benchmark Summary';
  RAISE NOTICE '============================';
  
  -- Test 1: Latest news by category
  start_time := clock_timestamp();
  PERFORM * FROM news_articles WHERE category = 'technology' ORDER BY published_at DESC LIMIT 20;
  end_time := clock_timestamp();
  RAISE NOTICE 'Latest news by category: % ms', EXTRACT(MILLISECONDS FROM (end_time - start_time));
  
  -- Test 2: Full-text search
  start_time := clock_timestamp();
  PERFORM * FROM news_articles WHERE to_tsvector('english', title || ' ' || summary) @@ to_tsquery('english', 'technology') LIMIT 20;
  end_time := clock_timestamp();
  RAISE NOTICE 'Full-text search: % ms', EXTRACT(MILLISECONDS FROM (end_time - start_time));
  
  -- Test 3: Active sources
  start_time := clock_timestamp();
  PERFORM * FROM sources WHERE is_active = true;
  end_time := clock_timestamp();
  RAISE NOTICE 'Active sources lookup: % ms', EXTRACT(MILLISECONDS FROM (end_time - start_time));
  
  RAISE NOTICE '============================';
END $$;
