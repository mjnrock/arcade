import { Registry } from "../../core/lib/Registry";
import { Component } from "../../core/components/Component";

import { EnumComponentType } from "../components/EnumComponentType";

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
		for(const abilityPayload of abilities) {
			const [ alias, clazz, argsObj ] = abilityPayload;
			const fn = ({ ...args } = {}) => new clazz({ ...argsObj, ...args });

			/* Ultimately register a generator function */
			this.registry.registerWithAlias(fn, alias);
		}

		return this;
	}

	getAbility(name) {
		return this.registry.find(name);
	}
};

export default Abilities;