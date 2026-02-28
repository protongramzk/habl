import { signUp } from '$lib';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');
		const username = data.get('username');

		if (!email || !password || !username) {
			return fail(400, { email, username, missing: true });
		}

		const { data: result, error } = await signUp(
			email.toString(),
			password.toString(),
			username.toString()
		);

		if (error) {
			return fail(400, { email, username, error: error.message });
		}

		throw redirect(303, '/auth/login');
	}
};
