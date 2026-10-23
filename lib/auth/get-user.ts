import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Returns the signed-in Supabase user, or null.
 */
export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Returns the signed-in user or redirects to /sign-in.
 */
export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/sign-in')
  return user
}
