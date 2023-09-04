<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import hljs from 'highlight.js';
	import vkbeautify from 'vkbeautify';
	import HowTo from '$lib/components/HowTo.svelte';
	import 'highlight.js/styles/a11y-light.css';
	import Icon from '$lib/components/Icon.svelte';
	import { addToast } from '$lib/components/Toaster.svelte';
	let entered = false;
	let showOverlay = false;
	let isDragging = false;
	let dragCounter = 0;
	let fileName = '';
	let isSvg = true;
	let svgInput: HTMLTextAreaElement;

	export let form;

	let resultPre: HTMLPreElement | null = null;

	$: fileSlug = fileName.replace('.svg', '');

	$: {
		if (typeof window !== 'undefined') {
			if (form) {
				if (!entered) {
					if (form.status === 'success') {
						addToast({
							data: {
								title: 'Sprite generated',
								description: 'Sprite copied to clipboard.',
								color: 'bg-green-500'
							}
						});
						navigator.clipboard.writeText(form.result);
						setTimeout(() => {
							if (resultPre) {
								hljs.highlightElement(resultPre);
							}
						}, 200);
					} else {
						addToast({
							data: {
								title: 'Error',
								description: form.message || 'Something went wrong. Please try again.',
								color: 'bg-red-500'
							}
						});
					}
				}
				entered = true;
			}
		}
	}

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

	function formatSVG(svgString: string) {
		return vkbeautify.xml(svgString.trim());
	}

	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		dragCounter++;
		showOverlay = true;
		isDragging = true;
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		dragCounter--;
		if (dragCounter === 0) {
			isDragging = false;
		}
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		dragCounter = 0; // Reset the counter
		isDragging = false;

		const files = event.dataTransfer.files;
		if (files.length > 0) {
			fileName = files[0].name;
			isSvg = fileName.endsWith('.svg');
			if (!isSvg) {
				alert('Only SVG files are supported');
			} else {
				const reader = new FileReader();
				reader.onload = (event) => {
					const text = event.target.result;
					const svgType = detectSvg(text);
					if (svgType === 'single_svg') {
						svgInput.value = text;
					} else if (svgType === 'group_of_svgs') {
						alert('group of svgs');
					} else {
						alert('not svg');
					}
				};
				reader.readAsText(files[0]);
			}
		}
		showOverlay = false;
	}

	onMount(() => {
		document.querySelectorAll('pre code').forEach((block) => {
			hljs.highlightElement(block);
		});
		document.addEventListener('paste', (event) => {
			if (
				!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)
			) {
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
			}
		});
	});
</script>

<div
	on:dragover={onDragOver}
	on:dragenter={onDragEnter}
	on:dragleave={onDragLeave}
	on:drop={onDrop}
	role="document"
	aria-roledescription="Drag and drop an SVG file here to convert it to a sprite."
>
	<a
		href="https://github.com/jose-donato/sprite-your-svgs"
		target="_blank"
		rel="noopener noreferrer"
		class="fixed top-8 right-8 bg-zinc-700 border border-zinc-400 px-2 py-1 text-white rounded-lg flex items-center gap-2 hover:bg-zinc-600 transition-colors duration-200 ease-in-out active:scale-95"
	>
		<Icon class="w-4 h-4 text-white" name="star-icon" />
		Star on GitHub
	</a>
	<div class="mx-auto my-10 space-y-10 container">
		<div class="text-center">
			<h1 class="text-3xl font-bold mt-2 mb-4">
				<span class="underline-animation"> Sprite </span>
				your SVGs
			</h1>
			<div class="flex justify-center items-center flex-col gap-2">
				<p>Paste your SVG code below to generate an optimized sprite. Why?</p>
				<ul class="flex flex-col justify-start items-start">
					<li>
						<Icon name="checkmark-icon" class="w-3 h-3 inline-block mr-1 text-purple-400" />
						<span>Improved Performance: Fewer HTTP requests</span>
					</li>
					<li>
						<Icon name="checkmark-icon" class="w-3 h-3 inline-block mr-1 text-purple-400" />
						<span> Styling Flexibility: CSS-stylable icons</span>
					</li>
					<li>
						<Icon name="checkmark-icon" class="w-3 h-3 inline-block mr-1 text-purple-400" />
						<span> Smaller JS Bundle: Externalizes icon data</span>
					</li>
				</ul>
				<p class="text-xs">
					Still not convinced? Read more about it on
					<a
						href="https://benadam.me/thoughts/react-svg-sprites/"
						class="text-purple-500 hover:underline"
						target="_blank"
						rel="noopener noreferrer">Ben Adam blog post</a
					>,
					<a
						href="https://www.jacobparis.com/content/svg-icons"
						class="text-purple-500 hover:underline"
						target="_blank"
						rel="noopener noreferrer">Jacob Paris blog post</a
					>
					or
					<a
						href="https://github.com/epicweb-dev/epic-stack/blob/2c2a65d7e8d27c0e4e9bb00534d136a43a9d804d/docs/decisions/020-icons.md"
						class="text-purple-500 hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						Kent C. Dodds' Epic Stack documentation
					</a>
				</p>
			</div>
		</div>
		<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto">
			<form
				method="POST"
				use:enhance
				class="flex flex-col items-start mx-auto"
				on:submit={() => {
					entered = false;
				}}
			>
				<label class="block mb-2 text-sm font-medium text-gray-900 w-full">
					SVG (paste or drag and drop here)
					<textarea
						bind:this={svgInput}
						required
						name="svg"
						class={`${
							form?.message === 'Invalid SVG provided' ? 'border-red-400' : 'border-gray-300'
						} block w-full h-20 p-4 text-gray-900 border rounded-lg bg-gray-50 sm:text-md focus:ring-purple-500 focus:border-purple-500'}`}
					/>
				</label>
				<label class="block mb-2 text-sm font-medium text-gray-900 w-full">
					Icon slug (optional)
					<input
						bind:value={fileSlug}
						type="text"
						name="slug"
						class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-purple-500 focus:border-purple-500"
					/>
				</label>
				<label class="mb-2 text-sm font-medium text-gray-900 flex gap-2 whitespace-nowrap">
					Include svg tag
					<input
						type="checkbox"
						name="includeSvgTag"
						class="block w-full p-4 text-gray-900 accent-purple-500 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-purple-500 focus:border-purple-500"
					/>
				</label>
				<label class="mb-2 text-sm font-medium text-gray-900 flex gap-2 whitespace-nowrap">
					Replace colors with currentColor
					<input
						type="checkbox"
						name="replaceColors"
						class="block w-full p-4 text-gray-900 accent-purple-500 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-purple-500 focus:border-purple-500"
					/>
				</label>
				<div class="self-end">
					<button
						class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none"
						>Convert</button
					>
				</div>
			</form>
		</div>

		{#if form && form.status === 'success'}
			<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto space-y-4">
				<h2 class="font-bold text-lg mb-4">Result</h2>
				<pre>
						<code class="xml border border-gray-300 rounded-lg bg-gray-50 !text-xs !p-1" bind:this={resultPre}>
{#if form.result}
							{formatSVG(form.result)}
						{/if}
					</code>
				</pre>
				<div class="flex justify-end">
					<button
						on:click={() => {
							navigator.clipboard.writeText(form.result);
						}}
						class="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none"
					>
						Copy
					</button>
				</div>
			</div>
		{/if}
		<HowTo />
		{#if isDragging}
			<div class="overlay">
				<p>Drop your SVG file here...</p>
			</div>
		{:else if fileName && isSvg && showOverlay}
			<div class="overlay">
				<p>SVG file dropped: {fileName}</p>
			</div>
		{/if}
	</div>
	<p class="text-center text-sm mb-10">
		Built by <a
			class="text-purple-500 hover:underline"
			href="https://twitter.com/josedonato__"
			target="_blank"
			rel="noopener noreferrer"
		>
			José Donato
		</a> using Sveltekit, TailwindCSS and melt-ui.
	</p>
</div>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(240, 240, 240, 0.8);
		border: 3px dashed #666;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
</style>
