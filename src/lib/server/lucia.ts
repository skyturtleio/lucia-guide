import { lucia } from 'lucia';
import { client } from './database';
import { dev } from '$app/environment';
import { sveltekit } from 'lucia/middleware';
import { libsql } from '@lucia-auth/adapter-sqlite';

/**
 * See Lucia docs for guidance on this.
 * https://lucia-auth.com/getting-started/sveltekit
 */
export const auth = lucia({
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	adapter: libsql(client, {
		// Table names can be whatever you want for Lucia, but you
		// you need to make sure to specify it matches up here.
		// Lucia assumes `user`, `user_key`, `user_session` tables.
		// https://lucia-auth.com/basics/database
		user: 'user',
		key: 'user_key',
		session: 'user_session',
	}),
	// Expose the user’s `username` to the User object by defining `getUserAttributes`
	getUserAttributes: (data) => {
		return {
			username: data.username,
		};
	},
});

export type Auth = typeof auth;
