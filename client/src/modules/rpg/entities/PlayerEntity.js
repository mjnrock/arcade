import LivingEntity from "./LivingEntity";

export class PlayerEntity extends LivingEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });
	}
};

export default PlayerEntity;