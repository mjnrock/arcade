import AnimateEntity from "./AnimateEntity";

/**
 * @class AbilityEntity
 */
export class AbilityEntity extends AnimateEntity {
	constructor ({ ability, ...sargs } = {}) {
		super(sargs);

		//TODO: This should be wrapped by a Component
		this.ability = ability;
	}
};

export default AbilityEntity;