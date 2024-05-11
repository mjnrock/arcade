import Geometry from "./Geometry.js";

export class Polygon extends Geometry {
	constructor ({ vertices, ...geometry } = {}) {
		super(geometry);

		this.vertices = vertices; // vertices should be an array of {x, y} objects
	}

	get area() {
		const n = this.vertices.length;
		let area = 0;
		for(let i = 0; i < n; i++) {
			let j = (i + 1) % n;
			area += this.vertices[ i ].x * this.vertices[ j ].y - this.vertices[ j ].x * this.vertices[ i ].y;
		}
		return Math.abs(area / 2);
	}

	get perimeter() {
		const n = this.vertices.length;
		let perimeter = 0;
		for(let i = 0; i < n; i++) {
			let j = (i + 1) % n;
			perimeter += Math.sqrt((this.vertices[ j ].x - this.vertices[ i ].x) ** 2 + (this.vertices[ j ].y - this.vertices[ i ].y) ** 2);
		}
		return perimeter;
	}
};

export default Polygon;