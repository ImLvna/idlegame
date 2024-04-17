// See https://kit.svelte.dev/docs/types#app

import type Save from '$lib/save.svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		game?: {
			save: Save;
			settings: Settings;
		};
	}
}

export {};
