<script lang="ts">
	import Themable from "$lib/components/Themable.svelte";
	import type Save from "$lib/save.svelte";
	import Settings from "$lib/settings.svelte";
	import { Accordion } from "bits-ui";
	import { getContext } from "svelte";
	import { slide } from "svelte/transition";

  const settings = getContext<Settings>("settings");
  const save = getContext<Save>("save");
</script>

<div class="flex flex-col gap-3">
<h1>Settings</h1>
<Accordion.Root>
  
  <Accordion.Item value="developer">
    <Themable bg={800} class="w-full flex flex-col items-center content-center p-3 rounded-xl">
    <Accordion.Header class="w-full">
      <Accordion.Trigger class="w-full flex flex-row items-center content-center">
        Developer
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Content
        transition={slide}
        transitionConfig={{ duration: 200 }}
        class="w-full flex flex-col items-center content-center p-2 rounded-xl"
    >
    

    

  </Accordion.Content>
</Themable>
  </Accordion.Item>
</Accordion.Root>
</div>