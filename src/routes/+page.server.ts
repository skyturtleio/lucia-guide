import { auth } from '$lib/server/lucia';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

import { getEmailByUserId } from '$lib/server/repo';

/**
 * Get authenticated user
 */
export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');
	if (!session.user.emailVerified) {
		throw redirect(302, '/email-verification');
	}

	const repoEmail = await getEmailByUserId(session.user.userId);
	return {
		userId: session.user.userId,
		username: session.user.username,
		email: session.user.email,
		repoEmail,
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
		throw redirect(302, '/login');
	},
};
