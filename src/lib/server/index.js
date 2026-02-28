import { createClient } from '@supabase/supabase-js';

// Use a safe way to get env vars that works in both browser and server
const getEnv = (name, fallback) => {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
        return process.env[name];
    }
    return fallback;
};

const SUPABASE_URL = getEnv('PUBLIC_SUPABASE_URL', 'http://localhost:54321');
const SUPABASE_ANON_KEY = getEnv('PUBLIC_SUPABASE_ANON_KEY', 'dummy');
const SUPABASE_SERVICE_ROLE = getEnv('SUPABASE_SERVICE_ROLE_KEY', 'dummy');

/**
 * Create server Supabase client with service role
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createServerClient(event) {
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: {
			persistSession: false
		},
		global: {
			headers: {
				authorization: event.request.headers.get('authorization') || '',
				...(event.locals?.session && {
					'x-user-id': event.locals.session.user.id
				})
			}
		}
	});
}

/**
 * Create service role client (server-only, for admin operations)
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
export function createServiceClient() {
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);
}

/**
 * Get current session from request event
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<{data: {session: any}, error: any}>}
 */
export async function getSession(event) {
	try {
		const supabase = createServerClient(event);
		const { data, error } = await supabase.auth.getSession();
		return { data: data?.session, error };
	} catch (err) {
		return { data: null, error: err };
	}
}

/**
 * Require authentication, return user or throw
 * @param {import('@sveltejs/kit').RequestEvent} event
 * @returns {Promise<{data: any, error: any}>}
 */
export async function requireAuth(event) {
	const { data, error } = await getSession(event);
	if (error || !data) {
		return { data: null, error: error || new Error('Unauthorized') };
	}
	return { data, error: null };
}
