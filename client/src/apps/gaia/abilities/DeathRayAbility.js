import Ability from "../../../modules/rpg/abilities/Ability";
import Circle from "../../../modules/core/lib/geometry/Circle";
import DamageAction from "./DamageAction";
import EnumAbility from "./EnumAbility";
import EnumResourceType from "../components/EnumResourceType";

export class DeathRayAbility extends Ability {
	constructor ({ speed = 10, amount = 0.1, radius = 0.25, x, y, ...props } = {}) {
		super({
			name: EnumAbility.DeathRay,
			model: new Circle({
				x,
				y,
				radius,
			}),
			actions: [
				new DamageAction({ amount }),
			],
			cost: [
				[ EnumResourceType.Mana, 3 ],
				[ EnumResourceType.Health, 0.25 ],
			],

			...props,
		});

		this.speed = speed;

		this.selector = Ability.Selectors.AllButSelf;
	}
};

export default DeathRayAbility;