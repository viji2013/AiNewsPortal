# Design Document

## Overview

This design document outlines the database schema architecture for a high-performance AI News App using Supabase PostgreSQL. The schema is optimized for read-heavy workloads with minimal write operations, leveraging PostgreSQL's advanced indexing capabilities and Supabase's Row-Level Security (RLS) for data protection.

The design follows these core principles:
- **Read optimization**: Strategic indexes on frequently queried columns
- **Data integrity**: Foreign key constraints with appropriate cascade behaviors
- **Security**: RLS policies for user data isolation
- **Scalability**: Efficient data types (bigint for high-volume tables)
- **Maintainability**: Clear naming conventions and inline documentation

## Architecture

### Database Structure

```mermaid
erDiagram
    auth_users ||--|| profiles : "extends"
    profiles ||--o{ saved_articles : "saves"
    news_articles ||--o{ saved_articles : "saved_by"
    news_articles ||--o{ ai_activity_logs : "processed_by"
    
    auth_users {
        uuid id PK
        text email
        timestamp created_at
    }
    
    profiles {
        uuid id PK_FK
        text full_name
        text phone_number UK
        text avatar_url
        timestamp created_at
        timestamp updated_at
    }
    
    news_articles {
        bigint id PK
        text title
        text summary
        text category
        text source
        text url
        text image_url
        timestamp published_at
        timestamp created_at
    }
    
    saved_articles {
        bigint id PK
        uuid user_id FK
        bigint article_id FK
        timestamp saved_at
    }
    
    sources {
        bigint id PK
        text name
        text type
        text api_url
        boolean is_active
    }
    
    ai_activity_logs {
        bigint id PK
        bigint article_id FK
        text llm_provider
        integer tokens_used
        numeric cost_estimate
        timestamp created_at
    }
```

### Table Relationships

1. **profiles ↔ auth.users**: One-to-one relationship extending Supabase Auth
2. **saved_articles**: Many-to-many junction table between profiles and news_articles
3. **ai_activity_logs**: One-to-many relationship tracking AI processing per article

## Components and Interfaces

### 1. Profiles Table

**Purpose**: Extends Supabase Auth with custom user data

**Schema**:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- `phone_number` (B-tree): Optimizes phone-based lookups for OTP authentication
- Primary key on `id` (automatic)

**Triggers**:
- Auto-update `updated_at` on row modification

**Design Rationale**:
- UUID primary key maintains compatibility with Supabase Auth
- `phone_number` uniqueness prevents duplicate accounts
- `ON DELETE CASCADE` ensures profile cleanup when auth user is deleted

### 2. News Articles Table

**Purpose**: Stores news content with metadata for browsing and searching

**Schema**:
```sql
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
```

**Indexes**:
- `category` (B-tree): Fast category filtering
- `published_at DESC` (B-tree): Optimizes "latest news" queries
- `(title, summary)` (GIN with tsvector): Full-text search capability

**Design Rationale**:
- `BIGINT` primary key chosen over UUID for better indexing performance and smaller index size
- `GENERATED ALWAYS AS IDENTITY` ensures sequential IDs without gaps
- No `updated_at` field as news articles are immutable after creation
- GIN index enables fast text search across title and summary

### 3. Saved Articles Table

**Purpose**: Junction table for user-article bookmarking

**Schema**:
```sql
CREATE TABLE saved_articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  article_id BIGINT NOT NULL REFERENCES news_articles(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);
```

**Indexes**:
- `user_id` (B-tree): Fast retrieval of user's saved articles
- `article_id` (B-tree): Check if article is saved by any user
- Composite unique index on `(user_id, article_id)` (automatic from constraint)

**Design Rationale**:
- Composite unique constraint prevents duplicate saves
- `ON DELETE CASCADE` on both FKs ensures cleanup when user or article is deleted
- Separate `id` column allows for future extensions (e.g., notes, tags)

### 4. Sources Table

**Purpose**: Manages news source configurations for content aggregation

**Schema**:
```sql
CREATE TABLE sources (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  api_url TEXT,
  is_active BOOLEAN DEFAULT TRUE
);
```

**Indexes**:
- `is_active` (B-tree): Filters active sources efficiently

**Design Rationale**:
- `type` field supports multiple source types (api, rss, custom)
- `is_active` flag enables soft disabling without deletion
- No foreign key to `news_articles` to keep schema flexible

### 5. AI Activity Logs Table

**Purpose**: Tracks AI summarization operations for monitoring and cost analysis

**Schema**:
```sql
CREATE TABLE ai_activity_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT REFERENCES news_articles(id) ON DELETE SET NULL,
  llm_provider TEXT NOT NULL,
  tokens_used INTEGER,
  cost_estimate NUMERIC(10, 6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes**:
- `created_at DESC` (B-tree): Retrieves recent activity efficiently
- `article_id` (B-tree, automatic from FK): Links logs to articles

**Design Rationale**:
- `ON DELETE SET NULL` preserves logs even if article is deleted
- `NUMERIC(10, 6)` provides precision for cost calculations (up to $9,999.999999)
- No unique constraints as multiple AI operations per article are expected

## Data Models

### Primary Key Strategy

- **UUID**: Used only for `profiles.id` to maintain Supabase Auth compatibility
- **BIGINT IDENTITY**: Used for all other tables for better performance
  - Smaller index size (8 bytes vs 16 bytes for UUID)
  - Sequential ordering improves B-tree efficiency
  - Better for high-volume inserts

### Timestamp Strategy

- **created_at**: Immutable timestamp set at record creation
- **updated_at**: Only on `profiles` table with automatic trigger
- **published_at**: Business timestamp for article publication
- **saved_at**: Tracks when user saved an article

All timestamps use `TIMESTAMPTZ` (timestamp with time zone) for consistency across regions.

### Text Search Implementation

Full-text search on `news_articles` uses PostgreSQL's tsvector:

```sql
CREATE INDEX idx_news_articles_search 
ON news_articles 
USING GIN (to_tsvector('english', title || ' ' || summary));
```

This enables queries like:
```sql
SELECT * FROM news_articles 
WHERE to_tsvector('english', title || ' ' || summary) 
@@ to_tsquery('english', 'technology & AI');
```

## Error Handling

### Foreign Key Violations

**Scenario**: Attempting to save an article that doesn't exist

**Handling**: 
- PostgreSQL raises `foreign_key_violation` error (23503)
- Application should validate article existence before insert
- Return user-friendly error: "Article not found"

### Unique Constraint Violations

**Scenario**: User tries to save the same article twice

**Handling**:
- PostgreSQL raises `unique_violation` error (23505)
- Application should use `ON CONFLICT DO NOTHING` clause
- Return success response (idempotent operation)

Example:
```sql
INSERT INTO saved_articles (user_id, article_id)
VALUES ($1, $2)
ON CONFLICT (user_id, article_id) DO NOTHING;
```

### RLS Policy Violations

**Scenario**: User attempts to access another user's data

**Handling**:
- Query returns empty result set (no error thrown)
- Application treats as "not found" scenario
- Prevents information leakage about other users' data

## Testing Strategy

### Schema Validation Tests

1. **Table Creation**: Verify all tables, columns, and constraints exist
2. **Index Verification**: Confirm all indexes are created with correct columns
3. **Foreign Key Constraints**: Test cascade behaviors (DELETE, SET NULL)
4. **Unique Constraints**: Verify duplicate prevention

### Performance Tests

1. **Index Usage**: Use `EXPLAIN ANALYZE` to verify index utilization
2. **Query Performance**: Benchmark common queries:
   - Fetch latest 20 articles by category
   - Retrieve user's saved articles
   - Full-text search across articles
3. **Concurrent Writes**: Test multiple users saving articles simultaneously

### Security Tests

1. **RLS Policy Enforcement**: 
   - Verify users can only access their own profiles
   - Confirm users can only manage their own saved articles
   - Test that unauthenticated requests are blocked
2. **SQL Injection**: Validate parameterized queries prevent injection
3. **Data Isolation**: Ensure no cross-user data leakage

### Data Integrity Tests

1. **Cascade Deletes**: 
   - Delete user → verify profile and saved_articles removed
   - Delete article → verify saved_articles entries removed
2. **Trigger Functionality**: Verify `updated_at` auto-updates on profile changes
3. **Default Values**: Confirm timestamps and booleans use correct defaults

### Migration Tests

1. **Idempotency**: Run migration scripts multiple times without errors
2. **Rollback**: Verify down migrations restore previous state
3. **Data Preservation**: Ensure existing data survives schema changes

## Performance Optimization Guidelines

### Query Patterns

**Recommended**:
```sql
-- Paginated latest news with category filter
SELECT * FROM news_articles 
WHERE category = $1 
ORDER BY published_at DESC 
LIMIT 20 OFFSET $2;

-- User's saved articles with article details
SELECT na.* FROM news_articles na
JOIN saved_articles sa ON na.id = sa.article_id
WHERE sa.user_id = auth.uid()
ORDER BY sa.saved_at DESC
LIMIT 20;
```

**Avoid**:
```sql
-- No LIMIT clause (fetches all rows)
SELECT * FROM news_articles;

-- SELECT * without WHERE on large tables
SELECT * FROM ai_activity_logs;
```

### Index Maintenance

- **Analyze Statistics**: Run `ANALYZE` after bulk inserts
- **Reindex**: Periodically rebuild indexes on high-churn tables
- **Monitor Bloat**: Check for index bloat on frequently updated tables

### Connection Pooling

- Use Supabase's built-in connection pooler (PgBouncer)
- Configure appropriate pool size based on expected concurrent users
- Use transaction mode for short-lived queries

## Security Considerations

### RLS Policy Design

Policies are designed to be:
- **Restrictive by default**: No access unless explicitly granted
- **User-scoped**: All policies check `auth.uid()`
- **Minimal privilege**: Users can only perform necessary operations

### Sensitive Data

- **Phone numbers**: Stored in plaintext but protected by RLS
- **API URLs**: Stored in `sources` table (admin access only)
- **Cost data**: Protected in `ai_activity_logs` (admin access only)

### Public vs Protected Tables

**Public** (no RLS):
- `news_articles`: All users can read
- `sources`: Read-only for application logic

**Protected** (RLS enabled):
- `profiles`: User-specific access
- `saved_articles`: User-specific access

## Deployment Notes

### Migration Order

1. Create `profiles` table (depends on `auth.users`)
2. Create `news_articles` table (independent)
3. Create `sources` table (independent)
4. Create `saved_articles` table (depends on profiles and news_articles)
5. Create `ai_activity_logs` table (depends on news_articles)
6. Create all indexes
7. Create triggers (updated_at for profiles)
8. Enable RLS and create policies

### Initial Data

- No seed data required for production
- Development: Consider adding sample articles and sources
- Test: Create fixture data for automated tests

### Monitoring

- Track query performance using Supabase dashboard
- Monitor index usage with `pg_stat_user_indexes`
- Set up alerts for slow queries (>100ms)
- Track AI costs using `ai_activity_logs` aggregations
