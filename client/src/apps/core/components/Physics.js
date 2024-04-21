import { Graphics } from "pixi.js";
import Component from "./Component";

export class Physics extends Component {
	constructor ({ id, x, y, vx, vy } = {}) {
		super({ id });

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;

		this.graphics = new Graphics();
	}

	update({ dt } = {}) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	render({ g = this.graphics } = {}) {
		return g;
	}
}

export default Physics;
