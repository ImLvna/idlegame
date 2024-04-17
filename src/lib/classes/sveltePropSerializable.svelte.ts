/**
 * Utility class that allows for easy serialization of Svelte props.
 * Recurses the object, cloning it and snapshotting all properties.
 */
export default class SveltePropSerializable {
	serialize() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const recurse = (obj: any) => {
			// The object fuckery detects svelte's stateful props, object.keys detects normal props
			const keys = [...Object.getOwnPropertyNames(Object.getPrototypeOf(obj)), ...Object.keys(obj)];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const newObj: any = {};
			for (const key of keys) {
				if (typeof obj[key] === 'function' || key === '__proto__') {
					continue;
				} else if (typeof obj[key] === 'object') {
					if (Array.isArray(obj[key])) {
						const array = [];
						for (const item of $state.snapshot(obj[key])) {
							if (typeof item === 'object') array.push(recurse($state.snapshot(item)));
							else array.push($state.snapshot(item));
						}
						newObj[key] = array;
					} else {
						newObj[key] = recurse($state.snapshot(obj[key] as Record<string, unknown>));
					}
				} else {
					newObj[key] = $state.snapshot(obj[key]);
				}
			}
			return newObj;
		};

		return recurse(this);
	}
}
