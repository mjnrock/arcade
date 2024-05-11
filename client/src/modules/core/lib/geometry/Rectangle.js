import Polygon from "./Polygon.js";

export class Rectangle extends Polygon {
	constructor ({ width, height, ...polygon } = {}) {
		super({
			vertices: [
				{ x: 0, y: 0 },
				{ x: width, y: 0 },
				{ x: width, y: height },
				{ x: 0, y: height }
			],
			...polygon
		});

		if(this.vertices.length !== 4) throw new Error("A rectangle must have exactly 4 vertices.");

		this.width = width;
		this.height = height;
	}

	contains({ x, y } = {}) {
		return (x >= this.x && x < this.x + this.width &&
			y >= this.y && y < this.y + this.height);
	}

	intersects({ x, y, width, height } = {}) {
		return !(x > this.x + this.width ||
			x + width < this.x ||
			y > this.y + this.height ||
			y + height < this.y);
	}
};

export default Rectangle;