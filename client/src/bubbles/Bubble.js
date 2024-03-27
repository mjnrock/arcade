import { Graphics } from "pixi.js";

export class Bubble {
	constructor ({ x, y, vx, vy, r, color } = {}) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.r = r;
		this.color = color;

		this.graphics = new Graphics();
	}

	update({ dt, vx = this.vx, vy = this.vy } = {}) {
		this.x += vx * dt;
		this.y += vy * dt;
	}

	render({ g = this.graphics } = {}) {
		g.clear();
		g.beginFill(this.color, 1);
		g.drawCircle(this.x, this.y, this.r);
		g.endFill();
	}
}

export default Bubble;