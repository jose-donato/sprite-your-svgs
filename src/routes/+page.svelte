<script>
	import { enhance } from '$app/forms';

	export let form;
</script>

<form method="POST" use:enhance>
	<label>
		SVG
		<input type="text" name="svg" />
	</label>
	<button>Convert</button>
</form>

{#if form}
	{#if form.status === 'success'}
		<code
			class="max-w-sm bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll"
		>
			{form.result}
		</code>
	{:else if form.status === 'error'}
		<p class="text-red-500">Unknown error</p>
	{/if}
{/if}
