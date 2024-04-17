<script lang="ts">
	import type { Snippet } from "svelte";

  interface Props {
    visible: boolean;
    invert?: boolean;
    duration?: number;
    children: Snippet;
  }
  let { visible: visibleProp = true, invert = false, duration = 500, children }: Props = $props();

  let visible = $derived(invert ? !visibleProp : visibleProp);
</script>

<div class:fade={!visible} class="fadable contents" style="animation-duration: {duration}ms">
  {@render children()}
</div>

<style>
  @keyframes fade {
    0% {
      display: block;
      opacity: 1;
    }
    99% {
      display: block;
      opacity: 0.01;
    }
    100% {
      display: none;
      opacity: 0;
    }
  }
  

  .fadable.fade {
    -webkit-animation: fade forwards;
    -moz-animation: fade forwards;
    -o-animation: fade forwards;
    animation: fade forwards;
  }
</style>