export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      access_sites: {
        Row: {
          active: boolean
          code: string | null
          created_at: string
          default_method: string | null
          deleted_at: string | null
          id: string
          name: string
          notes: string | null
          org_id: string | null
          owner_profile_id: string | null
          segment: string | null
          supports_side: string
          synonyms: string[]
          updated_at: string
          vessel_name: string | null
          vessel_system: string | null
        }
        Insert: {
          active?: boolean
          code?: string | null
          created_at?: string
          default_method?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          notes?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          segment?: string | null
          supports_side?: string
          synonyms?: string[]
          updated_at?: string
          vessel_name?: string | null
          vessel_system?: string | null
        }
        Update: {
          active?: boolean
          code?: string | null
          created_at?: string
          default_method?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          segment?: string | null
          supports_side?: string
          synonyms?: string[]
          updated_at?: string
          vessel_name?: string | null
          vessel_system?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_sites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_sites_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_profile_id: string | null
          after: Json | null
          before: Json | null
          context: Json | null
          created_at: string
          entity_id: string
          entity_table: string
          id: string
          org_id: string | null
          owner_profile_id: string | null
        }
        Insert: {
          action: string
          actor_profile_id?: string | null
          after?: Json | null
          before?: Json | null
          context?: Json | null
          created_at?: string
          entity_id: string
          entity_table: string
          id?: string
          org_id?: string | null
          owner_profile_id?: string | null
        }
        Update: {
          action?: string
          actor_profile_id?: string | null
          after?: Json | null
          before?: Json | null
          context?: Json | null
          created_at?: string
          entity_id?: string
          entity_table?: string
          id?: string
          org_id?: string | null
          owner_profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_access_sites: {
        Row: {
          access_site_id: string | null
          case_id: string
          created_at: string
          id: string
          idx: number
          method: string | null
          notes: string | null
          planned_sheath_id: string | null
          resolved_label: string | null
          sheath_fr: number | null
          sheath_length_cm: number | null
          side: string | null
          updated_at: string
          vessel: string | null
        }
        Insert: {
          access_site_id?: string | null
          case_id: string
          created_at?: string
          id?: string
          idx?: number
          method?: string | null
          notes?: string | null
          planned_sheath_id?: string | null
          resolved_label?: string | null
          sheath_fr?: number | null
          sheath_length_cm?: number | null
          side?: string | null
          updated_at?: string
          vessel?: string | null
        }
        Update: {
          access_site_id?: string | null
          case_id?: string
          created_at?: string
          id?: string
          idx?: number
          method?: string | null
          notes?: string | null
          planned_sheath_id?: string | null
          resolved_label?: string | null
          sheath_fr?: number | null
          sheath_length_cm?: number | null
          side?: string | null
          updated_at?: string
          vessel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_access_sites_access_site_id_fkey"
            columns: ["access_site_id"]
            isOneToOne: false
            referencedRelation: "access_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_access_sites_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_access_sites_planned_sheath_id_fkey"
            columns: ["planned_sheath_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
        ]
      }
      case_items_planned: {
        Row: {
          case_id: string
          catalog_item_id: string
          created_at: string
          id: string
          pathway_id: string | null
          quantity: number
          rationale: string | null
          required: boolean
          updated_at: string
        }
        Insert: {
          case_id: string
          catalog_item_id: string
          created_at?: string
          id?: string
          pathway_id?: string | null
          quantity?: number
          rationale?: string | null
          required?: boolean
          updated_at?: string
        }
        Update: {
          case_id?: string
          catalog_item_id?: string
          created_at?: string
          id?: string
          pathway_id?: string | null
          quantity?: number
          rationale?: string | null
          required?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_items_planned_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_items_planned_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_items_planned_pathway_id_fkey"
            columns: ["pathway_id"]
            isOneToOne: false
            referencedRelation: "case_pathways"
            referencedColumns: ["id"]
          },
        ]
      }
      case_items_used: {
        Row: {
          case_id: string
          catalog_item_id: string
          created_at: string
          id: string
          note: string | null
          quantity: number
          source: string
          updated_at: string
        }
        Insert: {
          case_id: string
          catalog_item_id: string
          created_at?: string
          id?: string
          note?: string | null
          quantity?: number
          source: string
          updated_at?: string
        }
        Update: {
          case_id?: string
          catalog_item_id?: string
          created_at?: string
          id?: string
          note?: string | null
          quantity?: number
          source?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_items_used_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_items_used_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
        ]
      }
      case_pathways: {
        Row: {
          access_site_instance_id: string
          case_id: string
          created_at: string
          id: string
          idx: number
          name: string
          target_lesion: string | null
          up_and_over: boolean
          updated_at: string
        }
        Insert: {
          access_site_instance_id: string
          case_id: string
          created_at?: string
          id?: string
          idx?: number
          name: string
          target_lesion?: string | null
          up_and_over?: boolean
          updated_at?: string
        }
        Update: {
          access_site_instance_id?: string
          case_id?: string
          created_at?: string
          id?: string
          idx?: number
          name?: string
          target_lesion?: string | null
          up_and_over?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_pathways_access_site_instance_id_fkey"
            columns: ["access_site_instance_id"]
            isOneToOne: false
            referencedRelation: "case_access_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_pathways_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string
          created_by: string
          deleted_at: string | null
          finalized_at: string | null
          id: string
          location_id: string
          org_id: string | null
          owner_profile_id: string | null
          patient_height_cm: number | null
          performed_at: string | null
          procedure_id: string | null
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          deleted_at?: string | null
          finalized_at?: string | null
          id?: string
          location_id: string
          org_id?: string | null
          owner_profile_id?: string | null
          patient_height_cm?: number | null
          performed_at?: string | null
          procedure_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          finalized_at?: string | null
          id?: string
          location_id?: string
          org_id?: string | null
          owner_profile_id?: string | null
          patient_height_cm?: number | null
          performed_at?: string | null
          procedure_id?: string | null
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cases_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_items: {
        Row: {
          active: boolean
          attributes: Json
          barcode: string | null
          brand: string | null
          category: string
          created_at: string
          deleted_at: string | null
          id: string
          model: string | null
          org_id: string | null
          owner_profile_id: string | null
          sku: string | null
          udi: string | null
          updated_at: string
          vendor: string | null
        }
        Insert: {
          active?: boolean
          attributes?: Json
          barcode?: string | null
          brand?: string | null
          category: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          model?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          sku?: string | null
          udi?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Update: {
          active?: boolean
          attributes?: Json
          barcode?: string | null
          brand?: string | null
          category?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          model?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          sku?: string | null
          udi?: string | null
          updated_at?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_items_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compatibility_rules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          lhs_attr: string
          message: string
          op: string
          org_id: string | null
          owner_profile_id: string | null
          rhs: string
          rule_type: string
          severity: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          lhs_attr: string
          message: string
          op: string
          org_id?: string | null
          owner_profile_id?: string | null
          rhs: string
          rule_type: string
          severity: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          lhs_attr?: string
          message?: string
          op?: string
          org_id?: string | null
          owner_profile_id?: string | null
          rhs?: string
          rule_type?: string
          severity?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compatibility_rules_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compatibility_rules_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean
          location_id: string
          name: string
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          location_id: string
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean
          location_id?: string
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      exports: {
        Row: {
          case_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          kind: string
          org_id: string | null
          owner_profile_id: string | null
          storage_key: string
        }
        Insert: {
          case_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          kind: string
          org_id?: string | null
          owner_profile_id?: string | null
          storage_key: string
        }
        Update: {
          case_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          kind?: string
          org_id?: string | null
          owner_profile_id?: string | null
          storage_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "exports_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exports_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      location_inventory: {
        Row: {
          catalog_item_id: string
          created_at: string
          id: string
          is_favorite: boolean
          last_verified_at: string | null
          location_id: string
          notes: string | null
          par_min: number | null
          stock_status: string
          updated_at: string
        }
        Insert: {
          catalog_item_id: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_verified_at?: string | null
          location_id: string
          notes?: string | null
          par_min?: number | null
          stock_status?: string
          updated_at?: string
        }
        Update: {
          catalog_item_id?: string
          created_at?: string
          id?: string
          is_favorite?: boolean
          last_verified_at?: string | null
          location_id?: string
          notes?: string | null
          par_min?: number | null
          stock_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_inventory_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "location_inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          notes: string | null
          org_id: string | null
          owner_profile_id: string | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          notes?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          org_id?: string | null
          owner_profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          org_id: string
          profile_id: string
          role: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          org_id: string
          profile_id: string
          role: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          org_id?: string
          profile_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          kind: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          kind?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      procedures: {
        Row: {
          active: boolean
          code: string
          created_at: string
          defaults: Json | null
          deleted_at: string | null
          id: string
          name: string
          org_id: string | null
          owner_profile_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          defaults?: Json | null
          deleted_at?: string | null
          id?: string
          name: string
          org_id?: string | null
          owner_profile_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          defaults?: Json | null
          deleted_at?: string | null
          id?: string
          name?: string
          org_id?: string | null
          owner_profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procedures_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "procedures_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          default_org_id: string | null
          display_name: string
          email: string | null
          id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_org_id?: string | null
          display_name?: string
          email?: string | null
          id: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_org_id?: string | null
          display_name?: string
          email?: string | null
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_org_id_fkey"
            columns: ["default_org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          active: boolean
          created_at: string
          deleted_at: string | null
          id: string
          name: string
          org_id: string | null
          owner_profile_id: string | null
          payload: Json
          procedure_id: string | null
          scope: string
          updated_at: string
          version: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          name: string
          org_id?: string | null
          owner_profile_id?: string | null
          payload: Json
          procedure_id?: string | null
          scope: string
          updated_at?: string
          version?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          name?: string
          org_id?: string | null
          owner_profile_id?: string | null
          payload?: Json
          procedure_id?: string | null
          scope?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "templates_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_owner_profile_id_fkey"
            columns: ["owner_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "templates_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "procedures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_org_role: {
        Args: { p_org_id: string; p_roles: string[] }
        Returns: boolean
      }
      is_org_member: { Args: { p_org_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
