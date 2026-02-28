import { createBrowserClient } from '../supabase.js';

const supabase = createBrowserClient();

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signUp(email, password, username) {
	try {
		// Validate input
		if (!email?.trim() || !password || !username?.trim()) {
			return { data: null, error: new Error('Missing required fields') };
		}

		// Sign up auth user
		const { data: authData, error: authError } = await supabase.auth.signUp({
			email: email.trim(),
			password,
			options: {
				data: { username: username.trim() }
			}
		});

		if (authError || !authData.user) {
			return { data: null, error: authError };
		}

		// Create profile
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.insert({
				id: authData.user.id,
				username: username.trim(),
				display_name: username.trim()
			})
			.select()
			.single();

		if (profileError) {
			// Clean up auth user if profile creation fails
			// await supabase.auth.admin.deleteUser(authData.user.id); // This requires service role
			return { data: null, error: profileError };
		}

		return { data: { user: authData.user, profile: profileData }, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signIn(email, password) {
	try {
		if (!email?.trim() || !password) {
			return { data: null, error: new Error('Missing email or password') };
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email: email.trim(),
			password
		});

		return { data, error };
	} catch (err) {
		return { data: null, error: err };
	}
}

/**
 * Sign out current user
 * @returns {Promise<{data: null, error: any}>}
 */
export async function signOut() {
	try {
		const { error } = await supabase.auth.signOut();
		return { data: null, error };
	} catch (err) {
		return { data: null, error: err };
	}
}

/**
 * Get current authenticated user
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getCurrentUser() {
	try {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) {
			return { data: null, error: error || new Error('Not authenticated') };
		}

		// Fetch profile data
		const { data: profile, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', data.user.id)
			.single();

		if (profileError) {
			return { data: null, error: profileError };
		}

		return { data: { user: data.user, profile }, error: null };
	} catch (err) {
		return { data: null, error: err };
	}
}
