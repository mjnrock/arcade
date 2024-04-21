import { v4 as uuid } from "uuid";

export class Component {
	constructor ({ id, ...props } = {}) {
		this.id = id ?? uuid();

		for(const key in props) {
			this[ key ] = props[ key ];
		}
	}

	update(...args) { }

	render(...args) { }

	static Factory(...args) {
		return new this(...args);
	}
};

export default Component;