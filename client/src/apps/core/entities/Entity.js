import { v4 as uuid, validate } from "uuid";

export class Entity {
	constructor ({ id, meta = {}, components = [] } = {}) {
		this.id = id ?? uuid();
		this.meta = {
			/* Time created */
			ts: Date.now(),
			/* Time to live, adjust as needed */
			ttl: Infinity,
			...meta,
		};

		this.components = new Map();

		this.addComponent(...components);
	}

	get isDead() {
		return (Date.now() - this.meta.ts) > this.meta.ttl;
	}

	addComponent(...components) {
		components.forEach(component => {
			if(typeof component === "function") {
				const newComponent = component();

				this.components.set(newComponent.type ?? newComponent.id, newComponent);
			} else {
				this.components.set(component.type ?? component.id, component);
			}
		});
		return this;
	}

	removeComponent(...components) {
		components.forEach(component => {
			if(typeof component === "string") {
				this.components.delete(component);
			} else if(typeof component === "function" && component.prototype?.constructor === component) {
				for(let [ , comp ] of this.components) {
					if(comp instanceof component) {
						this.components.delete(comp.id);
					}
				}
			} else {
				this.components.delete(component.id);
			}
		});
		return this;
	}

	hasComponent(component) {
		if(validate(component)) {
			return this.components.has(component);
		}
		return this.components.has(component.id);
	}

	getComponent(component) {
		if(typeof component === "string") {
			return this.components.get(component);
		} else if(typeof component === "function") {
			for(let [ , comp ] of this.components) {
				if(comp instanceof component) {
					return comp;
				}
			}
		} else {
			return this.components.get(component.id);
		}

		return false;
	}

	update({ ...args } = {}) {
		this.components.forEach(component => component?.update({ entity: this, ...args }));
		return this;
	}

	render({ ...args } = {}) {
		this.components.forEach(component => component?.render({ entity: this, ...args }));
		return this;
	}

	static Factory(qty = 1, ...args) {
		if(qty === false) {
			return new this(...args);
		}

		return Array(qty).fill().map(() => {
			if(typeof args[ 0 ] === "function") {
				return new this(args[ 0 ]());
			}

			return new this(...args);
		});
	}
	static Spawn(...args) {
		return new this(...args);
	}
};

export default Entity;