<script lang="ts">
	import type { Snippet } from "svelte";

  const { children}: { children: Snippet} = $props();
</script>

<div class="size-full absolute top-0 left-0 flex flex-col justify-center items-center">
  {@render children()}
</div>