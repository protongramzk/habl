import { fail, redirect } from '@sveltejs/kit';
import { requireGuest } from '$lib/server/auth';
import { register } from '$lib/server/auth';

export async function load(event) {
    await requireGuest(event);
    }

    export const actions = {
        default: async (event) => {
                const formData = await event.request.formData();
                        const username = formData.get('username');
                                const email = formData.get('email');
                                        const password = formData.get('password');

                                                const result = await register(event, { username, email, password });

                                                        if (!result.success) {
                                                                    return fail(400, {
                                                                                    errors: result.errors
                                                                                                });
                                                                                                        }

                                                                                                                throw redirect(303, '/');
                                                                                                                    }
                                                                                                                    };
