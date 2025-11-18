import { LoginForm } from '@/components/auth/LoginForm'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/auth/actions'

export default async function LoginPage() {
  // Redirect if already logged in
  const user = await getUser()
  if (user) {
    redirect('/feed')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">AI News App</h1>
          <p className="text-slate-400">Stay updated with the latest in AI</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Sign In</h2>
          <LoginForm />
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm mb-3">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-slate-500 text-xs">
            💡 You can browse articles as a guest without signing in
          </p>
        </div>
      </div>
    </div>
  )
}
