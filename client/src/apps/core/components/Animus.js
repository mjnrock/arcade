import { Graphics } from "pixi.js";
import Component from "./Component";

export class Animus extends Component {
	constructor ({ id, g, ...props } = {}) {
		super({ id, ...props });

		this.graphics = new Graphics();
	}
}

export default Animus;
