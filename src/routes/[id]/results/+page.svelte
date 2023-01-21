<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="container grid gap-4 p-4 mx-auto">
	{#each data.users as user}
		<div class="p-4 bg-white border-4 border-black">
			<h3 class="text-2xl">
				{user.name}
			</h3>

			<ul>
				{#each Object.entries(user.ingredients) as [ingredient, values]}
					<li class="pl-10">
						{ingredient}
						<ul>
							{#each values as value}
								<li class="pl-10">{value}</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
