import RPGAnimateEntity from "../../../modules/rpg/entities/AnimateEntity";

import EnumComponentType from "../components/EnumComponentType";
import Physics from "../../../apps/gaia/components/Physics";
import Animus from "../../../apps/gaia/components/Animus";

export class AnimateEntity extends RPGAnimateEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics: [ Physics, physics ],
			animus: [ Animus, animus ],
		});
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

export default RPGAnimateEntity;