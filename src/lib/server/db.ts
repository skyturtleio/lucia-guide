import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

/**
 * This has *nothing* to do with Drizzle.
 *
 */
export const client = createClient({
	url: import.meta.env.DATABASE_URL,
});

export const db = drizzle(client);
