/**
 * Fixed UUIDs for deterministic seed data (global catalog + demo org).
 * Safe to reference in tests and seed scripts.
 */
export const SEED_IDS = {
  org: {
    demoHospital: 'a0000001-0000-4000-8000-000000000001',
  },
  locations: {
    stJudeMain: 'a0000002-0000-4000-8000-000000000001',
    stJudeWest: 'a0000003-0000-4000-8000-000000000001',
  },
  procedures: {
    evar: 'b0000001-0000-4000-8000-000000000001',
    tevar: 'b0000002-0000-4000-8000-000000000001',
    fevar: 'b0000003-0000-4000-8000-000000000001',
    branchedEvar: 'b0000004-0000-4000-8000-000000000001',
  },
  accessSites: {
    cfa: 'c0000001-0000-4000-8000-000000000001',
    rightCfa: 'c0000002-0000-4000-8000-000000000001',
    leftCfa: 'c0000003-0000-4000-8000-000000000001',
  },
  catalog: {
    guidewire: 'd0000001-0000-4000-8000-000000000001',
    sheath: 'd0000002-0000-4000-8000-000000000001',
    stentGraft: 'd0000003-0000-4000-8000-000000000001',
  },
  cases: {
    draftEvar: 'e0000001-0000-4000-8000-000000000001',
    draftTevar: 'e0000002-0000-4000-8000-000000000001',
  },
} as const

export const DEMO_ORG_NAME = 'St. Jude Medical Center (Demo)'
