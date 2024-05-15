import EnumComponentType from "../components/EnumComponentType";
import AnimateEntity from "./AnimateEntity";

/**
 * @class AbilityEntity
 */
export class AbilityEntity extends AnimateEntity {
	constructor ({ source, ability, ...sargs } = {}) {
		super(sargs);

		/* The Entity that spawned the Ability */
		this.source = source;
		/* The Ability that this represents */
		this.ability = ability;

		/* By default, spawn the Ability at the source's position */
		const sourcePhysics = source.getComponent(EnumComponentType.Physics);
		this.ability.model.x = sourcePhysics.model.x;
		this.ability.model.y = sourcePhysics.model.y;
	}
};

export default AbilityEntity;