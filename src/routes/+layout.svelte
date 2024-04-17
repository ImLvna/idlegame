<script lang="ts">
	import { setSettings, toastError } from '$lib/client/toast';
	import Themable from '$lib/components/Themable.svelte';
	import Save from '$lib/save.svelte';
	import Settings from '$lib/settings.svelte';
	import { config as faConfig } from '@fortawesome/fontawesome-svg-core';
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { onMount, setContext } from 'svelte';
	import './app.css';

	import ButtonLink from '$lib/components/ButtonLink.svelte';
	import Fade from '$lib/components/Fade.svelte';
	import Fullscreen from '$lib/components/Fullscreen.svelte';
	import Science from '$lib/components/icons/Science.svelte';
	import '@fortawesome/fontawesome-svg-core/styles.css';
	// Import the CSS
	faConfig.autoAddCss = false;
	const { children } = $props();

	const save = new Save();
	const settings = new Settings();

	setSettings(settings);

	onMount(() => {
		try {
			settings.load();
		} catch (e) {
			console.error(e);
			if (e instanceof Error && e.message !== 'No settings found') {
				toastError('Failed to load settings');
			} else {
				settings.save();
			}
		}
		settings.registerSaveEffect();

		try {
			save.load();
		} catch (e2) {
			console.error(e2);
			if (e2 instanceof Error && e2.message !== 'No save found') {
				toastError('Failed to load save');
			} else {
				save.save();
			}
		}
		save.registerSaveEffect();

		$effect(() => {
			if (settings.exposeSave) {
				window.game = {
					settings,
					save
				};
			} else {
				delete window.game;
			}
		});
	});
	setContext('save', save);
	setContext('settings', settings);
</script>

<SvelteToast />
<Themable bg={700} text={'white'} class="flex flex-col size-full">
	<Fade visible={save.loaded} invert duration={200}>
		<Fullscreen>
			<Themable bg={800} class="flex flex-col size-full justify-center items-center content-center">
				<h1>Loading...</h1>
			</Themable>
		</Fullscreen>
	</Fade>

	<div class="header flex flex-row w-full h-16 justify-between p-2 pr-10">
		<div class="h-full w-1/2 flex flex-row justify-start gap-4">
			<h1 class="justify-start items-center content-center self-center text-2xl font-bold">
				Unnamed Idle Game
			</h1>
		</div>

		<div class="h-full w-1/2 flex flex-row justify-end gap-4">
			<ButtonLink link="/science">
				<Science />
				<span>{save.science}</span>
			</ButtonLink>
			<ButtonLink link="/">
				${save.money}
			</ButtonLink>
		</div>
	</div>
	<div class="flex flex-row size-full">
		<div class="sidebar flex flex-col h-full w-48 p-3 gap-3">
			<ButtonLink link="/">Home</ButtonLink>
			<ButtonLink link="/settings">Settings</ButtonLink>
		</div>
		<Themable bg={600} class="content h-full w-full rounded-tl-xl p-10 pb-28 overflow-y-scroll">
			{@render children()}
		</Themable>
	</div>
</Themable>

<style lang="postcss">
	:global(html, body) {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	:global(.toast) {
		--toastBackground: theme(colors.gray.800);
	}
	:global(.toast-info) {
		--toastBarBackground: theme(colors.blue.500);
	}
	:global(.toast-success) {
		--toastBarBackground: theme(colors.green.500);
	}
	:global(.toast-error) {
		--toastBarBackground: theme(colors.red.500);
	}
	:global(.toast-warning) {
		--toastBarBackground: theme(colors.yellow.500);
	}
</style>
