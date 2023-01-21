<script lang="ts">
	import Ingredient from './Ingredient.svelte';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { fade } from 'svelte/transition';
	import type { ActionData, PageServerData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let form: ActionData;
	export let data: PageServerData;

	let showSaved = false;
	let loading = false;

	async function handleSubmit() {
		loading = true;
		const data = new FormData(this);
		console.log('ACTION', this.action);
		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
		loading = false;
	}

	$: form?.ok && showSavedNotification();

	async function showSavedNotification() {
		showSaved = true;
		await new Promise((resolve) => setTimeout(resolve, 5000));
		showSaved = false;
	}
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

{#if showSaved}
	<div transition:fade class="fixed top-0 w-full py-4 text-3xl text-center bg-green-500">
		Saved!
	</div>
{/if}

<div class="container p-4 mx-auto">
	<div class="py-4 text-center">
		<h2 class="text-3xl">{data.title}</h2>
	</div>

	<form
		method="POST"
		on:submit|preventDefault={handleSubmit}
		class="p-4 bg-white border-4 border-black"
	>
		<h3 class="text-2xl text-center underline">{data.subtitle}</h3>

		<p class="py-4 text-center">
			{data.description}
		</p>

		<div class="max-w-lg mx-auto">
			{#each data.ingredients as ingredient}
				<Ingredient {...ingredient} value={data?.current?.[ingredient.title] || ['']} />
			{/each}

			<div class="flex items-center py-4">
				<label class="pr-2" for="name">
					{data.name_text || 'Name'}
				</label>
				<input
					id="name"
					class="w-full p-2 border-2 border-black"
					type="text"
					name="name"
					value={data.name}
					required
				/>
			</div>
		</div>

		<div class="pt-4">
			<button
				type="submit"
				class:bg-gray-300={loading}
				disabled={loading}
				class="w-full py-2 border-4 border-black bg-primary"
			>
				{data.submit_text || 'Submit'}
			</button>
		</div>
	</form>
</div>
