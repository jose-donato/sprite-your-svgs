<script lang="ts">
	import { createTabs, melt } from '@melt-ui/svelte';

	const {
		elements: { root, list, content, trigger }
	} = createTabs();
</script>

<div class="shadow rounded bg-white bg-opacity-100 p-4 max-w-[700px] mx-auto">
	<h2 class="font-bold text-lg mb-4">How to use it?</h2>
	<ol class="list-decimal list-inside mb-4 pl-2">
		<li>Paste your svg to be optimized and converted to a symbol</li>
		<li>
			Copy the generated code above and paste it in a file called <code
				class="bg-gray-50 rounded p-1 border border-gray-200">sprite.svg</code
			> in the assets folder of your project.
		</li>
		<li>
			Use the svg on your project like this:
			<pre>
				<code
					class="xml bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`<svg class="w-6 h-6">
	<use href="/sprite.svg#icon-name" />
</svg>`}
		</code>
		</pre>
		</li>
		<li>
			<strong> Bonus: </strong>
			If you are using a framework you can create a component:
			<div use:melt={$root}>
				<div use:melt={$list} class="flex justify-center mt-4 gap-2">
					<button
						use:melt={$trigger('react')}
						class="data-[state='active']:text-purple-500 data-[state='active']:underline"
						>React</button
					>
					<button
						use:melt={$trigger('svelte')}
						class="data-[state='active']:text-purple-500 data-[state='active']:underline"
						>Svelte</button
					>
				</div>
				<div use:melt={$content('react')}>
					<pre>
					<code
							class="javascript bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`import React from 'react';

const Icon = ({ name, ...props }) => (
	<svg {...props}>
	<use href={\`/sprite.svg#\${name}\`} />
	</svg>
);

export default Icon;`}
						</code>
					</pre>
					And then use it like this:
					<pre>
			<code
							class="javascript bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`<Icon name="icon-name" className="w-6 h-6" />`}
			</code>
		</pre>
				</div>
				<div use:melt={$content('svelte')}>
					<pre>
						<code
							class="javascript bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{'<script>'}
{'\t'}export let name = '';
{'</script>'}

{'<svg {...$$props}>'}
{'\t'}{'<use xlink:href={`/sprite.svg#${name}`} />'}
{'</svg>'}
							</code>
						</pre>
					And then use it like this:
					<pre>
				<code
							class="javascript bg-gray-50 rounded p-2 border border-gray-200 block whitespace-pre overflow-x-scroll">
{`<Icon name="icon-name" className="w-6 h-6" />`}
				</code>
			</pre>
				</div>
			</div>
		</li>
	</ol>
</div>
