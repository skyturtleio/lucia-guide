import { lucia } from 'lucia';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { libsqlClient } from './db';
import { sveltekit } from 'lucia/middleware';
import { dev } from '$app/environment';

// expect error
export const auth = lucia({
	adapter: libsql(libsqlClient, {
		user: 'user',
		key: 'user_key',
		session: 'user_session',
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
});

export type Auth = typeof auth;
