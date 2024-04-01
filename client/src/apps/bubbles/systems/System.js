import { v4 as uuid } from "uuid";

export class System {
	constructor ({ id } = {}) {
		this.id = id ?? uuid();
	}
};

export default System;