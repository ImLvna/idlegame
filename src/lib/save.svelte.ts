import moment from 'moment';
import { toastInfo } from './client/toast';
import { Caeser } from './utils';
import LoadableSveltePropSerializable from './classes/loadableSveltePropSerializable';

export const CaesarIndex = 16;

export default class Save extends LoadableSveltePropSerializable {
	// The amount of money the player has
	money = $state(0);
	// The amount of science the player has
	science = $state(0);
	// Whether to base64 and caeser encrypt the save
	encrypted = $state(true);
	// Whether the save has been loaded
	loaded = $state(false);
	// The last time the player logged out
	lastLogout: number | undefined;
	// The amount of time the player was offline
	offlineTime = $state(0);
	// The ratio of producers making money to science
	ratioProducers = $state(0);
	// the levels of the upgrades
	levels = $state({
		money: {
			worker: 0,
			manager: 0
		},
		science: {
			worker: 0,
			manager: 0
		}
	});
	// the number of rebirths
	rebirths = $state(0);

	constructor() {
		super();
	}

	finishLoad() {
		if (this.lastLogout) {
			if (this.offlineTime !== 3600000) {
				const now = Date.now();
				// Max offline time is 1 day
				// Min offline time is 1hr
				console.log(now - this.lastLogout);
				const gained = Math.min(now - this.lastLogout, 86400000);
				if (gained > 1000 * 60 * 60) {
					const total = Math.min(this.offlineTime + gained, 86400000);

					const time = moment.duration(gained);
					console.log(time);
					// You were offline for <days> days, <hours> hours, and <minutes> minutes
					let message = 'You were offline for ';
					if (time.days() > 0) {
						message += `${time.days()} days, `;
					}
					if (time.hours() > 0) {
						message += `${time.hours()} hours, `;
					}
					message += `${time.minutes()} minutes.`;
					if (total === 86400000) {
						message += ' You now have the maximum offline time.';
					}

					toastInfo(message);
				}
			}
		}
		this.loaded = true;
	}

	load() {
		try {
			let serializableSave: Partial<Save> | null = null;
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
				this.loadSerialized(serializableSave);

				this.finishLoad();
			} else {
				throw new Error('No save found');
			}
		} catch (e) {
			console.error('Failed to load save');
			this.finishLoad();
			throw e;
		}
	}

	save() {
		this.lastLogout = Date.now();

		const serialized = this.serialize();

		delete serialized.loaded;

		const string = JSON.stringify(serialized);
		if (this.encrypted) {
			const encrypted = Caeser(btoa(string), CaesarIndex);
			window.localStorage.setItem('encSave', encrypted);
			window.localStorage.removeItem('save');
		} else {
			window.localStorage.setItem('save', string);
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
