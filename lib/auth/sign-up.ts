'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type SignUpResult = { error: string } | { success: true }

/**
 * Creates a user via the admin API with email pre-confirmed (no confirmation email sent).
 * Avoids Supabase auth email rate limits on sign-up.
 */
export async function signUpWithEmail(input: {
  email: string
  password: string
  displayName?: string
}): Promise<SignUpResult> {
  const admin = createAdminClient()

  const { error } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      display_name: input.displayName?.trim() ?? '',
    },
  })

  if (error) {
    const message = error.message.toLowerCase()
    if (
      message.includes('already') ||
      message.includes('registered') ||
      error.status === 422
    ) {
      return {
        error: 'An account with this email already exists. Try signing in instead.',
      }
    }
    return { error: error.message }
  }

  return { success: true }
}
