import type tw from './theme.svelte';

export class SerializableSettings {
	colorscheme: keyof typeof tw.theme.colors;
	exposeSave: boolean;

	constructor(settings: SerializableSettings | Settings) {
		this.colorscheme = settings.colorscheme;
		this.exposeSave = settings.exposeSave;
	}
}

export default class Settings implements SerializableSettings {
	// colorscheme is a key in tw.theme.colors
	colorscheme: keyof typeof tw.theme.colors = $state('gray');
	// Whether to expose the save to the window
	exposeSave = $state(false);

	constructor() {}

	load() {
		try {
			const lsSettings = window.localStorage.getItem('settings');
			if (lsSettings) {
				const serialized: Partial<SerializableSettings> = JSON.parse(lsSettings);

				this.colorscheme = serialized.colorscheme ?? this.colorscheme;
				this.exposeSave = serialized.exposeSave ?? this.exposeSave;
			} else {
				throw new Error('No settings found');
			}
		} catch (e) {
			console.error('Failed to load Settings');
			throw e;
		}
	}

	save() {
		const save = new SerializableSettings(this);
		const serialized = JSON.stringify(save);

		window.localStorage.setItem('settings', serialized);
	}

	registerSaveEffect() {
		$effect(() => {
			this.colorscheme;
			this.exposeSave;
			this.save();
		});
	}
}
