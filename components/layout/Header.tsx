'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth/actions'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user: User | null
  profile: Profile | null
}

export function Header({ user, profile }: HeaderProps) {
  const pathname = usePathname()

  // Guest users only see Feed
  const navItems = user ? [
    { href: '/feed', label: 'Feed' },
    { href: '/saved', label: 'Saved' },
    { href: '/collections', label: 'Collections' },
    { href: '/settings', label: 'Settings' },
  ] : [
    { href: '/feed', label: 'Feed' },
  ]

  if (user && profile?.role === 'admin') {
    navItems.push({ href: '/admin/dashboard', label: 'Admin' })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/feed" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">AI News</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu or Guest Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {profile?.full_name || user.email}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {profile?.role === 'admin' ? 'Admin' : 'User'}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOut()
                  }}
                  className="text-slate-600 dark:text-slate-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </Button>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-sm text-slate-500 dark:text-slate-400">
                  Browsing as Guest
                </span>
                <Link href="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <nav className="md:hidden flex items-center space-x-1 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  pathname === item.href
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
