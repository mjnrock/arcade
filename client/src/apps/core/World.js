import { v4 as uuid } from "uuid";

import EntityManager from "./entities/EntityManager";
import BubbleComponent from "../bubbles/components/Bubble";

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

			const bubble = entity.getComponent(BubbleComponent);
			if(bubble) {
				this.game.pixi.stage.addChild(bubble.graphics);
			}
		}

		return this;
	}

	removeEntity(...entities) {
		for(const entity of entities) {
			this.entityManager.remove(entity);

			const bubble = entity.getComponent(BubbleComponent);
			if(bubble) {
				this.game.pixi.stage.removeChild(bubble.graphics);
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
