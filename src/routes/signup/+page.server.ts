import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (typeof username !== 'string' || username.length < 4 || username.length > 31) {
			return fail(400, {
				message: 'Invalid username',
			});
		}

		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password',
			});
		}

		try {
			const user = await auth.createUser({
				key: {
					// Auth method
					providerId: 'username',
					// Unique id when using `username` auth method
					providerUserId: username.toLowerCase(),
					// Password is hashed by Lucia (no need for bcrypt)
					password,
				},
				attributes: {
					username,
				},
			});

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {},
			});

			// Set session cookie using SvelteKit `locals`
			locals.auth.setSession(session);
		} catch (e) {
			const USER_TABLE_UNIQUE_CONSTRAINT_ERROR =
				'LibsqlError: SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: user.username';

			if (e === USER_TABLE_UNIQUE_CONSTRAINT_ERROR) {
				return fail(400, {
					message: 'Username already taken',
				});
			}

			if (e) {
				console.log(e);
			}

			return fail(500, {
				message: 'An unknown error occurred',
			});
		}
		throw redirect(302, '/');
	},
};
