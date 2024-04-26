import { v4 as uuid, validate } from "uuid";

export class EntityManager {
	constructor ({ id, entities = [] } = {}) {
		this.id = id ?? uuid();

		this.entities = new Map();

		this.add(...entities);
	}

	[ Symbol.iterator ]() {
		return this.entities.values();
	}

	get size() {
		return this.entities.size;
	}

	add(...entities) {
		entities.forEach(entity => this.entities.set(entity.id, entity));

		return this;
	}

	remove(...entities) {
		entities.forEach(entity => this.entities.delete(entity.id));

		return this;
	}

	has(entity) {
		const entityId = validate(entity) ? entity : entity.id;
		return this.entities.has(entityId);
	}

	get(entity) {
		const entityId = validate(entity) ? entity : entity.id;
		return this.entities.get(entityId);
	}

	filter(predicate) {
		return Array.from(this.entities.values()).filter(predicate ?? (() => true));
	}
	map(predicate) {
		return Array.from(this.entities.values()).map(predicate);
	}
	reduce(predicate, initialValue) {
		return Array.from(this.entities.values()).reduce(predicate, initialValue);
	}

	/* Logic on whether or not an entity should receive an update should be short-circuited in the `fn` */
	update(fn, { game, dt, ...args } = {}) {
		for(const entity of this) {
			fn({ entity, entities: this, game, dt, ...args });
		}
	}

	/* Logic on whether or not an entity should receive a render should be short-circuited in the `fn` */
	render(fn, { game, dt, ...args } = {}) {
		for(const entity of this) {
			fn({ entity, entities: this, game, dt, ...args });
		}
	}
};

export default EntityManager;