import { getUser } from '@/lib/auth/actions'
import { getProfile } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  if (profile?.role !== 'admin') {
    redirect('/feed')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold text-white">
                Admin Panel
              </Link>
              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/articles"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Articles
                </Link>
                <Link
                  href="/admin/sources"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Sources
                </Link>
                <Link
                  href="/admin/logs"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Logs
                </Link>
              </div>
            </div>
            <Link
              href="/feed"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Back to Feed
            </Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
