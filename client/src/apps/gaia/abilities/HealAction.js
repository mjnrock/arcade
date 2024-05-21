import Action from "./Action";
import EnumResourceType from "../components/EnumResourceType";

export class HealAction extends Action {
	constructor ({ amount = 1 } = {}) {
		super();

		this.amount = amount;
	}

	action({ dt, game, source, targets } = {}) {
		for(const target of targets) {
			const health = target.getComponent(EnumResourceType.Health);

			health.add(this.amount);
		}
	}
};

export default HealAction;