import { v4 as uuid } from "uuid";

export class Geometry {
	constructor (x, y) {
		this.id = uuid();

		this.x = x;
		this.y = y;
	}
};

export default Geometry;