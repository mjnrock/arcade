import { RegistryClass as Registry } from "../../core/lib/Registry";
import Component from "../../core/components/Component";

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
	constructor ({ abilities = {} } = {}) {
		super();

		this.registry = new Registry({ entries: abilities });
	}
};

export default Abilities;