import { createClient } from '@supabase/supabase-js';

// Use dummy values if env vars are missing to allow build to pass
const SUPABASE_URL = (typeof process !== 'undefined' && process.env.PUBLIC_SUPABASE_URL) || 'http://localhost:54321';
const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env.PUBLIC_SUPABASE_ANON_KEY) || 'dummy';

/**
 * Create browser Supabase client
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createBrowserClient() {
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
