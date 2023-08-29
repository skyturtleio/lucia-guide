import type { Config } from 'drizzle-kit';

export default {
	schema: './src/lib/server/schema.ts',
	out: './migrations',
	breakpoints: true,
} satisfies Config;