export type Json =
  | boolean
  | number
  | string
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type LogLevel = "debug" | "info" | "warn" | "error";
export type ScheduleRunStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type Database = {
  public: {
    Tables: {
      sources: {
        Row: {
          created_at: string;
          enabled: boolean;
          id: string;
          listing_url: string;
          name: string;
          parser_config: Json;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          enabled?: boolean;
          id?: string;
          listing_url: string;
          name: string;
          parser_config?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["sources"]["Insert"]>;
        Relationships: [];
      };
      articles: {
        Row: {
          author: string | null;
          canonical_url: string | null;
          category: string | null;
          content: string;
          created_at: string;
          excerpt: string | null;
          id: string;
          image_url: string | null;
          published_at: string | null;
          source_id: string;
          title: string;
          updated_at: string;
          url: string;
        };
        Insert: {
          author?: string | null;
          canonical_url?: string | null;
          category?: string | null;
          content: string;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          image_url?: string | null;
          published_at?: string | null;
          source_id: string;
          title: string;
          updated_at?: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
        Relationships: [{ foreignKeyName: "articles_source_id_fkey"; columns: ["source_id"]; referencedRelation: "sources"; referencedColumns: ["id"] }];
      };
      article_analyses: {
        Row: {
          analyzed_at: string;
          article_id: string;
          bias_center: number;
          bias_left: number;
          bias_right: number;
          created_at: string;
          framing: Json;
          id: string;
          sentiment: Sentiment;
          summary: string;
        };
        Insert: {
          analyzed_at?: string;
          article_id: string;
          bias_center: number;
          bias_left: number;
          bias_right: number;
          created_at?: string;
          framing?: Json;
          id?: string;
          sentiment: Sentiment;
          summary: string;
        };
        Update: Partial<Database["public"]["Tables"]["article_analyses"]["Insert"]>;
        Relationships: [{ foreignKeyName: "article_analyses_article_id_fkey"; columns: ["article_id"]; referencedRelation: "articles"; referencedColumns: ["id"] }];
      };
      logs: {
        Row: { created_at: string; event: string; id: string; level: LogLevel; message: string; metadata: Json; run_id: string | null };
        Insert: { created_at?: string; event: string; id?: string; level: LogLevel; message: string; metadata?: Json; run_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["logs"]["Insert"]>;
        Relationships: [];
      };
      oxylabs_schedules: {
        Row: { configuration: Json; created_at: string; enabled: boolean; id: string; name: string; oxylabs_schedule_id: string | null; schedule_expression: string; source_id: string | null; updated_at: string };
        Insert: { configuration?: Json; created_at?: string; enabled?: boolean; id?: string; name: string; oxylabs_schedule_id?: string | null; schedule_expression: string; source_id?: string | null; updated_at?: string };
        Update: Partial<Database["public"]["Tables"]["oxylabs_schedules"]["Insert"]>;
        Relationships: [{ foreignKeyName: "oxylabs_schedules_source_id_fkey"; columns: ["source_id"]; referencedRelation: "sources"; referencedColumns: ["id"] }];
      };
      oxylabs_schedule_runs: {
        Row: { created_at: string; error_message: string | null; finished_at: string | null; id: string; output: Json; oxylabs_run_id: string | null; schedule_id: string; started_at: string | null; status: ScheduleRunStatus };
        Insert: { created_at?: string; error_message?: string | null; finished_at?: string | null; id?: string; output?: Json; oxylabs_run_id?: string | null; schedule_id: string; started_at?: string | null; status: ScheduleRunStatus };
        Update: Partial<Database["public"]["Tables"]["oxylabs_schedule_runs"]["Insert"]>;
        Relationships: [{ foreignKeyName: "oxylabs_schedule_runs_schedule_id_fkey"; columns: ["schedule_id"]; referencedRelation: "oxylabs_schedules"; referencedColumns: ["id"] }];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
