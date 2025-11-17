# OpenAI Integration Explanation

## Overview
OpenAI is integrated into the AI News App to automatically summarize articles fetched from RSS feeds. This happens during the **content ingestion process**.

## Architecture Flow

```
┌─────────────────┐
│  RSS Feed       │
│  Sources        │
└────────┬────────┘
         │
         │ 1. Fetch articles
         ▼
┌─────────────────────────┐
│  ArticleIngestor        │
│  (lib/ingestion/)       │
│  - Fetches RSS feeds    │
│  - Parses articles      │
│  - Checks duplicates    │
└────────┬────────────────┘
         │
         │ 2. Send article content
         ▼
┌─────────────────────────┐
│  ArticleSummarizer      │
│  (lib/openai/)          │
│  - Calls OpenAI API     │
│  - Uses GPT-4o-mini     │
│  - Generates summary    │
│  - Tracks tokens/cost   │
└────────┬────────────────┘
         │
         │ 3. Return summary
         ▼
┌─────────────────────────┐
│  Supabase Database      │
│  - Stores article       │
│  - Stores summary       │
│  - Logs AI activity     │
└─────────────────────────┘
```

## Key Files

### 1. **lib/openai/summarizer.ts**
This is the core OpenAI integration file.

**What it does:**
- Creates an OpenAI client using your API key
- Defines the `ArticleSummarizer` class
- Uses the `gpt-4o-mini` model (cost-effective)
- Sends article content to OpenAI with a system prompt
- Receives AI-generated summaries
- Calculates token usage and costs
- Implements retry logic (3 attempts with exponential backoff)

**Key Configuration:**
```typescript
MODEL = 'gpt-4o-mini'  // The AI model used
MAX_RETRIES = 3        // Retry failed requests
COST_PER_1K_INPUT = 0.00015   // $0.15 per 1M input tokens
COST_PER_1K_OUTPUT = 0.0006   // $0.60 per 1M output tokens
```

**System Prompt:**
```
"You are an AI news summarizer. Create concise, informative summaries 
of AI-related articles. Focus on key facts, developments, and implications. 
Keep summaries between 150-200 words. Use clear, professional language 
suitable for a tech-savvy audience."
```

### 2. **app/api/ingestion/run/route.ts**
This is the API endpoint that triggers the ingestion process.

**What it does:**
- Secured with CRON_SECRET (only authorized requests)
- Fetches active RSS sources from database
- For each article:
  1. Checks if it's a duplicate (skip if yes)
  2. **Calls OpenAI to summarize** ← This is where OpenAI is used!
  3. Categorizes the article
  4. Saves to database
  5. Logs AI activity (tokens used, cost)

**Code snippet showing OpenAI usage:**
```typescript
// Line 63: Summarize article using OpenAI
const summary = await summarizer.summarizeArticle(article.content)

// Line 73: Insert article with AI-generated summary
const articleId = await ingestor.insertArticle({
  title: article.title,
  summary: summary.text,  // ← AI-generated summary
  category,
  source: source.name,
  url: article.url,
  image_url: article.imageUrl,
  published_at: article.publishedAt,
})

// Line 82: Log AI usage for cost tracking
await supabase.from('ai_activity_logs').insert({
  article_id: articleId,
  llm_provider: 'openai-gpt-4o-mini',
  tokens_used: summary.tokens,    // ← Track token usage
  cost_estimate: summary.cost,    // ← Track costs
})
```

## How to Trigger OpenAI Integration

### Option 1: Manual Trigger (Admin Panel)
1. Login as admin
2. Go to `/admin`
3. Click "Trigger Ingestion" button
4. OpenAI will summarize all new articles

### Option 2: Automated (Cron Job)
Set up a cron job to call:
```bash
curl -X GET http://localhost:3000/api/ingestion/run \
  -H "Authorization: Bearer ainews_cron_secret_2025"
```

### Option 3: Direct API Call
```bash
curl -X GET http://localhost:3000/api/ingestion/run \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Cost Tracking

Every time OpenAI is called, the system tracks:
- **Tokens used** (input + output)
- **Estimated cost** (calculated based on token usage)
- **LLM provider** (openai-gpt-4o-mini)
- **Article ID** (which article was summarized)

This data is stored in the `ai_activity_logs` table and displayed in the admin dashboard.

## Environment Variables Required

```env
# .env.local
OPENAI_API_KEY=sk-proj-...  # Your OpenAI API key
CRON_SECRET=ainews_cron_secret_2025  # Security token
```

## Example Flow

1. **RSS Feed has new article:**
   - Title: "GPT-5 Released"
   - Content: 5000 words of detailed information

2. **ArticleIngestor fetches it:**
   - Parses RSS feed
   - Extracts article content
   - Checks if URL already exists (no duplicate)

3. **OpenAI Summarizer processes it:**
   - Sends first 4000 characters to GPT-4o-mini
   - System prompt guides the AI to create a concise summary
   - AI generates 150-200 word summary
   - Returns: summary text, tokens used (e.g., 1200), cost (e.g., $0.0009)

4. **Database stores:**
   - Article with AI-generated summary
   - AI activity log with token/cost data

5. **User sees:**
   - Article card with concise AI summary
   - Can click to read full article at source

## Benefits

- **Automatic summarization**: No manual work needed
- **Consistent quality**: AI ensures professional summaries
- **Cost tracking**: Know exactly how much you're spending
- **Scalable**: Can process hundreds of articles automatically
- **User-friendly**: Readers get quick summaries before clicking through

## Cost Estimation

Using GPT-4o-mini:
- Average article: ~1000 input tokens + ~200 output tokens
- Cost per article: ~$0.0003 (less than a cent!)
- 1000 articles: ~$0.30
- Very affordable for automated summarization!
