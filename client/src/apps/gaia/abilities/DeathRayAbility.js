import Ability from "../../../modules/rpg/abilities/Ability";
import DamageAction from "./DamageAction";
import EnumAbility from "./EnumAbility";
import EnumResourceType from "../../../modules/rpg/components/EnumResourceType";
import Rectangle from "../../../modules/core/lib/geometry/Rectangle";

export class DeathRayAbility extends Ability {
	constructor ({ amount = 0.1, ...props } = {}) {
		super({
			name: EnumAbility.DeathRay,
			model: new Rectangle({ width: 4, height: 4 }),
			actions: [
				new DamageAction({ amount }),
			],
			cost: [
				[ EnumResourceType.Mana, 3 ],
			],

			...props,
		});
	}
};

export default DeathRayAbility;