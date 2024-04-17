<script lang="ts">
	import Settings from '$lib/settings.svelte';
	import { getContext, type Snippet } from 'svelte';

	type color = number | [string, number] | string;
	interface Props {
		bg?: color;
		text?: color;
		class?: string;
		children: Snippet;
	}
	const { bg, text, children, class: baseClass }: Props = $props();

	const settings = getContext<Settings>('settings');

	const className = $derived.by(() => {
		settings.colorscheme;

		let classNameWorking = baseClass ? baseClass : '';

		const addToClass = (text: string) => {
			if (!classNameWorking.endsWith(' ') && classNameWorking.length > 0) {
				classNameWorking += ' ';
			}
			classNameWorking += text;
		};

		if (bg) {
			switch (typeof bg) {
				case 'number':
					addToClass(`bg-${settings.colorscheme}-${bg}`);
					break;
				case 'string':
					addToClass(`bg-${bg}`);
					break;
				default:
					addToClass(`bg-${bg[0]}-${bg[1]}`);
					break;
			}
		}

		if (text) {
			switch (typeof text) {
				case 'number':
					addToClass(`text-${settings.colorscheme}-${text}`);
					break;
				case 'string':
					addToClass(`text-${text}`);
					break;
				default:
					addToClass(`text-${text[0]}-${text[1]}`);
					break;
			}
		}

		return classNameWorking;
	});
</script>

<div class={className}>
	{@render children()}
</div>
