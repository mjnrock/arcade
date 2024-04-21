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

	setPosition({ x, y, isAdd = false } = {}) {
		if(isAdd) {
			this.x += x;
			this.y += y;
		} else {
			this.x = x;
			this.y = y;
		}

		return this;
	}
	setVelocity({ vx, vy, isAdd = false } = {}) {
		if(isAdd) {
			this.vx += vx;
			this.vy += vy;
		} else {
			this.vx = vx;
			this.vy = vy;
		}

		return this;
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
