import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

const startupCode = () => {
	console.log('I only run once, Im outside the handle function');
	// place code that you want to run on startup here
	// e.g., migrations, db connections
};

startupCode();

export const handle: Handle = async ({ event, resolve }) => {
	console.log('server hook: I run every time');
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
};
