<script lang="ts">
	import type { Snippet } from 'svelte';
	import Themable from './Themable.svelte';
	interface Props {
		onclick: () => void;
		children: Snippet;
	}
	const { onclick, children }: Props = $props();
</script>

<button {onclick}>
	<Themable
		bg={800}
		class="size-full justify-center flex flex-row items-center content-center rounded-xl p-3"
	>
		{@render children()}
	</Themable>
</button>
