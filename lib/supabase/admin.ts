import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client for server-only use (service role)
 * WARNING: Never expose this client to the browser/client components
 * This client bypasses RLS and should only be used for server-side admin tasks
 * like exports, migrations, or other administrative operations
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for admin client. This should only be set on the server.'
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
