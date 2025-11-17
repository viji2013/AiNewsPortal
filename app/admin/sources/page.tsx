import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function SourcesManagementPage() {
  const supabase = await createClient()

  const { data: sources } = await supabase
    .from('sources')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sources Management</h1>
          <p className="text-slate-400">Manage news sources and their configurations</p>
        </div>
        <Button>Add Source</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News Sources ({sources?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sources?.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-medium">{source.name}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        source.is_active
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {source.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                      {source.type.toUpperCase()}
                    </span>
                  </div>
                  {source.api_url && (
                    <p className="text-sm text-slate-400 truncate max-w-2xl">
                      {source.api_url}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {(!sources || sources.length === 0) && (
              <p className="text-center text-slate-400 py-8">
                No sources configured. Add a source to start ingesting articles.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Sources Management | Admin',
  description: 'Manage news sources',
}
