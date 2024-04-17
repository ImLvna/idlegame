import SveltePropSerializable from './sveltePropSerializable.svelte';
import Loadable from './loadable';

/**
 * A class that extends SveltePropSerializable and Loadable.
 * This class is used for classes that need to be serialized and deserialized.
 *
 * It extends SveltePropSerializable, and calls Loadable's loadSerialized method in its own loadSerialized method.
 */
export default class LoadableSveltePropSerializable extends SveltePropSerializable {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	loadSerialized(serialized: any) {
		Loadable.prototype.loadSerialized.call(this, serialized);
	}
}
