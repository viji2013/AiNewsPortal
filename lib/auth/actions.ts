'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithGitHub() {
  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithOTP(phone: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      channel: 'sms',
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function verifyOTP(phone: string, token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, data }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Provide more helpful error messages
    if (error.message === 'Invalid login credentials') {
      return { 
        error: 'Invalid email or password. If you haven\'t signed up yet, please create an account first.' 
      }
    }
    return { error: error.message }
  }

  return { success: true, data }
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Check if email confirmation is required
  if (data.user && !data.session) {
    return { 
      success: true, 
      data,
      message: 'Account created! Please check your email to verify your account before signing in.'
    }
  }

  return { success: true, data }
}
