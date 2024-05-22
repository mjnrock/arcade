import System from "../../../modules/core/lib/message/System";

export const Actions = {};
export const Receivers = {};

export class EntitySystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}

	update({ dt, ...args } = {}) {
		for(const entity of this.game.currentWorld.entityManager) {
			entity.update({ dt, ...args });

			for(const [ name, component ] of entity.components) {
				component?.update({ entity, dt, ...args });
			}
		}

		return this;
	}

	render({ ...args } = {}) {
		for(const entity of this.game.currentWorld.entityManager) {
			entity.render({ ...args });

			for(const [ name, component ] of entity.components) {
				component?.render({ entity, ...args });
			}
		}

		return this;
	}
};

export default EntitySystem;