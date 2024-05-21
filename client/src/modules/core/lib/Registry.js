import { validate } from "uuid";
import Identity from "./Identity";

//FIXME: This is basically a STUB to test out Abilities, refactor-hance once you're done
export class Registry extends Identity {
	constructor () {
		super();

		this.registry = new Map();
	}

	[ Symbol.iterator ]() {
		return this.registry.entries();
	}

	register(key, value) {
		this.registry.set(key, value);
	}

	registerWithAlias(value, alias) {
		this.register(alias, value);
	}

	unregister(key) {
		if(validate(key)) {
			// key is the actual entry's .id property, then remove all alises
			this.registry.delete(key);
			
			for(const [ key, value ] of this.registry.entries()) {
				if(value === key) {
					this.registry.delete(key);
				}
			}
		} else {
			// go the other way -- key is the alias, find .id value, then clean all aliases
			const id = this.registry.get(key);
			this.registry.delete(id);

			for(const [ key, value ] of this.registry.entries()) {
				if(value === id) {
					this.registry.delete(key);
				}
			}
		}
	}

	find(key) {
		return this.registry.get(key);
	}

	findAll(key) {
		return Array.from(this.registry.keys()).filter(key);
	}

	remove(key) {
		this.registry.delete(key);
	}

	clear() {
		this.registry.clear();
	}
};

export default Registry;