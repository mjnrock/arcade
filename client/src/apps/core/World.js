import { v4 as uuid } from "uuid";

import EntityManager from "./entities/EntityManager";
import { EnumComponentType } from "./components/EnumComponentType";

export const ClientSide = {
	attachEntityGraphics({ game, entity } = {}) {
		const animus = entity.getComponent(EnumComponentType.Animus);
		if(animus) {
			game.pixi.stage.addChild(animus.graphics);
		}
	},
	detachEntityGraphics({ game, entity } = {}) {
		const animus = entity.getComponent(EnumComponentType.Animus);
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

	/**
	 * Convenience method to get all entities in the World as an Array.
	 */
	get entities() {
		return Array.from(this.entityManager.entities.values());
	}

	addEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.add(entity);

			/* Attach the PIXI Graphics to the Game's stage */
			ClientSide.attachEntityGraphics({
				game: this.game,
				entity,
			});
		}

		return this;
	}

	removeEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.remove(entity);

			/* Detach the PIXI Graphics from the Game's stage */
			ClientSide.detachEntityGraphics({
				game: this.game,
				entity,
			});
		}

		return this;
	}

	update({ game, dt } = {}) {
		this.entityManager.update({ game, dt });

		for(const entity of this.entityManager) {
			if(entity.isDead) {
				this.removeEntity(entity);
			}
		}

		return this;
	}

	render({ game, dt } = {}) {
		this.entityManager.render({ game, dt });

		return this;
	}
};

export default World;
