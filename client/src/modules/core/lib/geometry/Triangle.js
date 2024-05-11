import Polygon from "./Polygon.js";

export class Triangle extends Polygon {
	constructor ({ vertices, ...polygon } = {}) {
		super({ vertices, ...polygon });

		if(this.vertices.length !== 3) throw new Error("A triangle must have exactly 3 vertices.");
	}
};

export default Triangle;