import { getUser } from '@/lib/auth/actions'
import { getProfile } from '@/lib/supabase/queries'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfile(user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Customize your AI News experience</p>
        </div>

        <SettingsForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Settings | AI News',
  description: 'Customize your AI News experience',
}
