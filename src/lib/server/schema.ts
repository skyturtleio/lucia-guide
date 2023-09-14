import { sqliteTable, text, blob, integer } from 'drizzle-orm/sqlite-core';

/** Database Model for Lucia
 * https://lucia-auth.com/basics/database
 * Lucia requires three tables to work:
 * 	- User table
 * 	- Session table
 * 	- Key table
 */
export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username', { length: 32 }).notNull().unique(),
	email: text('email', { length: 32 }).notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),
});

export const session = sqliteTable('user_session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	activeExpires: blob('active_expires', {
		mode: 'bigint',
	}).notNull(),
	idleExpires: blob('idle_expires', {
		mode: 'bigint',
	}).notNull(),
});

export const key = sqliteTable('user_key', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	hashedPassword: text('hashed_password'),
});
