import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	// TODO: redirect to login
	if (!session) throw redirect(302, '/signup');
	return {
		userId: session.user.userId,
		username: session.user.username,
	};
};
