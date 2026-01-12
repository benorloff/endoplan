import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Gets the current authenticated user and their profile
 * Returns null if not authenticated
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { user, profile: null }
  }

  return { user, profile }
}

/**
 * Requires authentication - redirects to sign-in if not authenticated
 */
export async function requireAuth() {
  const result = await getUser()

  if (!result?.user) {
    redirect('/sign-in')
  }

  return result
}
