import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function LogsViewerPage() {
  const supabase = await createClient()

  // Get AI activity logs
  const { data: aiLogs } = await supabase
    .from('ai_activity_logs')
    .select('*, news_articles(title, category)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate statistics
  const totalCost = aiLogs?.reduce((sum, log) => sum + (log.cost_estimate || 0), 0) || 0
  const totalTokens = aiLogs?.reduce((sum, log) => sum + (log.tokens_used || 0), 0) || 0
  const avgCostPerArticle = aiLogs?.length ? totalCost / aiLogs.length : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Activity Logs</h1>
        <p className="text-slate-400">View ingestion and AI activity logs</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total AI Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${totalCost.toFixed(4)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Tokens Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {totalTokens.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-400">
              Avg Cost per Article
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              ${avgCostPerArticle.toFixed(6)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Activity Logs */}
      <Card>
        <CardHeader>
          <CardTitle>AI Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Article</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Provider</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Tokens</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Cost</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {aiLogs?.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <p className="text-white max-w-md truncate">
                        {log.news_articles?.title || 'Unknown Article'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {log.news_articles?.category?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{log.llm_provider}</td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      {log.tokens_used?.toLocaleString() || 0}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ${log.cost_estimate?.toFixed(6) || '0.000000'}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 text-sm">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(!aiLogs || aiLogs.length === 0) && (
            <p className="text-center text-slate-400 py-8">No activity logs yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Activity Logs | Admin',
  description: 'View ingestion and AI activity logs',
}
