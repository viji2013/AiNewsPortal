import { createClient } from '@/lib/supabase/server'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ArticlesPageProps {
  searchParams: {
    q?: string
    category?: string
    page?: string
  }
}

export default async function ArticlesManagementPage({ searchParams }: ArticlesPageProps) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  let query = supabase
    .from('news_articles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (searchParams.category) {
    query = query.eq('category', searchParams.category)
  }

  if (searchParams.q) {
    query = query.textSearch('title,summary', searchParams.q)
  }

  const { data: articles, count } = await query

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Articles Management</h1>
        <p className="text-slate-400">View, edit, and manage all articles</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              defaultValue={searchParams.q}
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              defaultValue={searchParams.category || ''}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="llms">LLMs</option>
              <option value="cv">Computer Vision</option>
              <option value="ml">Machine Learning</option>
              <option value="agi">AGI</option>
              <option value="robotics">Robotics</option>
              <option value="agents">Agents</option>
              <option value="nlp">NLP</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Title</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Source</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Published</th>
                  <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles?.map((article) => (
                  <tr key={article.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="max-w-md">
                        <p className="text-white font-medium truncate">{article.title}</p>
                        <p className="text-sm text-slate-400 truncate">{article.summary}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                        {article.category.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{article.source}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(article.published_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {page > 1 && (
                <Link href={`/admin/articles?page=${page - 1}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              <span className="px-4 py-2 text-slate-400">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={`/admin/articles?page=${page + 1}`}>
                  <Button variant="outline">Next</Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const metadata = {
  title: 'Articles Management | Admin',
  description: 'Manage all articles',
}
