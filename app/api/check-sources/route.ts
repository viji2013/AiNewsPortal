import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get all sources
    const { data: sources, error } = await supabase
      .from('sources')
      .select('*')
      .order('id', { ascending: true })
    
    // Get count
    const { count } = await supabase
      .from('sources')
      .select('*', { count: 'exact', head: true })
    
    // Get active count
    const { count: activeCount } = await supabase
      .from('sources')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
    
    return NextResponse.json({
      success: true,
      totalSources: count ?? 0,
      activeSources: activeCount ?? 0,
      sources: sources ?? [],
      error: error?.message,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      instructions: count === 0 ? 'Run supabase/add-ai-news-sources.sql in Supabase SQL Editor to add sources' : null
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
