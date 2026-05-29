export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      kit_files: {
        Row: { created_at: string; file_name: string; id: string; label: string | null; meta: string | null; skit_id: string; storage_path: string; type: Database["public"]["Enums"]["kit_file_type"] }
        Insert: { created_at?: string; file_name: string; id?: string; label?: string | null; meta?: string | null; skit_id: string; storage_path: string; type: Database["public"]["Enums"]["kit_file_type"] }
        Update: { created_at?: string; file_name?: string; id?: string; label?: string | null; meta?: string | null; skit_id?: string; storage_path?: string; type?: Database["public"]["Enums"]["kit_file_type"] }
        Relationships: [{ foreignKeyName: "kit_files_skit_id_fkey"; columns: ["skit_id"]; isOneToOne: false; referencedRelation: "skits"; referencedColumns: ["id"] }]
      }
      newsletter_subscribers: {
        Row: { created_at: string; email: string; id: string }
        Insert: { created_at?: string; email: string; id?: string }
        Update: { created_at?: string; email?: string; id?: string }
        Relationships: []
      }
      profiles: {
        Row: { created_at: string; email: string; full_name: string | null; id: string; plan: string | null; role: Database["public"]["Enums"]["user_role"]; updated_at: string }
        Insert: { created_at?: string; email: string; full_name?: string | null; id: string; plan?: string | null; role?: Database["public"]["Enums"]["user_role"]; updated_at?: string }
        Update: { created_at?: string; email?: string; full_name?: string | null; id?: string; plan?: string | null; role?: Database["public"]["Enums"]["user_role"]; updated_at?: string }
        Relationships: []
      }
      settings: {
        Row: { host_name: string; id: number; program_name: string; release_day: string; weekly_email: boolean }
        Insert: { host_name?: string; id?: number; program_name?: string; release_day?: string; weekly_email?: boolean }
        Update: { host_name?: string; id?: number; program_name?: string; release_day?: string; weekly_email?: boolean }
        Relationships: []
      }
      skit_submissions: {
        Row: { created_at: string; email: string; id: string; message: string | null; parsha: string | null; school: string | null; status: Database["public"]["Enums"]["submission_status"]; submitter_name: string; video_url: string | null }
        Insert: { created_at?: string; email: string; id?: string; message?: string | null; parsha?: string | null; school?: string | null; status?: Database["public"]["Enums"]["submission_status"]; submitter_name: string; video_url?: string | null }
        Update: { created_at?: string; email?: string; id?: string; message?: string | null; parsha?: string | null; school?: string | null; status?: Database["public"]["Enums"]["submission_status"]; submitter_name?: string; video_url?: string | null }
        Relationships: []
      }
      skits: {
        Row: { chumash: string | null; created_at: string; description: string | null; duration: string | null; hebrew_date: string | null; id: string; issue_number: number | null; parsha: string; performed_by: string | null; release_date: string | null; skit_cast: string | null; slug: string; status: Database["public"]["Enums"]["skit_status"]; thumbnail_url: string | null; title: string; updated_at: string; views: number; youtube_id: string | null }
        Insert: { chumash?: string | null; created_at?: string; description?: string | null; duration?: string | null; hebrew_date?: string | null; id?: string; issue_number?: number | null; parsha: string; performed_by?: string | null; release_date?: string | null; skit_cast?: string | null; slug: string; status?: Database["public"]["Enums"]["skit_status"]; thumbnail_url?: string | null; title: string; updated_at?: string; views?: number; youtube_id?: string | null }
        Update: { chumash?: string | null; created_at?: string; description?: string | null; duration?: string | null; hebrew_date?: string | null; id?: string; issue_number?: number | null; parsha?: string; performed_by?: string | null; release_date?: string | null; skit_cast?: string | null; slug?: string; status?: Database["public"]["Enums"]["skit_status"]; thumbnail_url?: string | null; title?: string; updated_at?: string; views?: number; youtube_id?: string | null }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { has_kit_access: { Args: never; Returns: boolean }; is_admin: { Args: never; Returns: boolean } }
    Enums: {
      kit_file_type: "script" | "costumes" | "notes"
      skit_status: "draft" | "scheduled" | "live"
      submission_status: "new" | "reviewing" | "featured" | "archived"
      user_role: "admin" | "rebbi" | "school" | "free"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]
export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
