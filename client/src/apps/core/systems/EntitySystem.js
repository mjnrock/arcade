import System from "../../core/lib/message/System";

export class EntitySystem extends System {
	constructor({ game } = {}) {
		super({ game });
	}

	/* Commented example of how to override the update method */
	// update({ game, dt } = {}) {
	// 	for (const entity of game.currentWorld?.entityManager) {
	// 		if (entity.isDead) {}
	// 	}
	// }
}

export default EntitySystem;
