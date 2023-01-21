<script lang="ts">
	export let title: string;
	export let options: string[];
	export let type: 'checkbox' | 'radio' = 'radio';
	export let required = false;

	export let value: string[] = [''];
</script>

<div class="my-4">
	<div class="text-xl underline decoration-primary text-center">{title}</div>
	<div>
		{#each options as option}
			<label class="flex justify-between">
				<div class="pr-4">
					{option}
				</div>
				<div class="border-b border-dashed border-black flex-grow" />
				<div class="pl-4">
					{#if type === 'checkbox'}
						<input type="checkbox" name={title} value={option} {required} bind:group={value} />
					{:else if type === 'radio'}
						<input type="radio" name={title} value={option} {required} bind:group={value[0]} />
					{/if}
				</div>
			</label>
		{/each}
	</div>
</div>
