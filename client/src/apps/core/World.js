import { v4 as uuid } from "uuid";
import * as PIXI from "pixi.js";

import EntityManager from "./entities/EntityManager";
import { EnumComponentType } from "./components/EnumComponentType";

export const ClientSide = {
	initializeGraphics(world) {
		world.graphics = new PIXI.Container();
		world.refreshViewport({ game: world.game });
		world.game.pixi.stage.addChild(world.graphics);
	},
	attachEntityGraphics({ game, entity } = {}) {
		const animus = entity.getComponent(EnumComponentType.Animus);
		if(animus) {
			game.currentWorld.graphics.addChild(animus.graphics);
		}
	},
	detachEntityGraphics({ game, entity } = {}) {
		const animus = entity.getComponent(EnumComponentType.Animus);
		if(animus) {
			game.currentWorld.graphics.removeChild(animus.graphics);
		}
	},
};

export class World {
	constructor ({ game, id, entities = [] } = {}) {
		this.id = id ?? uuid();
		this.game = game;
		this.entityManager = new EntityManager();

		game.addWorld(this);
		this.addEntity(...entities);

		ClientSide.initializeGraphics(this);
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
		for(const entity of this.entityManager) {
			if(entity.isDead) {
				this.removeEntity(entity);
			}
		}

		return this;
	}

	refreshViewport({ game, dt } = {}) {
		if(!game?.config) return;

		game.config.world.viewport.x = 0;
		game.config.world.viewport.y = 0;
		game.config.world.viewport.width = window.innerWidth;
		game.config.world.viewport.height = window.innerHeight;
	}
};

export default World;
