-- =====================================================
-- SCHEMA VALIDATION QUERIES
-- =====================================================
-- Queries to verify database schema structure
-- Run these after migration to confirm everything is set up correctly
-- =====================================================

-- =====================================================
-- 1. VERIFY ALL TABLES EXIST
-- =====================================================

SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY table_name;

-- Expected: 5 rows (all tables present)

-- =====================================================
-- 2. VERIFY TABLE COLUMNS AND DATA TYPES
-- =====================================================

-- Profiles table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- News Articles table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'news_articles'
ORDER BY ordinal_position;

-- Saved Articles table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'saved_articles'
ORDER BY ordinal_position;

-- Sources table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'sources'
ORDER BY ordinal_position;

-- AI Activity Logs table columns
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'ai_activity_logs'
ORDER BY ordinal_position;

-- =====================================================
-- 3. VERIFY ALL INDEXES EXIST
-- =====================================================

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY tablename, indexname;

-- Expected indexes:
-- profiles: idx_profiles_phone_number + primary key
-- news_articles: idx_news_articles_category, idx_news_articles_published_at, idx_news_articles_search + primary key
-- saved_articles: idx_saved_articles_user_id, idx_saved_articles_article_id + primary key + unique constraint index
-- sources: idx_sources_is_active + primary key
-- ai_activity_logs: idx_ai_activity_logs_created_at + primary key

-- =====================================================
-- 4. VERIFY FOREIGN KEY CONSTRAINTS
-- =====================================================

SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY tc.table_name, tc.constraint_name;

-- Expected foreign keys:
-- profiles.id -> auth.users.id (CASCADE)
-- saved_articles.user_id -> profiles.id (CASCADE)
-- saved_articles.article_id -> news_articles.id (CASCADE)
-- ai_activity_logs.article_id -> news_articles.id (SET NULL)

-- =====================================================
-- 5. VERIFY UNIQUE CONSTRAINTS
-- =====================================================

SELECT
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY tc.table_name, tc.constraint_name;

-- Expected unique constraints:
-- profiles.phone_number
-- saved_articles (user_id, article_id) composite

-- =====================================================
-- 6. VERIFY RLS IS ENABLED
-- =====================================================

SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY tablename;

-- Expected: rowsecurity = true for profiles and saved_articles

-- =====================================================
-- 7. VERIFY RLS POLICIES
-- =====================================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected policies:
-- profiles: profiles_select_own (SELECT), profiles_update_own (UPDATE)
-- saved_articles: saved_articles_select_own (SELECT), saved_articles_insert_own (INSERT), saved_articles_delete_own (DELETE)

-- =====================================================
-- 8. VERIFY TRIGGERS
-- =====================================================

SELECT
  event_object_table AS table_name,
  trigger_name,
  event_manipulation AS event,
  action_timing AS timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')
ORDER BY event_object_table, trigger_name;

-- Expected: set_updated_at trigger on profiles table (BEFORE UPDATE)

-- =====================================================
-- 9. VERIFY GIN INDEX FOR FULL-TEXT SEARCH
-- =====================================================

SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'news_articles'
  AND indexdef LIKE '%gin%'
  AND indexdef LIKE '%to_tsvector%';

-- Expected: idx_news_articles_search with GIN index on to_tsvector

-- =====================================================
-- 10. COMPREHENSIVE SCHEMA SUMMARY
-- =====================================================

SELECT 
  'Tables' AS category,
  COUNT(*)::text AS count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')

UNION ALL

SELECT 
  'Indexes' AS category,
  COUNT(*)::text AS count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')

UNION ALL

SELECT 
  'Foreign Keys' AS category,
  COUNT(*)::text AS count
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs')

UNION ALL

SELECT 
  'RLS Policies' AS category,
  COUNT(*)::text AS count
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT 
  'Triggers' AS category,
  COUNT(*)::text AS count
FROM information_schema.triggers
WHERE event_object_schema = 'public'
  AND event_object_table IN ('profiles', 'news_articles', 'saved_articles', 'sources', 'ai_activity_logs');

-- Expected summary:
-- Tables: 5
-- Indexes: 13+ (including primary keys and unique constraint indexes)
-- Foreign Keys: 4
-- RLS Policies: 5
-- Triggers: 1
