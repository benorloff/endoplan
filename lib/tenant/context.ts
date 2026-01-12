import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/db.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type Organization = Database['public']['Tables']['organizations']['Row']

export interface TenantContext {
  mode: 'personal' | 'org' | null
  profileId: string
  orgId: string | null
  profile: Profile
  org: Organization | null
}

/**
 * Gets the current tenant context (personal mode or org mode)
 * Based on the user's profile.default_org_id if set
 */
export async function getTenantContext(
  profileId: string,
  orgIdOverride?: string | null
): Promise<TenantContext> {
  const supabase = await createClient()

  // Get profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single()

  if (profileError || !profile) {
    throw new Error('Profile not found')
  }

  // Determine which org to use (override > default_org_id > null)
  const effectiveOrgId = orgIdOverride ?? profile.default_org_id

  if (!effectiveOrgId) {
    return {
      mode: 'personal',
      profileId,
      orgId: null,
      profile,
      org: null,
    }
  }

  // Verify org membership
  const { data: orgMember } = await supabase
    .from('org_members')
    .select('org_id')
    .eq('profile_id', profileId)
    .eq('org_id', effectiveOrgId)
    .single()

  if (!orgMember) {
    // Not a member - fall back to personal mode
    return {
      mode: 'personal',
      profileId,
      orgId: null,
      profile,
      org: null,
    }
  }

  // Get org details
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', effectiveOrgId)
    .is('deleted_at', null)
    .single()

  if (orgError || !org) {
    // Org not found - fall back to personal mode
    return {
      mode: 'personal',
      profileId,
      orgId: null,
      profile,
      org: null,
    }
  }

  return {
    mode: 'org',
    profileId,
    orgId: effectiveOrgId,
    profile,
    org,
  }
}

/**
 * Builds tenant filter conditions for queries
 * Returns the appropriate WHERE conditions based on tenant context
 */
export function getTenantFilters(tenant: TenantContext) {
  if (tenant.mode === 'org') {
    return {
      org_id: tenant.orgId,
      owner_profile_id: null,
    }
  }
  return {
    owner_profile_id: tenant.profileId,
    org_id: null,
  }
}

/**
 * Builds catalog filter conditions (includes personal, org, and global)
 */
export function getCatalogFilters(tenant: TenantContext) {
  if (tenant.mode === 'org') {
    // Show: org items + global items
    return {
      or: [
        { org_id: tenant.orgId, owner_profile_id: null },
        { org_id: null, owner_profile_id: null },
      ],
    }
  }
  // Show: personal items + global items
  return {
    or: [
      { owner_profile_id: tenant.profileId, org_id: null },
      { owner_profile_id: null, org_id: null },
    ],
  }
}
