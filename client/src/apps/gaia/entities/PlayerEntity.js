import RPGPlayerEntity from "../../../modules/rpg/entities/PlayerEntity";

export class PlayerEntity extends RPGPlayerEntity {
	constructor ({ abilities = [], ...props } = {}) {
		super({ ...props });
	}
};

export default PlayerEntity;