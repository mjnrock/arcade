import { v4 as uuid, validate } from "uuid";

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
			if(Array.isArray(component) && component.length === 2) {
				const [ Clazz, argsObj ] = component;
				const instance = new Clazz(typeof argsObj === "function" ? argsObj() : argsObj);

				this.components.set(instance.id, instance);
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
		} else if(typeof component === "function" && component.prototype?.constructor === component) {
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

	update(...args) {
		this.components.forEach(component => component?.update(...args));
		return this;
	}

	render(...args) {
		this.components.forEach(component => component?.render(...args));
		return this;
	}

	static Factory(...args) {
		return new this(...args);
	}
};

export default Entity;