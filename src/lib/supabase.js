import { createClient } from '@supabase/supabase-js';

// Use a safe way to access environment variables in both browser and server
// SvelteKit uses import.meta.env for public variables
const SUPABASE_URL = (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_URL : null) || import.meta.env?.VITE_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' ? process.env.PUBLIC_SUPABASE_ANON_KEY : null) || import.meta.env?.VITE_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

/**
 * Create browser Supabase client
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createBrowserClient() {
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
