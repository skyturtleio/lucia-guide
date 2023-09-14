import { db } from './database';
import { eq } from 'drizzle-orm';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { emailVerificationToken, user } from './schema';

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generateEmailVerificationToken = async (userId: string) => {
	const storedUserTokens = await db
		.select({
			token: emailVerificationToken,
		})
		.from(emailVerificationToken)
		.where(eq(user.id, userId));

	if (storedUserTokens.length > 0) {
		const reusableStoredToken = storedUserTokens.find((t) => {
			return isWithinExpiration(Number(t.token.expires) - EXPIRES_IN / 2);
		});
		if (reusableStoredToken) return reusableStoredToken.token.id;
	}

	const token = generateRandomString(63);
};
