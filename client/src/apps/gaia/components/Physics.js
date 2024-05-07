import CorePhysics from "../../../modules/core/components/Physics";

export class Physics extends CorePhysics {
	constructor ({ speed = 0, ...props } = {}) {
		super({ ...props });

		this.facing = 0;
		this.speed = speed;
	}

	setFacing({ facing = 0 } = {}) {
		this.facing = facing;

		return this;
	}
};

export default Physics;