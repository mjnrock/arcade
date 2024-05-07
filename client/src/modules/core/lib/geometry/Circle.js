import Geometry from "./Geometry.js";

export class Circle extends Geometry {
	constructor ({ radius, ...geometry } = {}) {
		super(geometry);

		this.radius = radius;
	}

	get area() {
		return Math.PI * this.radius ** 2;
	}

	get perimeter() {
		return 2 * Math.PI * this.radius;
	}
};

export default Circle;