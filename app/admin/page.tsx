import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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

    return {
      articlesCount: articlesCount || 0,
      sourcesCount: sourcesCount || 0,
      activeSourcesCount: activeSourcesCount || 0,
      totalCost: 0,
      totalTokens: 0,
      recentLogs: [],
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
    }
  }
}

async function triggerIngestion() {
  'use server'
  
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-news-portal-psi.vercel.app'
    const response = await fetch(`${appUrl}/api/ingestion/run?manual=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error('Error triggering ingestion:', error)
    return false
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

      {/* Manual Ingestion */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manual Ingestion</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 mb-4">
            Trigger article ingestion manually. This will fetch articles from all active sources.
          </p>
          <form action={triggerIngestion}>
            <Button type="submit">Trigger Ingestion</Button>
            <p className="text-xs text-slate-500 mt-2">Note: This may take several minutes to complete</p>
          </form>
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
