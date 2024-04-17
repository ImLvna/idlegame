<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Themable from '$lib/components/Themable.svelte';
	import type Save from '$lib/save.svelte';
	import Settings from '$lib/settings.svelte';
	import tw from '$lib/theme.svelte';
	import { Accordion, DropdownMenu } from 'bits-ui';
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';

	const settings = getContext<Settings>('settings');
	const save = getContext<Save>('save');

	const themes = Object.keys(tw.theme.colors)
		.filter((i) => !['inherit', 'current', 'transparent', 'black', 'white'].includes(i))
		.map((theme) => ({
			value: theme,
			// Label is the theme name with the first letter capitalized
			label: theme.charAt(0).toUpperCase() + theme.slice(1)
		}));
</script>

<div class="flex flex-col gap-3">
	<h1>Settings</h1>
	{#snippet accItem(value, label, content)}
		<Accordion.Item {value}>
			<Themable bg={800} class="w-full flex flex-col items-center content-center p-3 rounded-xl">
				<Accordion.Header class="w-full">
					<Accordion.Trigger class="w-full flex flex-row items-center content-center">
						{label}
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content
					transition={slide}
					transitionConfig={{ duration: 200 }}
					class="w-full flex flex-col items-center content-center p-2 rounded-xl"
				>
					{@render content()}
				</Accordion.Content>
			</Themable>
		</Accordion.Item>
	{/snippet}
	{#snippet themeSettings()}
		<div class="w-full rounded-xl">
			{#each themes as theme}
				<Themable
					bg={[theme.value, 800]}
					text={'white'}
					class="w-full h-16 flex flex-row align-middle items-center p-3"
				>
					<button
						class="w-full h-full flex flex-row align-middle items-center"
						on:click={() => (settings.colorscheme = theme.value as keyof typeof tw.theme.colors)}
					>
						<span>{theme.label}</span>
					</button>
				</Themable>
			{/each}
		</div>
	{/snippet}
	{#snippet saveSettings()}
		<Themable text={['red', 500]}>
			<Button onclick={() => save.reset()}>Reset Save</Button>
		</Themable>
	{/snippet}
	<Accordion.Root class="flex flex-col gap-3">
		{@render accItem('theme', 'Theme', themeSettings)}
		{@render accItem('save', 'Save', saveSettings)}
	</Accordion.Root>

	<Themable text={['red', 500]}>
		<Button onclick={() => settings.reset()}>Reset Settings</Button>
	</Themable>
</div>
