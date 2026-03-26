// Bu dosya Supabase CLI ile otomatik üretilebilir:
// npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
// Şimdilik manuel tip tanımları:

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Plan = 'starter' | 'builder' | 'studio'
export type ProjectStatus = 'completed' | 'draft' | 'processing'
export type CreditLogType = 'generate' | 'refund' | 'bonus' | 'purchase'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          plan: Plan
          credits: number
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          plan?: Plan
          credits?: number
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
        }
        Update: {
          email?: string
          name?: string | null
          plan?: Plan
          credits?: number
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          idea: string
          status: ProjectStatus
          output: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          idea: string
          status?: ProjectStatus
          output?: Json | null
        }
        Update: {
          title?: string
          idea?: string
          status?: ProjectStatus
          output?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      credit_logs: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          amount: number
          type: CreditLogType
          created_at: string
        }
        Insert: {
          user_id: string
          project_id?: string | null
          amount: number
          type: CreditLogType
        }
        Update: {
          user_id?: string
          project_id?: string | null
          amount?: number
          type?: CreditLogType
        }
        Relationships: []
      }
      exports: {
        Row: {
          id: string
          project_id: string
          format: string
          token: string | null
          url: string | null
          created_at: string
        }
        Insert: {
          project_id: string
          format: string
          token?: string | null
          url?: string | null
        }
        Update: {
          project_id?: string
          format?: string
          token?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Kullanışlı tip kısayolları
export type User = Database['public']['Tables']['users']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type CreditLog = Database['public']['Tables']['credit_logs']['Row']
export type Export = Database['public']['Tables']['exports']['Row']

// Proje output yapısı
export interface ProjectOutput {
  projectName: string
  tagline: string
  score: number
  market: {
    tam: string
    sam: string
    som: string
    growth: string
    trend: string
  }
  competitors: Array<{
    name: string
    description: string
    weakness: string
  }>
  brand: {
    names: string[]
    colors: { primary: string; secondary: string; accent: string }
    typography: { heading: string; body: string }
    tone: string
    personality: string
  }
  techStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    auth: string[]
    payment: string[]
    hosting: string[]
    extras: string[]
  }
  pricing: {
    model: string
    plans: Array<{
      name: string
      price: number
      description: string
      features: string[]
    }>
    arr_target: string
  }
  roadmap: {
    phase1: { title: string; duration: string; items: string[] }
    phase2: { title: string; duration: string; items: string[] }
    phase3: { title: string; duration: string; items: string[] }
  }
  risks: Array<{ title: string; mitigation: string }>
}
