import moment from 'moment';
import { toastInfo } from './client/toast';
import SveltePropSerializable from './sveltePropSerializable.svelte';
import { Caeser } from './utils';

export const CaesarIndex = 16;

class MoneyLevels {
	worker = $state(0);
	manager = $state(0);
}

class ScienceLevels {
	worker = $state(0);
	manager = $state(0);
}

class Levels {
	money = new MoneyLevels();
	science = new ScienceLevels();
}

export default class Save extends SveltePropSerializable {
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
	levels = new Levels();
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
				this.money = serializableSave.money ?? this.money;
				this.science = serializableSave.science ?? this.science;
				this.encrypted = serializableSave.encrypted ?? this.encrypted;
				this.lastLogout = serializableSave.lastLogout;
				this.offlineTime = serializableSave.offlineTime ?? this.offlineTime;
				this.ratioProducers = serializableSave.ratioProducers ?? this.ratioProducers;
				this.levels.money.worker =
					serializableSave.levels?.money?.worker ?? this.levels.money.worker;
				this.levels.money.manager =
					serializableSave.levels?.money?.manager ?? this.levels.money.manager;
				this.levels.science.worker =
					serializableSave.levels?.science?.worker ?? this.levels.science.worker;
				this.levels.science.manager =
					serializableSave.levels?.science?.manager ?? this.levels.science.manager;
				this.rebirths = serializableSave.rebirths ?? this.rebirths;

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

		const serialized = JSON.stringify(this.serialize());
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
