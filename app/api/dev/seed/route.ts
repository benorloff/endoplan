import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/get-user'
import { runDemoSeed } from '@/lib/seed/upsert-demo'
import { createAdminClient } from '@/lib/supabase/admin'
import { SEED_IDS } from '@/lib/seed/constants'

/**
 * Dev-only: upserts global catalog + demo org and links the signed-in user.
 */
export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  try {
    const { user, profile } = await requireAuth()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const admin = createAdminClient()
    await runDemoSeed(admin, user.id)

    return NextResponse.json({
      ok: true,
      orgId: SEED_IDS.org.demoHospital,
      locationIds: [
        SEED_IDS.locations.stJudeMain,
        SEED_IDS.locations.stJudeWest,
      ],
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to seed demo data'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
