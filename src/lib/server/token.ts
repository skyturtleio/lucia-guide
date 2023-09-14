import { db } from './database';
import * as schema from './schema';
// I could have imported just the `emailVerificationToken` schema,
// but being explicit here helped me figure out the arguments
// for the different functions from Drizzle
import { eq } from 'drizzle-orm';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db
		.select({
			token: schema.emailVerificationToken,
		})
		.from(schema.emailVerificationToken)
		.where(eq(schema.user.id, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((t) => {
			return isWithinExpiration(Number(t.token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.token.id;
	}

	const token = generateRandomString(63);
	await db.insert(schema.emailVerificationToken).values({
		id: token,
		userId: userId,
		expires: BigInt(new Date().getTime() + EXPIRES_IN),
	});

	return token;
};

export const validateEmailVerificationToken = async (token: string) => {
	const storedToken = await db.transaction(async (tx) => {
		const storedToken = await tx.query.emailVerificationToken.findFirst({
			where: eq(schema.emailVerificationToken.id, token),
		});
		if (!storedToken) throw new Error('Invalid token');

		await tx.delete(schema.emailVerificationToken).where(eq(schema.user.id, storedToken.userId));

		return storedToken;
	});

	const tokenExpires = storedToken.expires;
	if (!isWithinExpiration(tokenExpires)) {
		throw new Error('Expired token');
	}

	return storedToken.userId;
};
