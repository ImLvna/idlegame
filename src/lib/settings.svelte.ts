import LoadableSveltePropSerializable from './classes/loadableSveltePropSerializable';
import type tw from './theme.svelte';

export default class Settings extends LoadableSveltePropSerializable {
	// colorscheme is a key in tw.theme.colors
	colorscheme: keyof typeof tw.theme.colors = $state('gray');
	// Whether to expose the save to the window
	exposeSave = $state(false);

	constructor() {
		super();
	}

	load() {
		try {
			const lsSettings = window.localStorage.getItem('settings');
			if (lsSettings) {
				const serialized: Partial<Settings> = JSON.parse(lsSettings);

				this.loadSerialized(serialized);
			} else {
				throw new Error('No settings found');
			}
		} catch (e) {
			console.error('Failed to load Settings');
			throw e;
		}
	}

	save() {
		const serialized = this.serialize();

		const string = JSON.stringify(serialized);

		window.localStorage.setItem('settings', string);
	}

	registerSaveEffect() {
		$effect(() => {
			this.colorscheme;
			this.exposeSave;
			this.save();
		});
	}
}
