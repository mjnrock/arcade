import System from "../../core/lib/message/System";

export const Actions = {};

export class AbilitySystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
	}
};

export default AbilitySystem;