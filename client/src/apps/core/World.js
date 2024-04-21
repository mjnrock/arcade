import { v4 as uuid } from "uuid";

import EntityManager from "./entities/EntityManager";
import AnimusComponent from "./components/Animus";

export const ClientSide = {
	mountAnimusComponent({ game, entity } = {}) {
		const animus = entity.getComponent(AnimusComponent);
		if(animus) {
			game.pixi.stage.addChild(animus.graphics);
		}
	},
	unmountAnimusComponent({ game, entity } = {}) {
		const animus = entity.getComponent(AnimusComponent);
		if(animus) {
			game.pixi.stage.removeChild(animus.graphics);
		}
	},
};

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
			ClientSide.mountAnimusComponent({
				game: this.game,
				entity,
			});
		}

		return this;
	}

	removeEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.remove(entity);

			ClientSide.unmountAnimusComponent({
				game: this.game,
				entity,
			});
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
