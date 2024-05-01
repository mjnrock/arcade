import CoreEntitySystem from "../../core/systems/EntitySystem";
import EnumComponentType from "../components/EnumComponentType";
import LivingEntity from "../entities/LivingEntity";

export class EntitySystem extends CoreEntitySystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
	}
	render({ game, dt } = {}) {
		const { tileWidth: tw, tileHeight: th } = game.config.world;

		for(const entity of game.currentWorld.entityManager) {
			if(entity instanceof LivingEntity) {
				const physics = entity.getComponent(EnumComponentType.Physics);
				const animus = entity.getComponent(EnumComponentType.Animus);

				animus.x = ~~(physics.x / tw);
				animus.y = ~~(physics.y / th);
			}
		}

		return this;
	}
}

export default EntitySystem;