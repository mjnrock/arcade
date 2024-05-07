import Polygon from "./Polygon.js";

export class Rectangle extends Polygon {
	constructor (x, y, width, height) {
		super(x, y, [
			{ x: x, y: y },
			{ x: x + width, y: y },
			{ x: x + width, y: y + height },
			{ x: x, y: y + height }
		]);

		this.width = width;
		this.height = height;
	}
};

export default Rectangle;