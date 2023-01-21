import type { Handle } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { v4 as uuidv4 } from 'uuid';

export const handle = (async ({ event, resolve }) => {
	let user = event.cookies.get('user');

	if (!user) {
		user = uuidv4();
		event.cookies.set('user', user, { secure: !dev, httpOnly: !dev });
	}

	event.locals.user = user;

	const response = await resolve(event);
	return response;
}) satisfies Handle;
