import RPGAnimateEntity from "../../../modules/rpg/entities/AnimateEntity";
import EnumComponentType from "../components/EnumComponentType";

/**
 * This is meant to be a slightly more restrictive version
 * of the AnimateEntity, by enforcing some game-level concept
 * of "being alive".  This could be thought of as something like
 * a "CreatureEntity", but more general, while precluding something
 * like "TerrainEntity".
 */
export class LivingEntity extends RPGAnimateEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}

	update({ game, dt, entity } = {}) {
		super.update({ game, dt, entity });

		const abilities = this.components.get(EnumComponentType.Abilities);
		if(abilities) {
			abilities.update({ dt, game, entity: this });
		}
	}
	render({ game, dt } = {}) {
		super.render({ game, dt });

		/* Render abilities */
		const abilities = this.components.get(EnumComponentType.Abilities);
		if(abilities) {
			abilities.render({ dt, game, entity: this });
		}
	}
};

export default LivingEntity;