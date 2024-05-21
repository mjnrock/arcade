import RPGPlayerEntity from "../../../modules/rpg/entities/PlayerEntity";
import EnumComponentType from "../components/EnumComponentType";

export class PlayerEntity extends RPGPlayerEntity {
	constructor ({ abilities = [], ...props } = {}) {
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

export default PlayerEntity;