import CoreEntitySystem from "../../core/systems/EntitySystem";
import PlayerComponent from "../components/Player";

export class EntitySystem extends CoreEntitySystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		for(const entity of game.currentWorld.entityManager) {
			const physics = entity.getComponent(PlayerComponent);
			if(physics) {
				physics.setPosition({
					x: game.player.input.x,
					y: game.player.input.y,
				});
			}
		}

		return this;
	}
	// render({ game, dt } = {}) {}
}

export default EntitySystem;