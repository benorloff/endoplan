/**
 * CLI seed script — upserts global catalog + demo org (no user linking).
 * Usage: npm run db:seed
 * Optional: PROFILE_ID=<uuid> npm run db:seed  (also links user + demo cases)
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { runDemoSeed } from '../lib/seed/upsert-demo'
import type { Database } from '../lib/db.types'

function loadEnvFile(path: string) {
  if (!existsSync(path)) return
  const content = readFileSync(path, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(resolve(process.cwd(), '.env.local'))
loadEnvFile(resolve(process.cwd(), '.env'))

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const profileId = process.env.PROFILE_ID

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(1)
}

const admin = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  await runDemoSeed(admin, profileId)
  console.log('Demo seed completed.')
  if (!profileId) {
    console.log(
      'Tip: sign in and use Settings → Development → Load Demo Data, or rerun with PROFILE_ID=<your-user-uuid>.'
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
