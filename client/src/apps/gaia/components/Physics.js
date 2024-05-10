import CorePhysics from "../../../modules/core/components/Physics";

export class Physics extends CorePhysics {
	constructor ({ speed = 0, ...props } = {}) {
		super({ ...props });

		/* Degrees in increments of 45, with 0 NORTH clockwise */
		this.facing = 0;
		/* Speed in tiles per second */
		this.speed = speed;
	}

	setFacing({ facing = 0 } = {}) {
		this.facing = facing;

		return this;
	}
};

export default Physics;