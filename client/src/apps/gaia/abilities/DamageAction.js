import Action from "../../../modules/rpg/abilities/Action";
import EnumComponentType from "../components/EnumComponentType";

export class DamageAction extends Action {
	constructor ({ amount = 1 } = {}) {
		super();

		this.amount = amount;

		//TODO: Implement damageSource as a way to determine the source/magnitude of the damage
		// this.damageSource = damageSource;
	}

	action({ dt, game, source, target, amount = this.amount } = {}) {
		if(!target || !source) {
			return false;
		}

		const health = target.getComponent(EnumComponentType.Health);
		if(!health) {
			return false;
		}

		health.sub(amount);

		return true;
	}
};

export default DamageAction;