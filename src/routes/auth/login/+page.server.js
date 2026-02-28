import { signIn } from '$lib';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { email, missing: true });
		}

		const { data: result, error } = await signIn(email.toString(), password.toString());

		if (error) {
			return fail(401, { email, error: error.message });
		}

		throw redirect(303, '/');
	}
};
