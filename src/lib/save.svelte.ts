import { Caeser } from './utils';

export const CaesarIndex = 16;

export class SerializableSave {
	money: number;
	science: number;
	encrypted: boolean = true;

	constructor(save: Save) {
		this.money = save.money;
		this.science = save.science;
		this.encrypted = true;
	}
}

export default class Save implements SerializableSave {
	money = $state(0);
	science = $state(0);
	encrypted = $state(true);

	constructor() {}

	static load(): Save {
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
