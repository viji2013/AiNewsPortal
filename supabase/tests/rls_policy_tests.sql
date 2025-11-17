-- =====================================================
-- ROW-LEVEL SECURITY POLICY TESTS
-- =====================================================
-- Test cases to verify RLS policies are working correctly
-- These tests should be run with different authenticated users
-- =====================================================

-- =====================================================
-- SETUP: CREATE TEST USERS AND DATA
-- =====================================================
-- Run these setup queries first to create test data
-- Note: In production, users are created via Supabase Auth

-- Create test profiles (assuming auth.users already has these UUIDs)
-- User 1: 11111111-1111-1111-1111-111111111111
-- User 2: 22222222-2222-2222-2222-222222222222

-- Insert test profiles
INSERT INTO profiles (id, full_name, phone_number, avatar_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test User One', '+1111111111', 'https://example.com/avatar1.jpg'),
  ('22222222-2222-2222-2222-222222222222', 'Test User Two', '+2222222222', 'https://example.com/avatar2.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert test articles
INSERT INTO news_articles (title, summary, category, source, url, published_at)
VALUES 
  ('Test Article 1', 'Summary of test article 1', 'technology', 'Test Source', 'https://example.com/1', NOW()),
  ('Test Article 2', 'Summary of test article 2', 'sports', 'Test Source', 'https://example.com/2', NOW()),
  ('Test Article 3', 'Summary of test article 3', 'business', 'Test Source', 'https://example.com/3', NOW())
ON CONFLICT DO NOTHING;

-- Insert saved articles for both users
INSERT INTO saved_articles (user_id, article_id)
SELECT '11111111-1111-1111-1111-111111111111', id FROM news_articles WHERE title = 'Test Article 1'
ON CONFLICT DO NOTHING;

INSERT INTO saved_articles (user_id, article_id)
SELECT '22222222-2222-2222-2222-222222222222', id FROM news_articles WHERE title = 'Test Article 2'
ON CONFLICT DO NOTHING;

-- =====================================================
-- PROFILES TABLE RLS TESTS
-- =====================================================

-- -----------------------------------------------------
-- TEST 1: User can SELECT their own profile
-- -----------------------------------------------------
-- Simulate: User 1 logged in (auth.uid() = '11111111-1111-1111-1111-111111111111')
-- Expected: Returns 1 row (User 1's profile)

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT 
  id,
  full_name,
  phone_number
FROM profiles
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Expected result: 1 row with User 1's data
-- ✓ PASS if returns User 1's profile
-- ✗ FAIL if returns 0 rows or error

-- -----------------------------------------------------
-- TEST 2: User cannot SELECT another user's profile
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to access User 2's profile
-- Expected: Returns 0 rows (RLS blocks access)

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT 
  id,
  full_name,
  phone_number
FROM profiles
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Expected result: 0 rows
-- ✓ PASS if returns 0 rows
-- ✗ FAIL if returns User 2's data

-- -----------------------------------------------------
-- TEST 3: User can UPDATE their own profile
-- -----------------------------------------------------
-- Simulate: User 1 logged in updating their own profile
-- Expected: Update succeeds

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

UPDATE profiles
SET full_name = 'Updated User One'
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Expected result: UPDATE 1
-- ✓ PASS if update succeeds
-- ✗ FAIL if update fails or returns UPDATE 0

-- Verify the update
SELECT full_name FROM profiles WHERE id = '11111111-1111-1111-1111-111111111111';
-- Expected: 'Updated User One'

-- -----------------------------------------------------
-- TEST 4: User cannot UPDATE another user's profile
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to update User 2's profile
-- Expected: Update fails (0 rows affected)

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

UPDATE profiles
SET full_name = 'Hacked User Two'
WHERE id = '22222222-2222-2222-2222-222222222222';

-- Expected result: UPDATE 0 (no rows affected)
-- ✓ PASS if returns UPDATE 0
-- ✗ FAIL if update succeeds

-- Verify User 2's profile is unchanged
SELECT full_name FROM profiles WHERE id = '22222222-2222-2222-2222-222222222222';
-- Expected: Original name, not 'Hacked User Two'

-- -----------------------------------------------------
-- TEST 5: User cannot DELETE their own profile
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to delete their profile
-- Expected: Delete fails (no DELETE policy exists)

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

DELETE FROM profiles
WHERE id = '11111111-1111-1111-1111-111111111111';

-- Expected result: DELETE 0 (no rows affected due to missing DELETE policy)
-- ✓ PASS if returns DELETE 0
-- ✗ FAIL if delete succeeds

-- =====================================================
-- SAVED ARTICLES TABLE RLS TESTS
-- =====================================================

-- -----------------------------------------------------
-- TEST 6: User can SELECT their own saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in viewing their saved articles
-- Expected: Returns only User 1's saved articles

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT 
  sa.id,
  sa.user_id,
  sa.article_id,
  na.title
FROM saved_articles sa
JOIN news_articles na ON sa.article_id = na.id
WHERE sa.user_id = '11111111-1111-1111-1111-111111111111';

-- Expected result: Only articles saved by User 1
-- ✓ PASS if returns User 1's saved articles only
-- ✗ FAIL if returns other users' saved articles or 0 rows

-- -----------------------------------------------------
-- TEST 7: User cannot SELECT another user's saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to view User 2's saved articles
-- Expected: Returns 0 rows

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT 
  sa.id,
  sa.user_id,
  sa.article_id
FROM saved_articles sa
WHERE sa.user_id = '22222222-2222-2222-2222-222222222222';

-- Expected result: 0 rows
-- ✓ PASS if returns 0 rows
-- ✗ FAIL if returns User 2's saved articles

-- -----------------------------------------------------
-- TEST 8: User can INSERT to their own saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in saving a new article
-- Expected: Insert succeeds

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

INSERT INTO saved_articles (user_id, article_id)
SELECT '11111111-1111-1111-1111-111111111111', id 
FROM news_articles 
WHERE title = 'Test Article 3'
ON CONFLICT DO NOTHING;

-- Expected result: INSERT 0 1 (success)
-- ✓ PASS if insert succeeds
-- ✗ FAIL if insert fails

-- Verify the insert
SELECT COUNT(*) FROM saved_articles 
WHERE user_id = '11111111-1111-1111-1111-111111111111';
-- Expected: At least 2 saved articles

-- -----------------------------------------------------
-- TEST 9: User cannot INSERT to another user's saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to save article as User 2
-- Expected: Insert fails

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

INSERT INTO saved_articles (user_id, article_id)
SELECT '22222222-2222-2222-2222-222222222222', id 
FROM news_articles 
WHERE title = 'Test Article 3';

-- Expected result: Error or INSERT 0 0 (policy violation)
-- ✓ PASS if insert fails with policy error
-- ✗ FAIL if insert succeeds

-- -----------------------------------------------------
-- TEST 10: User can DELETE their own saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in removing a saved article
-- Expected: Delete succeeds

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

DELETE FROM saved_articles
WHERE user_id = '11111111-1111-1111-1111-111111111111'
  AND article_id = (SELECT id FROM news_articles WHERE title = 'Test Article 1' LIMIT 1);

-- Expected result: DELETE 1
-- ✓ PASS if delete succeeds
-- ✗ FAIL if delete fails

-- -----------------------------------------------------
-- TEST 11: User cannot DELETE another user's saved articles
-- -----------------------------------------------------
-- Simulate: User 1 logged in trying to delete User 2's saved article
-- Expected: Delete fails (0 rows affected)

SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

DELETE FROM saved_articles
WHERE user_id = '22222222-2222-2222-2222-222222222222';

-- Expected result: DELETE 0 (no rows affected)
-- ✓ PASS if returns DELETE 0
-- ✗ FAIL if delete succeeds

-- =====================================================
-- UNAUTHENTICATED ACCESS TESTS
-- =====================================================

-- -----------------------------------------------------
-- TEST 12: Unauthenticated user cannot access profiles
-- -----------------------------------------------------
-- Simulate: No user logged in (auth.uid() = NULL)
-- Expected: Returns 0 rows

RESET "request.jwt.claims";

SELECT * FROM profiles;

-- Expected result: 0 rows
-- ✓ PASS if returns 0 rows
-- ✗ FAIL if returns any profile data

-- -----------------------------------------------------
-- TEST 13: Unauthenticated user cannot access saved_articles
-- -----------------------------------------------------
-- Simulate: No user logged in
-- Expected: Returns 0 rows

RESET "request.jwt.claims";

SELECT * FROM saved_articles;

-- Expected result: 0 rows
-- ✓ PASS if returns 0 rows
-- ✗ FAIL if returns any saved articles

-- -----------------------------------------------------
-- TEST 14: Unauthenticated user CAN access news_articles
-- -----------------------------------------------------
-- Simulate: No user logged in
-- Expected: Returns all articles (no RLS on news_articles)

RESET "request.jwt.claims";

SELECT id, title, category FROM news_articles;

-- Expected result: All news articles
-- ✓ PASS if returns all articles
-- ✗ FAIL if returns 0 rows (news_articles should be public)

-- =====================================================
-- AUTOMATED TEST SUITE
-- =====================================================
-- Run all tests and report results

DO $$
DECLARE
  test_count INTEGER := 0;
  pass_count INTEGER := 0;
  fail_count INTEGER := 0;
  result_count INTEGER;
BEGIN
  RAISE NOTICE 'RLS Policy Test Suite';
  RAISE NOTICE '====================';
  
  -- Test 1: User can select own profile
  test_count := test_count + 1;
  SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';
  SELECT COUNT(*) INTO result_count FROM profiles WHERE id = '11111111-1111-1111-1111-111111111111';
  IF result_count = 1 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 1: PASS - User can select own profile';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 1: FAIL - User cannot select own profile';
  END IF;
  
  -- Test 2: User cannot select other user's profile
  test_count := test_count + 1;
  SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';
  SELECT COUNT(*) INTO result_count FROM profiles WHERE id = '22222222-2222-2222-2222-222222222222';
  IF result_count = 0 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 2: PASS - User cannot select other profile';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 2: FAIL - User can access other profile (security issue!)';
  END IF;
  
  -- Test 3: User can select own saved articles
  test_count := test_count + 1;
  SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';
  SELECT COUNT(*) INTO result_count FROM saved_articles WHERE user_id = '11111111-1111-1111-1111-111111111111';
  IF result_count > 0 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 3: PASS - User can select own saved articles';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 3: FAIL - User cannot select own saved articles';
  END IF;
  
  -- Test 4: User cannot select other user's saved articles
  test_count := test_count + 1;
  SET LOCAL "request.jwt.claims" TO '{"sub": "11111111-1111-1111-1111-111111111111"}';
  SELECT COUNT(*) INTO result_count FROM saved_articles WHERE user_id = '22222222-2222-2222-2222-222222222222';
  IF result_count = 0 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 4: PASS - User cannot select other saved articles';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 4: FAIL - User can access other saved articles (security issue!)';
  END IF;
  
  -- Test 5: Unauthenticated cannot access profiles
  test_count := test_count + 1;
  RESET "request.jwt.claims";
  SELECT COUNT(*) INTO result_count FROM profiles;
  IF result_count = 0 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 5: PASS - Unauthenticated cannot access profiles';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 5: FAIL - Unauthenticated can access profiles (security issue!)';
  END IF;
  
  -- Test 6: Unauthenticated CAN access news_articles
  test_count := test_count + 1;
  RESET "request.jwt.claims";
  SELECT COUNT(*) INTO result_count FROM news_articles;
  IF result_count > 0 THEN
    pass_count := pass_count + 1;
    RAISE NOTICE 'Test 6: PASS - Unauthenticated can access news articles';
  ELSE
    fail_count := fail_count + 1;
    RAISE NOTICE 'Test 6: FAIL - News articles should be publicly accessible';
  END IF;
  
  RAISE NOTICE '====================';
  RAISE NOTICE 'Total Tests: %', test_count;
  RAISE NOTICE 'Passed: %', pass_count;
  RAISE NOTICE 'Failed: %', fail_count;
  RAISE NOTICE '====================';
END $$;

-- =====================================================
-- CLEANUP TEST DATA
-- =====================================================
-- Run this to remove test data after testing

-- DELETE FROM saved_articles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
-- DELETE FROM profiles WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
-- DELETE FROM news_articles WHERE title LIKE 'Test Article%';
