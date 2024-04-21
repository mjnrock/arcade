import CoreEntitySystem from "../../core/systems/EntitySystem";

export class EntitySystem extends CoreEntitySystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	// update({ game, dt } = {}) {}
	// render({ game, dt } = {}) {}
}

export default EntitySystem;