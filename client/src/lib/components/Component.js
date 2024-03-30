import { v4 as uuid } from "uuid";

export class Component {
	static Id = uuid();

	constructor ({ id } = {}) {
		this.id = id ?? Component.Id;
	}

	update(...args) { }

	render(...args) { }

	static Factory(...args) {
		return new this(...args);
	}
};

export default Component;