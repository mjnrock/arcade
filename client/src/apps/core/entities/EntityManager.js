import { v4 as uuid, validate } from "uuid";

export class EntityManager {
	constructor ({ id, entities = [] } = {}) {
		this.id = id ?? uuid();

		/* a registry of all Entities that are managed by this EntityManager */
		this.entities = new Map();
		/* a formalization of the "I only need a subset" pattern) */
		this.cache = new Set();

		this.add(...entities);
	}

	[ Symbol.iterator ]() {
		return this.entities.values();
	}
	/* An equivalent of the iterator, except over the cache */
	get cached() {
		return this.cache.values();
	}

	get size() {
		return this.entities.size;
	}

	writeCache(entities) {
		if(Array.isArray(entities)) {
			this.cache = new Set(entities);
		} else if(entities instanceof Set) {
			this.cache = entities;
		}
		
		return this;
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

	union(...entityManagers) {
		const entities = new Set();

		for(const entityManager of entityManagers) {
			for(const entity of entityManager) {
				entities.add(entity);
			}
		}

		return new EntityManager({ entities });
	}
	intersect(...entityManagers) {
		const entities = new Set();

		for(const entityManager of entityManagers) {
			for(const entity of entityManager) {
				if(entities.has(entity)) {
					entities.add(entity);
				}
			}
		}

		return new EntityManager({ entities });
	}
	difference(...entityManagers) {
		const entities = new Set();

		for(const entityManager of entityManagers) {
			for(const entity of entityManager) {
				if(!entities.has(entity)) {
					entities.add(entity);
				}
			}
		}

		return new EntityManager({ entities });
	}

	/* Logic on whether or not an entity should receive an update should be short-circuited in the `fn` */
	update(fn, { game, dt, ...args } = {}, { useCache = false } = {}) {
		if(useCache) {
			for(const entity of this.cache) {
				fn({ entity, entities: this, game, dt, ...args });
			}
		} else {
			for(const entity of this) {
				fn({ entity, entities: this, game, dt, ...args });
			}
		}
	}

	/* Logic on whether or not an entity should receive a render should be short-circuited in the `fn` */
	render(fn, { game, dt, ...args } = {}, { useCache = false } = {}) {
		if(useCache) {
			for(const entity of this.cache) {
				fn({ entity, entities: this, game, dt, ...args });
			}
		} else {
			for(const entity of this) {
				fn({ entity, entities: this, game, dt, ...args });
			}
		}
	}
};

export default EntityManager;