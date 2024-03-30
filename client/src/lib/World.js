import { v4 as uuid, validate } from "uuid";
import BubbleComponent from "./components/Bubble";

export class World {
	constructor ({ game, id, entities = [] } = {}) {
		this.id = id ?? uuid();

		this.game = game;
		this.entities = new Map();

		entities.forEach(entity => this.addEntity(entity));
	}

	addEntity(entity) {
		this.entities.set(entity.id, entity);

		const bubble = entity.getComponent(BubbleComponent);
		if(bubble) {
			this.game.pixi.stage.addChild(bubble.graphics);
		}

		return this;
	}
	removeEntity(entity) {
		this.entities.delete(entity.id);

		return this;
	}

	hasEntity(entity) {
		if(validate(entity)) {
			return this.entities.has(entity);
		}

		return this.entities.has(entity.id);
	}
	getEntity(entity) {
		let result = false;

		if(validate(entity)) {
			result = this.entities.get(entity);
		} else {
			result = this.entities.get(entity.id);
		}

		return result;
	}

	update({ dt } = {}) {
		this.entities.forEach(entity => entity?.update({ dt }));

		return this;
	}
	render({ g } = {}) {
		this.entities.forEach(entity => entity?.render({ g }));

		return this;
	}
};

export default World;