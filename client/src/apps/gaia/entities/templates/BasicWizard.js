import EnumResourceType from "../../components/EnumResourceType";
import Resource from "../../../../modules/rpg/components/Resource";

import Abilities from "../../../../modules/rpg/components/Abilities";
import DeathRayAbility from "../../abilities/DeathRayAbility";

export const Components = (components = {}) => {
	const compLookup = {
		health: new Resource({
			type: EnumResourceType.Health,
			current: 100,
			max: 100,
			step: 0.1,
			regenRate: 0.1,
		}),
		mana: new Resource({
			type: EnumResourceType.Mana,
			current: 250,
			max: 250,
			step: 0.1,
			regenRate: 0.5,
		}),
		abilities: new Abilities({
			abilities: [
				new DeathRayAbility({
					amount: 0.1,
				}),
			],
		}),
		...components,
	};

	return Array.from(Object.values(compLookup));
};

export default {
	Components,
};