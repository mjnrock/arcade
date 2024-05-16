import System from "../../../modules/core/lib/message/System";

export const Actions = {};
export const Receivers = {
	joinWorld(message) {
		const { entity, game } = message.data;

		game.currentWorld.addEntity(entity);
	},
};

export class WorldSystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}
};

export default WorldSystem;