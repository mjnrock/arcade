import LivingEntity from "../../../modules/rpg/entities/LivingEntity";

export class CreatureEntity extends LivingEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}
};

export default CreatureEntity;