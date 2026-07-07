import { createClient } from '@supabase/supabase-js';
import { cleanSupabaseAnonKey, cleanSupabaseUrl } from './env.js';

const supabaseUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = cleanSupabaseAnonKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_url' &&
  !supabaseUrl.includes('your-project-ref') &&
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  !supabaseAnonKey.includes('your-supabase-anon-key');

/** Auth-only client – no direct database queries from the browser */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getAccessToken() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export function getFunctionsUrl() {
  return `${supabaseUrl}/functions/v1/wellness-api`;
}

export { supabaseUrl, supabaseAnonKey };
