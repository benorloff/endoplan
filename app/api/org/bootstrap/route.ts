import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/get-user'
import { z } from 'zod'

const createOrgSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  kind: z.enum(['hospital', 'asc', 'clinic', 'obl', 'other']).optional(),
  setAsDefault: z.boolean().optional(),
})

/**
 * API route to create an organization and bootstrap org membership
 */
export async function POST(request: Request) {
  try {
    const { user, profile } = await requireAuth()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, kind, setAsDefault } = createOrgSchema.parse(body)

    const supabase = await createClient()

    // Create organization
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name,
        kind: kind ?? null,
      })
      .select()
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }

    // Create org_members row (bootstrap policy allows this)
    const { error: memberError } = await supabase.from('org_members').insert({
      org_id: org.id,
      profile_id: user.id,
      role: 'org_admin',
    })

    if (memberError) {
      // Clean up org if member creation fails
      await supabase.from('organizations').delete().eq('id', org.id)
      return NextResponse.json({ error: 'Failed to create organization membership' }, { status: 500 })
    }

    // Optionally set as default org
    if (setAsDefault) {
      await supabase
        .from('profiles')
        .update({ default_org_id: org.id })
        .eq('id', user.id)
    }

    return NextResponse.json({ org }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
