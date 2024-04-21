import { v4 as uuid, validate } from "uuid";

import Physics from "../components/Physics";

export class Entity {
	constructor ({ id, meta = {}, components = [] } = {}) {
		this.id = id ?? uuid();
		this.meta = {
			ts: Date.now(),
			ttl: 1000 * (Math.random() * 5 + 5),
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

				this.components.set(newComponent.id, newComponent);
			} else {
				this.components.set(component.id, component);
			}
		});
		return this;
	}

	removeComponent(...components) {
		components.forEach(component => {
			if(validate(component)) {
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
		if(validate(component)) {
			return this.components.get(component);
		} else if(typeof component === "function") {
			for(let [ , comp ] of this.components) {
				if(comp instanceof component) {
					return comp;
				}
			}
		} else if(typeof component === "string") {
			for(let [ , comp ] of this.components) {
				if(comp.prototype?.constructor === component || comp.constructor?.name === component) {
					return comp;
				}
			}
		} else {
			return this.components.get(component.id);
		}

		return false;
	}

	update(...args) {
		this.components.forEach(component => component?.update(...args));
		return this;
	}

	render(...args) {
		this.components.forEach(component => component?.render(...args));
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
};

export default Entity;