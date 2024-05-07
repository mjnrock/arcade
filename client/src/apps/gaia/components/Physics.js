import CorePhysics from "../../../modules/core/components/Physics";

export class Physics extends CorePhysics {
	constructor ({ speed = 0, ...props } = {}) {
		super({ ...props });

		this.speed = speed;
	}
};

export default Physics;