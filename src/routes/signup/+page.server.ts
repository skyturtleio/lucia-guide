import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		console.log(request.body);
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
				/** Lucia Keys
				 * https://lucia-auth.com/basics/keys
				 * A user can have any number of keys, allowing for multiple ways of referencing and
				 * authenticating users without cramming your user table.
				 */
				key: {
					// `providerId` - the identifier for the authentication method, e.g. "email", "github", "username"
					providerId: 'username',
					// `providerUserId` - the unique `id` for a user within the provider from `providerId` above.
					// This gives this user a unique identifier from the specific method above. So,
					// that means, we can reference this *same* user and authenticate them through
					// email, or their Github account, or a username.
					providerUserId: username.toLowerCase(),
					// Password is hashed by Lucia (no need for bcrypt)
					password,
				},
				attributes: {
					username,
				},
			});

			// After successfully creating a user, create a sessions with `Auth.createSession()` and
			// store it as a cookie with `AuthRequest.setSession()`. `AuthRequest` is accessible as
			// `locals.auth` through the `handle` hook in `src/hooks.server.ts`.
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
