import Action from "../../../modules/rpg/abilities/Action";
import EnumComponentType from "../components/EnumComponentType";

export class HealAction extends Action {
	constructor ({ amount = 1 } = {}) {
		super();

		this.amount = amount;

		//TODO: Implement damageSource as a way to determine the source/magnitude of the damage
		// this.damageSource = damageSource;
	}

	action({ dt, game, source, targets } = {}) {
		for(const target of targets) {
			const health = target.getComponent(EnumComponentType.Health);

			health.add(this.amount);
		}
	}
};

export default HealAction;