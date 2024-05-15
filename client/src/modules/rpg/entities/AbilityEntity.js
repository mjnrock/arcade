import EnumComponentType from "../components/EnumComponentType";
import AnimateEntity from "./AnimateEntity";

/**
 * @class AbilityEntity
 */
export class AbilityEntity extends AnimateEntity {
	constructor ({ source, ability, ...sargs } = {}) {
		super(sargs);

		//TODO: This should be wrapped by a Component
		this.source = source;
		this.ability = ability;

		/* By default, spawn the Ability at the source's position */
		const sourcePhysics = source.getComponent(EnumComponentType.Physics);
		this.ability.model.x = sourcePhysics.model.x;
		this.ability.model.y = sourcePhysics.model.y;
	}
};

export default AbilityEntity;