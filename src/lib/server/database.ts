import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

/**
 * This is from `libsql`. It has *nothing* to do with Drizzle or
 * Turso. Turso just happens to be compatible with `libsql`.
 */
export const client = createClient({
	url: process.env.DATABASE_URL || '',
});

/**
 * At first I didn't have `{ schema }` passed as the second argument.
 * Without it, I wasn't getting completions for `db.query....`
 *
 * From the docs:
 * https://orm.drizzle.team/docs/rqb#querying
 * > Relational queries are an extension to Drizzle's original query builder.
 * > You need to provide all tables and relations from your schema file/files
 * > upon drizzle() initialization and then just use the db.query API.
 */

export const db = drizzle(client, { schema });
