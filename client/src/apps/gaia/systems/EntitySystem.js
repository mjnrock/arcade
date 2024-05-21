import System from "../../../modules/core/lib/message/System";

export const Actions = {};
export const Receivers = {};

export class EntitySystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}
};

export default EntitySystem;