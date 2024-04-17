/**
 * Class that can be extended to allow for loading of serialized data.
 */
export default class Loadable {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	loadSerialized(serialized: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const set = (keyNames: string[], value: any) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-this-alias
			let obj: any = this;
			for (const key of keyNames.slice(0, -1)) {
				obj = obj[key];
			}
			obj[keyNames[keyNames.length - 1]] = value;
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const recurse = (keyNames: string[], obj: any) => {
			for (const [key, value] of Object.entries(obj)) {
				if (typeof value === 'object') {
					if (Array.isArray(value)) {
						for (const [i, item] of value.entries()) {
							if (typeof item === 'object') {
								recurse([...keyNames, key, i.toString()], item);
							} else {
								set([...keyNames, key, i.toString()], item);
							}
						}
					} else {
						obj[key] = recurse([...keyNames, key], value);
					}
				} else {
					set([...keyNames, key], value);
				}
			}
		};

		recurse([], serialized);
	}
}
