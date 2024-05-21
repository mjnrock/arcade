import LivingEntity from "./LivingEntity";

export class PlayerEntity extends LivingEntity {
	constructor ({ abilities = [], ...props } = {}) {
		super({ ...props });
	}
};

export default PlayerEntity;