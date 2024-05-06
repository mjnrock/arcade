import { v4 as uuid } from "uuid";
import * as PIXI from "pixi.js";

import EntityManager from "./entities/EntityManager";
import { EnumComponentType } from "./components/EnumComponentType";
import { Actionable } from "./lib/Actionable";

export const ClientSide = {
	initializeGraphics(world) {
		world.graphics = new PIXI.Container();
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

export class World extends Actionable {
	static IsServer = false;
	static get IsClient() {
		return !this.IsServer;
	}

	constructor ({ game, id, entities = [], ...actionables } = {}) {
		super({ ...actionables });

		this.id = id ?? uuid();
		this.game = game;
		this.entityManager = new EntityManager();

		game.addWorld(this);

		if(World.IsClient) {
			ClientSide.initializeGraphics(this);
		}

		this.addEntity(...entities);
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
		this.process({ game, dt });

		for(const entity of this.entityManager) {
			if(entity.isDead) {
				this.removeEntity(entity);
			}
		}

		return this;
	}
};

export default World;
