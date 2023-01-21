import type { PageServerLoad, Actions } from './$types';
import { supabase } from '$lib/supabaseClient';
import { redirect } from '@sveltejs/kit';
import type { Ingredient, Room } from '$lib/types';

export const load = (async ({ params, locals }) => {
	const roomQuery = await supabase
		.from('menugp-room')
		.select('title, subtitle, description, submit_text, name_text')
		.eq('id', params.id)
		.single();

	if (!!roomQuery.error) {
		throw redirect(307, '/');
	}
	const room = roomQuery.data as Room;

	const ingredientsQuery = await supabase
		.from('menugp-ingredient')
		.select('title, options, type, required')
		.eq('room_id', params.id)
		.order('id', { ascending: true });

	const ingredients = ingredientsQuery.data as Ingredient[];

	const currentQuery = await supabase
		.from('menugp-user')
		.select('name, ingredients')
		.eq('room_id', params.id)
		.eq('user_id', locals.user)
		.limit(1);

	let name = '';
	let currentIngredients: Record<string, string[]> | undefined;

	if (currentQuery.data?.length) {
		name = currentQuery.data[0].name;
		currentIngredients = currentQuery.data[0].ingredients;
	}

	return {
		...room,
		ingredients,
		name,
		current: currentIngredients
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const name = data.get('name');

		let ingredients: Record<string, string[]> = {};
		data.forEach((value, key) => {
			if (key === 'name') return;
			if (!ingredients[key]) {
				ingredients[key] = [];
			}
			ingredients[key].push(value as string);
		});

		const currentQuery = await supabase
			.from('menugp-user')
			.select('ingredients')
			.eq('room_id', event.params.id)
			.eq('user_id', event.locals.user)
			.limit(1);

		let ok = false;

		if (!!currentQuery.data?.length) {
			const save = await supabase
				.from('menugp-user')
				.update({
					name,
					ingredients
				})
				.match({
					user_id: event.locals.user,
					room_id: event.params.id
				});
			ok = !save.error;
		} else {
			const save = await supabase.from('menugp-user').insert({
				user_id: event.locals.user,
				room_id: event.params.id,
				name,
				ingredients
			});
			ok = !save.error;
		}

		return {
			ok
		};
	}
};
