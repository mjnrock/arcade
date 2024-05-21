import Circle from "../../../modules/core/lib/geometry/Circle";

import Ability from "./Ability";
import EnumResourceType from "../components/EnumResourceType";
import EnumAbility from "./EnumAbility";
import HealAction from "./HealAction";

export class HolyNovaAbility extends Ability {
	constructor ({ amount = 0.1, radius = 1, x, y, ...props } = {}) {
		super({
			name: EnumAbility.HolyNova,
			model: new Circle({
				x,
				y,
				radius,
			}),
			actions: [
				new HealAction({ amount }),
			],
			cost: [
				[ EnumResourceType.Mana, 10 ],
			],
			cooldown: 1000,

			...props,
		});

		this.selector = Ability.Selectors.Self;
	}
};

export default HolyNovaAbility;