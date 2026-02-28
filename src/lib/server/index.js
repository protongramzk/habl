import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

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
				...(event.locals.session && {
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
