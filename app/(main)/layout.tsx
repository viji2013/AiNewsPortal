import { getUser } from '@/lib/auth/actions'
import { getProfile } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  // Allow guest access - don't redirect if no user
  const profile = user ? await getProfile(user.id) : null

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} profile={profile} />
      <main>{children}</main>
    </div>
  )
}
