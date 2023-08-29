import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schema.ts',
	out: './drizzle',
	driver: 'libsql',
	dbCredentials: {
		url: 'http://127.0.0.1:8080',
	},
} satisfies Config;
