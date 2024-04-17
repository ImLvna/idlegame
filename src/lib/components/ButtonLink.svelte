<script lang="ts">

	import type { Snippet } from "svelte";
	import Themable from "./Themable.svelte";
  interface Props {
    link: string;
    children: Snippet;
  }
  const { link, children }: Props = $props();

</script>

<a href={link}>
  <Themable bg={800} class="size-full justify-center flex flex-row items-center content-center rounded-xl p-3">
    {@render children()}
  </Themable>
</a>