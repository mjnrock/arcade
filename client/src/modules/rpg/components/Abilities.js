import { Registry } from "../../core/lib/Registry";
import { Component } from "../../core/components/Component";

import { EnumComponentType } from "../components/EnumComponentType";
import Ability from "../abilities/Ability";

/* TODO: Turn this into a Registry and leverage pools */
/**
 * @class Abilities
 * This is meant to be an inventory of Abilities that can be
 * performed by an Entity.
 * 
 * If a Registry is implemented, you can un/group Abilities
 * by utilizing pools (e.g. "melee", "ranged", "magic", "on cooldown", etc.)
 */
export class Abilities extends Component {
	static Type = EnumComponentType.Abilities;

	constructor ({ abilities = [] } = {}) {
		super();

		this.registry = new Registry();

		this.addAbility(...abilities);
	}

	addAbility(...abilities) {
		for(const ability of abilities) {
			/* Allow either Ability payload, or Ability instance */
			if(typeof ability === "object") {
				const instance = new Ability(ability);
				this.registry.registerWithAlias(instance, instance.name);
			} else if(ability instanceof Ability) {
				this.registry.registerWithAlias(ability, ability.name);
			}
		}

		return this;
	}

	getAbility(name) {
		return this.registry.find(name);
	}
};

export default Abilities;