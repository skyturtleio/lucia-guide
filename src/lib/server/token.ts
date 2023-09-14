import { db } from './database';
import { eq } from 'drizzle-orm';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import * as schema from './schema';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userIdOther: string) => {
	const storedUserTokens = await db
		.select({
			token: schema.emailVerificationToken,
		})
		.from(schema.emailVerificationToken)
		.where(eq(schema.user.id, userIdOther));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((t) => {
			return isWithinExpiration(Number(t.token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.token.id;
	}

	const token = generateRandomString(63);
	await db.insert(schema.emailVerificationToken).values({
		id: token,
		userId: userIdOther,
		expires: BigInt(new Date().getTime() + EXPIRES_IN),
	});

	return token;
};
