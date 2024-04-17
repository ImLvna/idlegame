<script lang="ts">
	import Fade from "$lib/components/Fade.svelte";
	import Themable from "$lib/components/Themable.svelte";
	import { DEBUG_PIN } from "$lib/constants";
	import type Save from "$lib/save.svelte";
	import type Settings from "$lib/settings.svelte";
	import { PinInput } from "bits-ui";
	import { getContext } from "svelte";

  const save = getContext<Save>("save");
  const settings = getContext<Settings>("settings");


  let value: string[] = $state(Array.from({ length: DEBUG_PIN.length }, () => ""));
  let unlocked = $derived(value.join("") === DEBUG_PIN);
</script>

<Fade visible={unlocked} invert>
  <Themable bg={800} class="size-full rounded-xl">
    <PinInput.Root bind:value placeholder={"0"} type={"text"} class="size-full gap-3 flex flex-row items-center justify-center">
      {#each Array.from({ length: DEBUG_PIN.length }, (_, i) => i) as i}
        <Themable bg={900} text={"white"} class="h-28 w-20 flex flex-row items-center justify-center">
        
          <PinInput.Input class="size-full rounded-input text-center bg-inherit placeholder-shown:border-border-input"/>
        </Themable>
      {/each}
    </PinInput.Root>
  </Themable>
</Fade>
{#if unlocked}
  <div class="flex flex-row justify-between w-full">
    <label for="encryptsave">Encrypt Save</label>
    <input type="checkbox" id="encryptsave" bind:checked={save.encrypted} />
  </div>

  <div class="flex flex-row justify-between w-full">
    <label for="autosave">Expose save on window</label>
    <input type="checkbox" id="autosave" bind:checked={settings.exposeSave} />
  </div>
{/if}