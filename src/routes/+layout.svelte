<script lang="ts">
  import Save from '$lib/save.svelte';
  import { onMount, setContext } from 'svelte';
  import "./app.css";
  const { children } = $props();

  const save = new Save();

  onMount(() => {
    save.registerSaveEffect();

    save.money = 1000;
  });
  setContext('save', save);
</script>


<div class="flex flex-col size-full">
  <div class="header flex flex-row w-full h-10">
    <a href="/">Home</a>
    <a href="/science">Science</a>
  </div>
  <div class="flex flex-row size-full">
    <div class="sidebar flex flex-col h-full w-10">
      Sidebar
    </div>
    <div class="content h-full w-full">
      {@render children()}
    </div>
  </div>
</div>


<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.700);
  }
</style>