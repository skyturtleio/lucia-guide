import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/server/schema.ts',
	out: './migrations',
	driver: 'turso',
	breakpoints: true,
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
} satisfies Config;
