import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
	schema: './src/lib/server/schema.ts',
	out: './migrations',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.DATABASE_URL || '',
	},
	breakpoints: true,
} satisfies Config;
