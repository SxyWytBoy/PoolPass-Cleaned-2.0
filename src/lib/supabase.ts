import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { createLocalClient } from './local-backend';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * True when no Supabase project is configured. The app then runs on the
 * in-browser backend in ./local-backend.ts, with demo pools and accounts.
 */
export const isLocalBackend =
  !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id');

if (isLocalBackend && import.meta.env.DEV) {
  console.info('PoolPass is running on the in-browser demo backend. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use Supabase.');
}

export const supabase: SupabaseClient<Database> = isLocalBackend
  ? (createLocalClient() as unknown as SupabaseClient<Database>)
  : createClient<Database>(supabaseUrl, supabaseAnonKey);
