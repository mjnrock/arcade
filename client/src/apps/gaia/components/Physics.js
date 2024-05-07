import CorePhysics from "../../../modules/core/components/Physics";
import Geometry from "../../../modules/core/lib/geometry/Geometry";

export class Physics extends CorePhysics {
	constructor ({ model, speed = 0, ...props } = {}) {
		super({ ...props });

		this.model = model ?? new Geometry();
		this.speed = speed;
	}

	// get x() {
	// 	return this.model.x;
	// }
	// set x(value) {
	// 	this.model.x = value;
	// }
	// get y() {
	// 	return this.model.y;
	// }
	// set y(value) {
	// 	this.model.y = value;
	// }
}

export default Physics;