<script lang="ts">
	export let name = '';
</script>

<svg {...$$props}>
	<use xlink:href={`/sprite.svg#${name}`} />
</svg>
