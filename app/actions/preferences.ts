'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CategoryPreferences } from '@/types/database'

export async function updatePreferences(preferences: CategoryPreferences) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      preferences,
    })
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/feed')
  revalidatePath('/settings')
}
