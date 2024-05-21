import System from "../../../modules/core/lib/message/System";

export const Actions = {};
export const Receivers = {};

export class EntitySystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}
};

export default EntitySystem;