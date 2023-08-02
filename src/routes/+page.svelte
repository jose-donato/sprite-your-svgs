<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	export let form;

	function detectSvg(text: string): 'single_svg' | 'group_of_svgs' | 'not_svg' {
		const svgOpenTagPattern = /<svg\s/g;
		const svgCloseTagPattern = /<\/svg>/g;

		const openTags = text.match(svgOpenTagPattern);
		const closeTags = text.match(svgCloseTagPattern);

		if (openTags && openTags.length === 1 && closeTags && closeTags.length === 1) {
			return 'single_svg';
		} else if (openTags && openTags.length > 1 && openTags.length === closeTags?.length) {
			return 'group_of_svgs';
		} else {
			return 'not_svg';
		}
	}

	let svgInput: HTMLTextAreaElement;

	onMount(() => {
		document.addEventListener('paste', (event) => {
			const text = event.clipboardData.getData('text/plain');
			if (text) {
				const svgType = detectSvg(text);
				if (svgType === 'single_svg') {
					svgInput.value = text;
				} else if (svgType === 'group_of_svgs') {
					alert('group of svgs');
				} else {
					alert('not svg');
				}
			}
		});
	});
</script>

<div class="mx-auto mt-10 space-y-10 container">
	<div class="text-center">
		<h1 class="text-3xl font-bold mt-2 mb-4">
			<span class="underline-animation"> Spritify </span>
			your SVG
		</h1>
		<p>Paste your SVG code below to generate an optimized sprite.</p>
		<p class="text-xs">
			Why? This <a
				href="https://benadam.me/thoughts/react-svg-sprites/"
				class="text-blue-500 hover:underline">article</a
			> explains it well but TLDR: it's faster (if you are using jsx, the bundle size will not need to
			include the svg code for each icon) and imo it's easier to manage.
		</p>
	</div>
	<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto">
		<form method="POST" use:enhance class="flex flex-col items-start mx-auto">
			<label class="block mb-2 text-sm font-medium text-gray-900 w-full">
				SVG (paste or drag and drop here)
				<textarea
					bind:this={svgInput}
					required
					name="svg"
					class="block w-full h-20 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
				/>
			</label>
			<label class="block mb-2 text-sm font-medium text-gray-900 w-full">
				Icon slug (optional)
				<input
					type="text"
					name="name"
					class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
				/>
			</label>
			<label class="mb-2 text-sm font-medium text-gray-900 flex gap-2 whitespace-nowrap">
				Include svg tag
				<input
					type="checkbox"
					name="includeSvgTag"
					class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
				/>
			</label>
			<div class="self-end">
				<button
					class="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
				>
					Add more
				</button>
				<button
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
					>Convert</button
				>
			</div>
		</form>
	</div>

	{#if form}
		<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto space-y-4">
			{#if form.status === 'success'}
				<p>Result</p>
				<code
					class="block overflow-auto w-full h-20 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500"
				>
					{form.result}
				</code>
				<button
					on:click={() => {
						navigator.clipboard.writeText(form.result);
					}}
					class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
				>
					Copy
				</button>
			{:else if form.status === 'error'}
				<p class="text-red-500">Unknown error</p>
			{/if}
		</div>
	{/if}

	<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto">
		<p>How to use it?</p>
		<p>
			1. Copy the code above and paste it in a file called <code>sprite.svg</code> in your project.
		</p>
		<p>2. Import the file in your project and use it like this:</p>
		<pre
			class="bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`<svg class="w-6 h-6">
    <use href="/sprite.svg#icon-name" />
</svg>`}
        </pre>
		<p>Bonus:</p>
		<p>If you are using a framework like react or svelte you can create a component:</p>
		<pre
			class="bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`import React from 'react';

const Icon = ({ name, ...props }) => (
    <svg {...props}>
        <use href={\`/sprite.svg#\${name}\`} />
    </svg>
);

export default Icon;`}
        </pre>
		<p>And use it like this:</p>
		<pre
			class="bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
            {`<Icon name="icon-name" className="w-6 h-6" />`}
        </pre>
	</div>
</div>
