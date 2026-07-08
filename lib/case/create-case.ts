import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/db.types'
import type { CreateCaseForm, ProcedureCode } from '@/types/domain'
import type { TenantContext } from '@/lib/tenant/context'
import {
  ACCESS_STRATEGY_OPTIONS,
  createCaseFormToAccessSiteInserts,
  createCaseFormToCaseInsert,
  createCaseFormToPatient,
} from '@/lib/case/mappers'

type DbClient = SupabaseClient<Database>

export function formatCaseDisplayId(caseId: string): string {
  return `EP-${caseId.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}

export async function resolveProcedureId(
  supabase: DbClient,
  code: ProcedureCode,
  tenant: TenantContext
): Promise<string | null> {
  let query = supabase
    .from('procedures')
    .select('id')
    .eq('code', code)
    .eq('active', true)
    .is('deleted_at', null)

  if (tenant.mode === 'org' && tenant.orgId) {
    query = query.or(`org_id.eq.${tenant.orgId},and(org_id.is.null,owner_profile_id.is.null)`)
  } else {
    query = query.or(
      `owner_profile_id.eq.${tenant.profileId},and(org_id.is.null,owner_profile_id.is.null)`
    )
  }

  const { data, error } = await query.limit(1).maybeSingle()
  if (error) throw error
  return data?.id ?? null
}

export async function resolveAccessSiteIds(
  supabase: DbClient,
  codes: string[]
): Promise<Record<string, string>> {
  const uniqueCodes = [...new Set(codes)]
  const { data, error } = await supabase
    .from('access_sites')
    .select('id, code')
    .in('code', uniqueCodes)
    .is('deleted_at', null)
    .eq('active', true)

  if (error) throw error

  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    if (row.code) map[row.code] = row.id
  }
  return map
}

export function accessSiteCodesForSelection(form: CreateCaseForm): string[] {
  const option = ACCESS_STRATEGY_OPTIONS.find((o) => o.key === form.accessSelection)
  if (!option) return []
  return option.accessSiteCodes
}

export interface CreateCaseResult {
  caseId: string
  displayId: string
  procedureId: string | null
}

export async function createCaseFromForm(
  supabase: DbClient,
  form: CreateCaseForm,
  tenant: TenantContext,
  userId: string
): Promise<CreateCaseResult> {
  const procedureId = await resolveProcedureId(supabase, form.procedureCode, tenant)
  const patient = createCaseFormToPatient(form)

  const caseInsert = createCaseFormToCaseInsert(
    { ...form, procedureId },
    {
      createdBy: userId,
      ownerProfileId: tenant.mode === 'personal' ? tenant.profileId : null,
      orgId: tenant.mode === 'org' ? tenant.orgId : null,
      planningPhysicianId: userId,
    }
  )

  const { data: caseRow, error: caseError } = await supabase
    .from('cases')
    .insert(caseInsert)
    .select('id')
    .single()

  if (caseError || !caseRow) {
    throw new Error(caseError?.message ?? 'Failed to create case')
  }

  const accessSiteCodes = accessSiteCodesForSelection(form)
  const accessSiteIds = await resolveAccessSiteIds(supabase, accessSiteCodes)

  const accessRows = createCaseFormToAccessSiteInserts(
    form,
    caseRow.id,
    accessSiteIds
  )

  if (accessRows.length > 0) {
    const { error: accessError } = await supabase
      .from('case_access_sites')
      .insert(accessRows)

    if (accessError) {
      await supabase.from('cases').delete().eq('id', caseRow.id)
      throw new Error(accessError.message)
    }
  }

  return {
    caseId: caseRow.id,
    displayId: formatCaseDisplayId(caseRow.id),
    procedureId,
  }
}
