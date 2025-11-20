import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { IngestionTrigger } from '@/components/admin/IngestionTrigger'

async function getStats() {
  try {
    const supabase = await createClient()

    // Get total articles
    const { count: articlesCount } = await supabase
      .from('news_articles')
      .select('*', { count: 'exact', head: true })

    // Get total sources
    const { count: sourcesCount } = await supabase
      .from('sources')
      .select('*', { count: 'exact', head: true })

    // Get active sources
    const { count: activeSourcesCount } = await supabase
      .from('sources')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    // Get AI activity logs with cost and tokens
    const { data: logs } = await supabase
      .from('ai_activity_logs')
      .select('tokens_used, cost_estimate')
      .order('created_at', { ascending: false })
      .limit(100)

    const totalCost = logs?.reduce((sum, log) => sum + (Number(log.cost_estimate) || 0), 0) || 0
    const totalTokens = logs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0

    // Get recent logs with article info
    const { data: recentLogs } = await supabase
      .from('ai_activity_logs')
      .select('*, news_articles(title)')
      .order('created_at', { ascending: false })
      .limit(5)

    // Check if OpenAI key is configured
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY

    return {
      articlesCount: articlesCount || 0,
      sourcesCount: sourcesCount || 0,
      activeSourcesCount: activeSourcesCount || 0,
      totalCost,
      totalTokens,
      recentLogs: recentLogs || [],
      hasOpenAIKey,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      articlesCount: 0,
      sourcesCount: 0,
      activeSourcesCount: 0,
      totalCost: 0,
      totalTokens: 0,
      recentLogs: [],
      hasOpenAIKey: false,
    }
  }
}



export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Manage your AI News platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.articlesCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Active Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.activeSourcesCount} / {stats.sourcesCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total AI Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${stats.totalCost.toFixed(4)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.totalTokens.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">OpenAI API Key</span>
              <span className={`px-3 py-1 rounded-full text-sm ${stats.hasOpenAIKey ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {stats.hasOpenAIKey ? '✓ Configured' : '✗ Missing'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active Sources</span>
              <span className={`px-3 py-1 rounded-full text-sm ${stats.activeSourcesCount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {stats.activeSourcesCount > 0 ? `✓ ${stats.activeSourcesCount} Active` : '⚠ No Sources'}
              </span>
            </div>
          </div>
          {stats.activeSourcesCount === 0 && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Action Required:</strong> Run the SQL script <code className="bg-slate-800 px-2 py-1 rounded">supabase/add-ai-news-sources.sql</code> in your Supabase SQL Editor to add RSS sources.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Ingestion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manual Ingestion</CardTitle>
        </CardHeader>
        <CardContent>
          <IngestionTrigger 
            hasOpenAIKey={stats.hasOpenAIKey}
            activeSourcesCount={stats.activeSourcesCount}
          />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent AI Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentLogs.length === 0 ? (
              <p className="text-slate-400">No recent activity</p>
            ) : (
              stats.recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {log.news_articles?.title || 'Unknown Article'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {log.llm_provider} • {log.tokens_used} tokens • $
                      {log.cost_estimate?.toFixed(6)}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400">
                    {new Date(log.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Admin Dashboard | AI News',
  description: 'Manage your AI News platform',
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
