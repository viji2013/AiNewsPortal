# Requirements Document

## Introduction

This document defines the requirements for a high-performance Supabase PostgreSQL database schema for an AI News App (similar to Inshorts). The schema is designed to be clean, scalable, minimal, and optimized for fast reads with support for user authentication, news article management, saved articles, news sources, and AI activity logging.

## Glossary

- **Database Schema**: The structure of database tables, columns, indexes, and relationships
- **Supabase Auth**: Supabase's built-in authentication system that manages user credentials
- **Profiles Table**: A custom table that extends Supabase Auth with additional user information
- **RLS (Row-Level Security)**: PostgreSQL security feature that restricts data access at the row level
- **GIN Index**: Generalized Inverted Index, optimized for full-text search operations
- **Foreign Key (FK)**: A database constraint that establishes relationships between tables
- **Primary Key (PK)**: A unique identifier for each row in a table
- **Materialized View**: A database object that stores query results physically (not used in this schema)
- **OTP**: One-Time Password used for authentication

## Requirements

### Requirement 1: User Profile Management

**User Story:** As a user, I want my profile information stored securely and linked to my authentication credentials, so that I can access personalized features while maintaining data integrity.

#### Acceptance Criteria

1. THE Database Schema SHALL create a profiles table with columns for id (uuid), full_name (text), phone_number (text), avatar_url (text), created_at (timestamp), and updated_at (timestamp)
2. THE Database Schema SHALL establish a foreign key relationship where profiles.id references auth.users.id with ON DELETE CASCADE
3. THE Database Schema SHALL enforce uniqueness on the phone_number column to prevent duplicate registrations
4. THE Database Schema SHALL create an index on the phone_number column to optimize lookup queries
5. THE Database Schema SHALL implement an automatic trigger to update the updated_at timestamp when profile records are modified

### Requirement 2: News Article Storage

**User Story:** As a system, I want to store news articles with comprehensive metadata, so that users can browse, search, and access news content efficiently.

#### Acceptance Criteria

1. THE Database Schema SHALL create a news_articles table with columns for id (bigint identity), title (text), summary (text), category (text), source (text), url (text), image_url (text), published_at (timestamp), and created_at (timestamp)
2. THE Database Schema SHALL create an index on the category column to optimize category-based filtering queries
3. THE Database Schema SHALL create a descending index on the published_at column to optimize "latest news" queries
4. THE Database Schema SHALL create a GIN index on title and summary columns combined to enable full-text search capabilities
5. THE Database Schema SHALL use bigint identity for the primary key to optimize indexing performance compared to UUID

### Requirement 3: Saved Articles Functionality

**User Story:** As a user, I want to save articles for later reading, so that I can access my favorite content without searching again.

#### Acceptance Criteria

1. THE Database Schema SHALL create a saved_articles table with columns for id (bigint identity), user_id (uuid), article_id (bigint), and saved_at (timestamp)
2. THE Database Schema SHALL establish foreign key relationships where user_id references profiles.id and article_id references news_articles.id with ON DELETE CASCADE
3. THE Database Schema SHALL enforce a unique constraint on the combination of user_id and article_id to prevent duplicate saves
4. THE Database Schema SHALL create an index on user_id to optimize queries retrieving a user's saved articles
5. THE Database Schema SHALL create an index on article_id to optimize queries checking if an article has been saved

### Requirement 4: News Source Configuration

**User Story:** As a system administrator, I want to manage news sources with their API configurations, so that the system can fetch news from multiple providers efficiently.

#### Acceptance Criteria

1. THE Database Schema SHALL create a sources table with columns for id (bigint identity), name (text), type (text), api_url (text), and is_active (boolean)
2. THE Database Schema SHALL set the default value of is_active to true for new source records
3. THE Database Schema SHALL create an index on the is_active column to optimize queries filtering active sources
4. THE Database Schema SHALL allow type values to indicate source types such as 'api', 'rss', or 'custom'

### Requirement 5: AI Activity Monitoring

**User Story:** As a system administrator, I want to track AI summarization activities and costs, so that I can monitor usage patterns and optimize expenses.

#### Acceptance Criteria

1. THE Database Schema SHALL create an ai_activity_logs table with columns for id (bigint identity), article_id (bigint), llm_provider (text), tokens_used (integer), cost_estimate (numeric), and created_at (timestamp)
2. THE Database Schema SHALL establish a foreign key relationship where article_id references news_articles.id with ON DELETE SET NULL
3. THE Database Schema SHALL create a descending index on created_at to optimize queries retrieving recent AI activity
4. THE Database Schema SHALL store cost_estimate as a numeric type to maintain precision for financial calculations

### Requirement 6: Row-Level Security for Profiles

**User Story:** As a user, I want my profile data protected so that only I can view and update my information, ensuring privacy and security.

#### Acceptance Criteria

1. THE Database Schema SHALL enable Row-Level Security on the profiles table
2. THE Database Schema SHALL create a SELECT policy allowing users to view only their own profile where auth.uid() equals profiles.id
3. THE Database Schema SHALL create an UPDATE policy allowing users to modify only their own profile where auth.uid() equals profiles.id
4. THE Database Schema SHALL prevent DELETE operations on profiles through RLS policies

### Requirement 7: Row-Level Security for Saved Articles

**User Story:** As a user, I want my saved articles list to be private, so that only I can view, add, or remove articles from my saved collection.

#### Acceptance Criteria

1. THE Database Schema SHALL enable Row-Level Security on the saved_articles table
2. THE Database Schema SHALL create a SELECT policy allowing users to view only their own saved articles where auth.uid() equals saved_articles.user_id
3. THE Database Schema SHALL create an INSERT policy allowing users to save articles only to their own collection where auth.uid() equals saved_articles.user_id
4. THE Database Schema SHALL create a DELETE policy allowing users to remove only their own saved articles where auth.uid() equals saved_articles.user_id

### Requirement 8: Performance Optimization

**User Story:** As a system, I want the database schema optimized for read-heavy workloads, so that users experience fast response times when browsing news content.

#### Acceptance Criteria

1. THE Database Schema SHALL use bigint identity primary keys for news_articles, saved_articles, sources, and ai_activity_logs tables to optimize indexing performance
2. THE Database Schema SHALL include inline comments documenting the purpose of each index for maintainability
3. THE Database Schema SHALL avoid recursive functions and heavy triggers to minimize processing overhead
4. THE Database Schema SHALL structure queries to support pagination with a default limit of 20 records
