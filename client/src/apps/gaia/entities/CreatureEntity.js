import RPGLivingEntity from "../../../modules/rpg/entities/LivingEntity";

export class CreatureEntity extends RPGLivingEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}
};

export default CreatureEntity;