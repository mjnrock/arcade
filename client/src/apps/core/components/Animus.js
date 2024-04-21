import { Graphics } from "pixi.js";

import Component from "./Component";
import { EnumComponentType } from "./EnumComponentType";


export class Animus extends Component {
	static Type = EnumComponentType.Animus;

	constructor ({ g, ...props } = {}) {
		super({ ...props });

		this.graphics = g ?? new Graphics();
	}
}

export default Animus;
