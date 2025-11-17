import { getUser } from '@/lib/auth/actions'
import { getProfile } from '@/lib/supabase/queries'
import { Header } from '@/components/layout/Header'
import { redirect } from 'next/navigation'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  return (
    <div className="min-h-screen bg-slate-900">
      <Header user={user} profile={profile} />
      <main>{children}</main>
    </div>
  )
}
