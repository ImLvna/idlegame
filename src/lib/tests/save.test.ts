import { setSettings } from '$lib/client/toast';
import Save, { CaesarIndex } from '$lib/save.svelte';
import Settings from '$lib/settings.svelte';
import { Caeser } from '$lib/utils';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';

describe('save', () => {
	beforeAll(() => {
		const settings = new Settings();
		setSettings(settings);
	});

	beforeEach(() => {
		vi.resetAllMocks();

		window.localStorage.clear();

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should serialize the json', async () => {
		const save = new Save();

		save.money = 100;
		save.science = 200;
		save.encrypted = false;

		save.save();

		const loaded = JSON.parse(window.localStorage.getItem('save')!);

		expect(loaded.money).toBe(100);
		expect(loaded.science).toBe(200);
		expect(loaded.encrypted).toBe(false);
	});

	it('should load the json', async () => {
		const save = new Save();

		save.money = 100;
		save.science = 200;
		save.encrypted = false;

		save.save();

		const newSave = new Save();

		newSave.load();

		expect(newSave.money).toBe(100);
		expect(newSave.science).toBe(200);
		expect(newSave.encrypted).toBe(false);
	});

	it('should encrypt the save', async () => {
		const save = new Save();

		save.money = 100;
		save.science = 200;
		save.encrypted = true;

		save.save();

		const loaded = window.localStorage.getItem('encSave');

		expect(loaded).toBeDefined();

		const decrypted = atob(Caeser(loaded!, -CaesarIndex));

		const parsed = JSON.parse(decrypted);

		expect(parsed.money).toBe(100);
		expect(parsed.science).toBe(200);
		expect(parsed.encrypted).toBe(true);
	});

	it('should reset the save', async () => {
		const save = new Save();
		save.money = 100;
		save.science = 200;
		save.encrypted = false;
		save.save();
		save.reset();
		expect(save.money).toBe(0);
		expect(save.science).toBe(0);
		expect(save.encrypted).toBe(true);
	});

	it('should throw an error when loading a non-existent save', async () => {
		// window.localStorage.clear();
		const save = new Save();
		expect(() => save.load()).toThrow('No save found');
	});

	it('should throw an error when loading a corrupted save', async () => {
		const save = new Save();
		window.localStorage.setItem('save', 'corrupted');
		expect(() => save.load()).toThrow('Unexpected token \'c\', "corrupted" is not valid JSON');
	});

	it('should calculate the correct offline time', async () => {
		vi.setSystemTime(0);
		const save = new Save();
		save.save();
		vi.setSystemTime(1000 * 60 * 60);
		save.load();
		expect(save.offlineTime).toBe(1000 * 60 * 60);
	});

	it('should not go over one day of offline time', async () => {
		vi.setSystemTime(0);
		const save = new Save();
		save.save();
		vi.setSystemTime(1000 * 60 * 60 * 24 * 2);
		save.load();
		expect(save.offlineTime).toBe(1000 * 60 * 60 * 24);
	});
});
