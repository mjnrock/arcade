import Identity from "./Identity";

//FIXME: This is basically a STUB to test out Abilities, refactor once you're done
export class Registry extends Identity {
	constructor () {
		super();

		this.registry = new Map();
	}

	register (key, value) {
		this.registry.set(key, value);
	}

	registerWithAlias (value, alias) {
		this.register(alias, value);
	}

	find (key) {
		return this.registry.get(key);
	}

	findAll (key) {
		return Array.from(this.registry.keys()).filter(key);
	}

	remove (key) {
		this.registry.delete(key);
	}

	clear () {
		this.registry.clear();
	}
};

export default Registry;