import Geometry from "./Geometry.js";

export class Circle extends Geometry {
	constructor ({ radius, ...geometry } = {}) {
		super(geometry);

		if(typeof radius === "function") {
			console.log(123)
			this.radius = radius();
		} else {
			this.radius = radius;
		}
	}

	get area() {
		return Math.PI * this.radius ** 2;
	}

	get perimeter() {
		return 2 * Math.PI * this.radius;
	}

	contains({ x, y } = {}) {
		return Math.hypot(x - this.x, y - this.y) <= this.radius;
	}

	intersects({ x, y, radius } = {}) {
		return Math.hypot(x - this.x, y - this.y) <= this.radius + radius;
	}
};

export default Circle;