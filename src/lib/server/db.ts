import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export const libsqlClient = createClient({
	url: 'http://127.0.0.1:8080',
});

export const db = drizzle(libsqlClient);
