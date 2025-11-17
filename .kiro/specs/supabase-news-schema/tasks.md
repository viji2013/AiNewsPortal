# Implementation Plan

- [x] 1. Create profiles table with indexes and trigger


  - Create profiles table extending auth.users with all required columns (id, full_name, phone_number, avatar_url, created_at, updated_at)
  - Add foreign key constraint referencing auth.users(id) with ON DELETE CASCADE
  - Add unique constraint on phone_number column
  - Create B-tree index on phone_number for fast lookups
  - Create trigger function to automatically update updated_at timestamp
  - Create trigger that fires before UPDATE on profiles table
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Create news_articles table with optimized indexes


  - Create news_articles table with bigint identity primary key and all content columns (title, summary, category, source, url, image_url, published_at, created_at)
  - Add NOT NULL constraints on title, summary, category, and published_at
  - Create B-tree index on category column for filtering
  - Create descending B-tree index on published_at for latest news queries
  - Create GIN index on combined title and summary using to_tsvector for full-text search
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 3. Create saved_articles junction table with constraints


  - Create saved_articles table with bigint identity primary key and foreign keys to profiles and news_articles
  - Add foreign key constraint for user_id referencing profiles(id) with ON DELETE CASCADE
  - Add foreign key constraint for article_id referencing news_articles(id) with ON DELETE CASCADE
  - Add unique constraint on (user_id, article_id) combination to prevent duplicates
  - Create B-tree index on user_id for user's saved articles queries
  - Create B-tree index on article_id for article save status checks
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Create sources table for news provider management


  - Create sources table with bigint identity primary key and configuration columns (name, type, api_url, is_active)
  - Set default value of TRUE for is_active column
  - Create B-tree index on is_active column for filtering active sources
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Create ai_activity_logs table for monitoring


  - Create ai_activity_logs table with bigint identity primary key and tracking columns (article_id, llm_provider, tokens_used, cost_estimate, created_at)
  - Add foreign key constraint for article_id referencing news_articles(id) with ON DELETE SET NULL
  - Set cost_estimate column as NUMERIC(10, 6) for precision
  - Create descending B-tree index on created_at for recent activity queries
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 6. Enable RLS and create policies for profiles table


  - Enable Row-Level Security on profiles table using ALTER TABLE
  - Create SELECT policy allowing users to view their own profile (auth.uid() = id)
  - Create UPDATE policy allowing users to modify their own profile (auth.uid() = id)
  - Verify no DELETE policy exists (prevent profile deletion)
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 7. Enable RLS and create policies for saved_articles table


  - Enable Row-Level Security on saved_articles table using ALTER TABLE
  - Create SELECT policy allowing users to view their own saved articles (auth.uid() = user_id)
  - Create INSERT policy allowing users to save articles to their own collection (auth.uid() = user_id)
  - Create DELETE policy allowing users to remove their own saved articles (auth.uid() = user_id)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 8. Create complete SQL migration file



  - Combine all CREATE TABLE statements in correct dependency order
  - Add all CREATE INDEX statements after table creation
  - Include trigger function and trigger creation for profiles.updated_at
  - Add all ALTER TABLE statements for enabling RLS
  - Include all CREATE POLICY statements for profiles and saved_articles
  - Add inline SQL comments documenting purpose of each index and policy
  - Structure file with clear sections: Tables, Indexes, Triggers, RLS Policies
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x]* 9. Create validation and testing utilities


  - [x]* 9.1 Write SQL queries to verify schema structure


    - Create query to list all tables and their columns
    - Create query to verify all indexes exist with correct columns
    - Create query to check all foreign key constraints
    - Create query to verify RLS policies are enabled and configured
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x]* 9.2 Create performance test queries


    - Write EXPLAIN ANALYZE query for latest news by category
    - Write EXPLAIN ANALYZE query for user's saved articles
    - Write EXPLAIN ANALYZE query for full-text search
    - Document expected query plans showing index usage
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x]* 9.3 Write RLS policy test cases


    - Create test query verifying users can only SELECT their own profile
    - Create test query verifying users can only UPDATE their own profile
    - Create test query verifying users cannot DELETE profiles
    - Create test queries for saved_articles INSERT, SELECT, DELETE policies
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_
