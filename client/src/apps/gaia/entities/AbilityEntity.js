import AnimateEntity from "./AnimateEntity";
import EnumComponentType from "../components/EnumComponentType";

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

		/* A cache to manage collision mechanics */
		this.collisions = new Set();
	}
};

export default AbilityEntity;