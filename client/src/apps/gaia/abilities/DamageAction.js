import EnumResourceType from "../components/EnumResourceType";
import Action from "./Action";

export class DamageAction extends Action {
	constructor ({ amount = 1 } = {}) {
		super();

		this.amount = amount;
	}

	action({ dt, game, source, targets } = {}) {
		for(const target of targets) {
			const health = target.getComponent(EnumResourceType.Health);

			health.sub(this.amount);
		}
	}
};

export default DamageAction;