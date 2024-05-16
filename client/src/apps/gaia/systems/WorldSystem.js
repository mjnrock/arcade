import System from "../../../modules/core/lib/message/System";

export const Actions = {
	joinWorld({ entity, game, dt } = {}) {
		game.currentWorld.addEntity(entity);
	},
};

export class WorldSystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
	}
};

export default WorldSystem;