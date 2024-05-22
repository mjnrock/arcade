import Geometry from "./Geometry";

export class Line extends Geometry {
	constructor ({ x = null, y = null, x2 = null, y2 = null, ...geometry } = {}) {
		super({ x, y, ...geometry });

		this.x2 = x2;
		this.y2 = y2;
	}

	get length() {
		return Math.sqrt(Math.pow(this.x2 - this.x, 2) + Math.pow(this.y2 - this.y, 2));
	}
	get slope() {
		return (this.y2 - this.y) / (this.x2 - this.x);
	}
	get yIntercept() {
		return this.y - this.slope * this.x;
	}
};

export default Geometry;