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
			if(!isNaN(x)) {
				this.x += x;
			}
			if(!isNaN(y)) {
				this.y += y;
			}
		} else {
			if(!isNaN(x)) {
				this.x = x;
			}
			if(!isNaN(y)) {
				this.y = y;
			}
		}

		return this;
	}
	setVelocity({ vx, vy, isAdd = false } = {}) {
		if(isAdd) {
			if(!isNaN(vx)) {
				this.vx += vx;
			}
			if(!isNaN(vy)) {
				this.vy += vy;
			}
		} else {
			if(!isNaN(vx)) {
				this.vx = vx;
			}
			if(!isNaN(vy)) {
				this.vy = vy;
			}
		}

		return this;
	}

	applyVelocity({ dt } = {}) {
		this.x += this.vx * dt;
		this.y += this.vy * dt;

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
