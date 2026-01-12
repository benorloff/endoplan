export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string
          role: 'admin' | 'surgeon' | 'manager' | 'readonly'
          status: 'active' | 'disabled'
          default_org_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      organizations: {
        Row: {
          id: string
          name: string
          kind: 'hospital' | 'asc' | 'clinic' | 'obl' | 'other' | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['organizations']['Row'], 'created_at' | 'updated_at' | 'id'>
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
      }
      org_members: {
        Row: {
          id: string
          org_id: string
          profile_id: string
          role: 'org_admin' | 'surgeon' | 'manager' | 'readonly'
          invited_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['org_members']['Row'], 'created_at' | 'id'>
        Update: Partial<Database['public']['Tables']['org_members']['Insert']>
      }
      locations: {
        Row: {
          id: string
          owner_profile_id: string | null
          org_id: string | null
          code: string
          name: string
          notes: string | null
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['locations']['Row'], 'created_at' | 'updated_at' | 'id'>
        Update: Partial<Database['public']['Tables']['locations']['Insert']>
      }
      catalog_items: {
        Row: {
          id: string
          owner_profile_id: string | null
          org_id: string | null
          category: string
          vendor: string | null
          brand: string | null
          model: string | null
          sku: string | null
          udi: string | null
          barcode: string | null
          attributes: Json
          active: boolean
          created_at: string
          updated_at: string
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['catalog_items']['Row'], 'created_at' | 'updated_at' | 'id'>
        Update: Partial<Database['public']['Tables']['catalog_items']['Insert']>
      }
      cases: {
        Row: {
          id: string
          owner_profile_id: string | null
          org_id: string | null
          location_id: string
          procedure_id: string | null
          patient_height_cm: number | null
          status: 'draft' | 'final' | 'performed' | 'archived'
          created_by: string
          updated_by: string | null
          created_at: string
          updated_at: string
          finalized_at: string | null
          performed_at: string | null
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['cases']['Row'], 'created_at' | 'updated_at' | 'id'>
        Update: Partial<Database['public']['Tables']['cases']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
