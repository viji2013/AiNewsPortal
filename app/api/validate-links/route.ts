import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 300
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    const isManualTrigger = request.nextUrl.searchParams.get('manual') === 'true'

    if (!isManualTrigger && authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all articles
    const { data: articles, error } = await supabase
      .from('news_articles')
      .select('id, url')
      .order('published_at', { ascending: false })
      .limit(100) // Check last 100 articles

    if (error || !articles) {
      return NextResponse.json(
        { error: 'Failed to fetch articles', details: error },
        { status: 500 }
      )
    }

    let validCount = 0
    let invalidCount = 0
    const invalidUrls: string[] = []

    // Check each URL
    for (const article of articles) {
      try {
        const response = await fetch(article.url, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        })

        if (response.ok) {
          validCount++
        } else {
          invalidCount++
          invalidUrls.push(article.url)
          console.log(`Invalid URL (${response.status}): ${article.url}`)
        }
      } catch (error) {
        invalidCount++
        invalidUrls.push(article.url)
        console.log(`Failed to check URL: ${article.url}`)
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalChecked: articles.length,
      validCount,
      invalidCount,
      invalidUrls: invalidUrls.slice(0, 10), // Return first 10 invalid URLs
    })
  } catch (error) {
    console.error('Link validation error:', error)
    return NextResponse.json(
      {
        error: 'Validation failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
