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

	update(...args) {
		this.entities.forEach(entity => entity?.update(...args));
	}

	render(...args) {
		this.entities.forEach(entity => entity?.render(...args));
	}
};

export default EntityManager;