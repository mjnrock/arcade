import RPGLivingEntity from "../../../modules/rpg/entities/LivingEntity";

export class PlayerEntity extends RPGLivingEntity {
	constructor ({ abilities = [], ...props } = {}) {
		super({ ...props });
	}
};

export default PlayerEntity;