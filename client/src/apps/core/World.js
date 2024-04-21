import { v4 as uuid } from "uuid";

import EntityManager from "./entities/EntityManager";
import PhysicsComponent from "./components/Physics";

export class World {
	constructor ({ game, id, entities = [] } = {}) {
		this.id = id ?? uuid();
		this.game = game;
		this.entityManager = new EntityManager();

		for(const entity of entities) {
			this.addEntity(entity);
		}
	}

	addEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.add(entity);

			/* Because we pass the class, this will ultimately perform an "instanceof" check
			* to determine if the entity has a PhysicsComponent.  Accordingly, if has more
			* than one (1), it will use the first one found.
			*/
			const physics = entity.getComponent(PhysicsComponent);
			if(physics) {
				this.game.pixi.stage.addChild(physics.graphics);
			}
		}

		return this;
	}

	removeEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.remove(entity);

			const physics = entity.getComponent(PhysicsComponent);
			if(physics) {
				this.game.pixi.stage.removeChild(physics.graphics);
			}
		}

		return this;
	}

	update(...args) {
		this.entityManager.update(...args);

		for(const entity of this.entityManager) {
			if(entity.isDead) {
				this.removeEntity(entity);
			}
		}

		return this;
	}

	render(...args) {
		this.entityManager.render(...args);
		return this;
	}
};

export default World;
