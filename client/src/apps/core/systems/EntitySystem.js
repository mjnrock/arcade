import System from "../../core/lib/message/System";

export class EntitySystem extends System {
	constructor({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		for (const entity of game.currentWorld?.entityManager) {
			if (entity.isDead) {}
		}
	}
}

export default EntitySystem;
