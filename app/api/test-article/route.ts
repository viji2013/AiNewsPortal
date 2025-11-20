import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'No ID provided' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', parseInt(id))
    .single()

  return NextResponse.json({
    found: !!data,
    error: error?.message,
    article: data,
  })
}
