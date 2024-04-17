export default class SveltePropSerializable {
	serialize() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const recurse = (obj: any) => {
			// The object fuckery detects svelte's stateful props, object.keys detects normal props
			const keys = [...Object.getOwnPropertyNames(Object.getPrototypeOf(obj)), ...Object.keys(obj)];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const newObj: any = {};
			for (const key of keys) {
				if (typeof obj[key] === 'function') {
					continue;
				} else if (typeof obj[key] === 'object') {
					newObj[key] = recurse($state.snapshot(obj[key] as Record<string, unknown>));
				} else {
					newObj[key] = $state.snapshot(obj[key]);
				}
			}
			return newObj;
		};

		return recurse(this);
	}
}
