import type Settings from '$lib/settings.svelte';
import tw from '$lib/theme.svelte';
import { toast as Toast } from '@zerodevx/svelte-toast';

let settings: Settings;

export function setSettings(s: Settings) {
	settings = s;
}

export default function toast(message: string, options: Parameters<typeof Toast.push>[1] = {}) {
	if (!options.theme) {
		options.theme = {};
	}
	options.theme['--toastBackground'] ??= tw.theme.colors[settings!.colorscheme][500];
	options.theme['--toastBarBackground'] ??= tw.theme.colors.blue[500];

	Toast.push(message, options);
}

export function toastSuccess(message: string) {
	toast(message, {
		theme: {
			'--toastBarBackground': tw.theme.colors.green[500]
		}
	});
}

export function toastError(message: string) {
	toast(message, {
		theme: {
			'--toastBarBackground': tw.theme.colors.red[500]
		}
	});
}

export function toastWarning(message: string) {
	toast(message, {
		theme: {
			'--toastBarBackground': tw.theme.colors.yellow[500]
		}
	});
}

export function toastInfo(message: string) {
	toast(message, {
		theme: {
			'--toastBarBackground': tw.theme.colors.blue[500]
		}
	});
}
