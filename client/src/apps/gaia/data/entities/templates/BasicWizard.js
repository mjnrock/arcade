import Resource from "../../../../../modules/core/components/Resource";

import Abilities from "../../../components/Abilities";
import EnumResourceType from "../../../components/EnumResourceType";
import EnumAbility from "../../../abilities/EnumAbility";
import EnergyBallAbility from "../../../abilities/EnergyBallAbility";
import HolyNovaAbility from "../../../abilities/HolyNovaAbility";

export const Components = (components = {}) => {
	const compLookup = {
		health: new Resource({
			type: EnumResourceType.Health,
			current: 100,
			max: 100,
			// regenRate: 0.1,
		}),
		mana: new Resource({
			type: EnumResourceType.Mana,
			current: 250,
			max: 250,
			regenRate: 5,
		}),
		abilities: new Abilities({
			abilities: [
				/* [ alias, class, defaultArgs ] */
				[ EnumAbility.EnergyBall, EnergyBallAbility, {
					amount: 0.25,
					cooldown: 250,
				} ],
				[ EnumAbility.HolyNova, HolyNovaAbility, {
					amount: 0.25,
					radius: 1,
					cooldown: 1000,
				} ],
			],
		}),
		...components,
	};

	return Array.from(Object.values(compLookup));
};

export default {
	Components,
};