
import { Database } from '@/integrations/supabase/types';

// Define our custom database schema
export interface CustomDatabase {
  public: {
    Tables: {
      tests: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: number;
          created_at: string;
          cefr_level: string;
          skill: 'reading' | 'writing' | 'listening' | 'speaking';
          questions: any;
          user_id?: string;
          subject: 'english' | 'math' | 'science' | 'history' | 'bahasa';
        };
        Insert: Omit<CustomDatabase['public']['Tables']['tests']['Row'], 'id' | 'created_at'> & { created_at?: string };
        Update: Partial<Omit<CustomDatabase['public']['Tables']['tests']['Row'], 'id'>>;
      };
      test_attempts: {
        Row: {
          id: string;
          test_id: string;
          user_id: string;
          started_at: string;
          completed_at?: string;
          answers: any;
          feedback?: string;
          score?: number;
        };
        Insert: Omit<CustomDatabase['public']['Tables']['test_attempts']['Row'], 'id' | 'started_at'> & { started_at?: string };
        Update: Partial<Omit<CustomDatabase['public']['Tables']['test_attempts']['Row'], 'id'>>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name?: string;
          role: 'student' | 'admin';
          created_at: string;
        };
        Insert: Omit<CustomDatabase['public']['Tables']['profiles']['Row'], 'id' | 'created_at'> & { created_at?: string };
        Update: Partial<Omit<CustomDatabase['public']['Tables']['profiles']['Row'], 'id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

// Re-export types that match our custom schema
export type { Json } from '@/integrations/supabase/types';

// Define helper types for strongly-typed database access
export type Tables<T extends keyof CustomDatabase['public']['Tables']> = CustomDatabase['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof CustomDatabase['public']['Tables']> = CustomDatabase['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof CustomDatabase['public']['Tables']> = CustomDatabase['public']['Tables'][T]['Update'];
