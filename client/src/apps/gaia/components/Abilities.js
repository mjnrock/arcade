import Registry from "../../../modules/core/lib/Registry";
import Component from "../../../modules/core/components/Component";

import { EnumComponentType } from "../components/EnumComponentType";

/**
 * @class Abilities
 * This is meant to be an inventory of Abilities that can be
 * performed by an Entity.
 * 
 * If a Registry is implemented, you can un/group Abilities
 * by utilizing pools (e.g. "melee", "ranged", "magic", "on state", etc.)
 */
export class Abilities extends Component {
	static Type = EnumComponentType.Abilities;

	constructor ({ abilities = [] } = {}) {
		super();

		/* Decoupled to allow game-time manipulation of state, while still being able to reset it (effectively a class/instance paradigm) */
		this.library = new Registry();
		this.state = new Map();

		this.addAbility(...abilities);
	}

	[ Symbol.iterator ]() {
		return this.state[ Symbol.iterator ]();
	}

	getState(name) {
		return this.state.get(name);
	}
	setState(name, argsObj = {}) {
		const fn = this.library.find(name);
		if(fn) {
			this.state.set(name, fn({ ...argsObj }));

			return true;
		}

		return false;
	}

	addAbility(...abilities) {
		for(const abilityPayload of abilities) {
			const [ alias, clazz, argsObj ] = abilityPayload;
			const fn = ({ ...args } = {}) => new clazz({ ...argsObj, ...args });

			this.library.registerWithAlias(fn, alias);
			/* Create a stubbed state for each ability */
			this.setState(alias, { ...argsObj });
		}

		return this;
	}
	removeAbility(...names) {
		for(const name of names) {
			this.library.unregister(name);
			this.removeState(name);
		}

		return this;
	}

	getAbility(name) {
		return this.library.find(name);
	}

	update({ game, dt, entity } = {}) {
		for(const [ name, ability ] of this.state) {
			ability.update({ game, dt, entity });
		}
	}
	render({ dt, game, entity, g = this.graphics } = {}) {
		let i = 0,
			entries = Array.from(this.state).reverse();
		for(const [ name, ability ] of entries) {
			ability.render({ game, dt, entity, i });
			i++;
		}

		return g
	}
};

export default Abilities;