import { v4 as uuid } from "uuid";

export class Geometry {
	constructor ({ x = null, y = null, id } = {}) {
		this.id = id ?? uuid();

		this.x = x;
		this.y = y;
	}
};

export default Geometry;