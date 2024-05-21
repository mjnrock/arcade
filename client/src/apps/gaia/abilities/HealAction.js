import Action from "./Action";
import EnumResourceType from "../components/EnumResourceType";

export class HealAction extends Action {
	constructor ({ amount = 1 } = {}) {
		super();

		this.amount = amount;

		//TODO: Implement damageSource as a way to determine the source/magnitude of the damage
		// this.damageSource = damageSource;
	}

	action({ dt, game, source, targets } = {}) {
		for(const target of targets) {
			const health = target.getComponent(EnumResourceType.Health);

			console.log(health)
			console.log(target)
			health.add(this.amount);
		}
	}
};

export default HealAction;