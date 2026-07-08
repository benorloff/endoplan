import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/get-user'
import { createCaseFromForm } from '@/lib/case/create-case'
import { createClient } from '@/lib/supabase/server'
import { getTenantContext } from '@/lib/tenant/context'
import { createCaseSchema } from '@/schemas/create-case'
import type { CreateCaseForm } from '@/types/domain'

/**
 * Creates a draft case from the create-case workflow form.
 */
export async function POST(request: Request) {
  try {
    const { user, profile } = await requireAuth()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const form = createCaseSchema.parse(body) as CreateCaseForm

    const tenant = await getTenantContext(user.id)
    const supabase = await createClient()

    const result = await createCaseFromForm(supabase, form, tenant, user.id)

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }

    const message =
      error instanceof Error ? error.message : 'Failed to create case'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
