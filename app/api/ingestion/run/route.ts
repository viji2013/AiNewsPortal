import { NextRequest, NextResponse } from 'next/server'
import { ArticleIngestor } from '@/lib/ingestion/ArticleIngestor'
import { ArticleSummarizer } from '@/lib/openai/summarizer'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 300 // 5 minutes for Vercel Pro
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Fetch active sources
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*')
      .eq('is_active', true)

    if (sourcesError || !sources || sources.length === 0) {
      return NextResponse.json(
        { error: 'No active sources found', details: sourcesError },
        { status: 400 }
      )
    }

    const ingestor = new ArticleIngestor()
    const summarizer = new ArticleSummarizer()

    let totalIngested = 0
    let totalSkipped = 0
    const results = []

    // Process each source
    for (const source of sources) {
      try {
        console.log(`Processing source: ${source.name}`)
        const articles = await ingestor.fetchArticles(source)

        let sourceIngested = 0
        let sourceSkipped = 0

        for (const article of articles) {
          try {
            // Check for duplicates
            const isDuplicate = await ingestor.checkDuplicate(article.url)
            if (isDuplicate) {
              sourceSkipped++
              continue
            }

            // Summarize article
            const summary = await summarizer.summarizeArticle(article.content)

            // Categorize article
            const category = ingestor.categorize(article)

            // Insert article
            const articleId = await ingestor.insertArticle({
              title: article.title,
              summary: summary.text,
              category,
              source: source.name,
              url: article.url,
              image_url: article.imageUrl,
              published_at: article.publishedAt,
            })

            if (articleId) {
              // Log AI activity
              await supabase.from('ai_activity_logs').insert({
                article_id: articleId,
                llm_provider: 'openai-gpt-4o-mini',
                tokens_used: summary.tokens,
                cost_estimate: summary.cost,
              })

              sourceIngested++
            }
          } catch (articleError) {
            console.error(`Error processing article from ${source.name}:`, articleError)
          }
        }

        totalIngested += sourceIngested
        totalSkipped += sourceSkipped

        results.push({
          source: source.name,
          ingested: sourceIngested,
          skipped: sourceSkipped,
          total: articles.length,
        })
      } catch (sourceError) {
        console.error(`Error processing source ${source.name}:`, sourceError)
        results.push({
          source: source.name,
          error: sourceError instanceof Error ? sourceError.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalIngested,
      totalSkipped,
      sources: results,
    })
  } catch (error) {
    console.error('Ingestion error:', error)
    return NextResponse.json(
      {
        error: 'Ingestion failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
