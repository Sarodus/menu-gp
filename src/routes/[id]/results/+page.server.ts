import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { Room, User } from '$lib/types';

export const load = (async ({ params }) => {
	const roomQuery = await supabase
		.from('menugp-room')
		.select('title, subtitle, description, submit_text, name_text')
		.eq('id', params.id)
		.single();

	if (!!roomQuery.error) {
		throw redirect(307, '/');
	}
	const room = roomQuery.data as Room;

	const userQuery = await supabase
		.from('menugp-user')
		.select('name, ingredients')
		.eq('room_id', params.id);

	const users: User[] = userQuery.data as User[];

	return {
		...room,
		users
	};
}) satisfies PageServerLoad;
