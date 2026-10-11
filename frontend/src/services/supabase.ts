/// <reference types="vite/client" />
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
