import { v4 as uuid } from "uuid";

import { EnumComponentType } from "./EnumComponentType";

export class Component {
	static Type = EnumComponentType.Component;

	constructor ({ id, type, ...props } = {}) {
		this.id = id ?? uuid();
		this.type = type ?? this.constructor.Type;

		for(const key in props) {
			this[ key ] = props[ key ];
		}
	}

	merge({ ...props }) {
		for(const key in props) {
			this[ key ] = props[ key ];
		}

		return this;
	}

	update(...args) { }

	render(...args) { }

	static Factory(...args) {
		return new this(...args);
	}
};

export default Component;