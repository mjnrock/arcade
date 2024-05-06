import AnimateEntity from "./AnimateEntity";

/**
 * This is meant to be a slightly more restrictive version
 * of the AnimateEntity, by enforcing some game-level concept
 * of "being alive".  This could be thought of as something like
 * a "CreatureEntity", but more general, while precluding something
 * like "TerrainEntity".
 */
export class LivingEntity extends AnimateEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}
};

export default LivingEntity;