import LivingEntity from "./LivingEntity";

export class CreatureEntity extends LivingEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}
};

export default CreatureEntity;