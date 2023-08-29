import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

/**
 * This is from `libsql`. It has *nothing* to do with Drizzle or
 * Turso. Turso just happens to be compatible with `libsql`.
 */
export const client = createClient({
	url: process.env.DATABASE_URL || '',
});

export const db = drizzle(client);
