export class SerializableSettings {
	colorscheme: string;

	constructor(settings: Settings) {
		this.colorscheme = settings.colorscheme;
	}
}

export default class Settings implements SerializableSettings {
	colorscheme = $state('gray');

	constructor() {}

	static load(): Settings {
		try {
			let serializableSave: SerializableSave | null = null;
			const lsSave = window.localStorage.getItem('save');
			if (lsSave) {
				serializableSave = JSON.parse(lsSave);
			} else {
				const encryptedLsSave = window.localStorage.getItem('encSave');
				if (encryptedLsSave) {
					const decrypted = atob(Caeser(encryptedLsSave, -CaesarIndex));
					serializableSave = JSON.parse(decrypted);
				}
			}

			if (serializableSave) {
				const save = new Save();
				save.money = serializableSave.money;
				save.science = serializableSave.science;
				save.encrypted = serializableSave.encrypted;
				return save;
			} else {
				throw new Error('No save found');
			}
		} catch (e) {
			console.error('Failed to load save');
			throw e;
		}
	}

	save() {
		const save = new SerializableSave(this);
		const serialized = JSON.stringify(save);
		if (this.encrypted) {
			const encrypted = Caeser(btoa(serialized), CaesarIndex);
			window.localStorage.setItem('encSave', encrypted);
			window.localStorage.removeItem('save');
		} else {
			window.localStorage.setItem('save', serialized);
			window.localStorage.removeItem('encSave');
		}
	}

	registerSaveEffect() {
		$effect(() => {
			this.money;
			this.science;
			this.encrypted;
			this.save();
		});
	}
}
