import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export const libsqlClient = createClient({
	url: 'file:test/main.db',
});

export const db = drizzle(libsqlClient);
