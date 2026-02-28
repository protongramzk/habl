import { signIn } from '$lib';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        // Panggil SDK Hableffect
        const { data, error } = await signIn(email, password);

        if (error) {
            return fail(400, { email, error: error.message });
        }

        // Kalau sukses, lempar ke dashboard atau home
        throw redirect(303, '/');
    }
};
