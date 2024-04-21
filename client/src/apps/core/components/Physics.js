import { Graphics } from "pixi.js";
import Component from "./Component";

export class Physics extends Component {
	constructor({ id, x, y, vx, vy, r } = {}) {
		super({ id });

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;

		this.graphics = new Graphics();
		this.model = {
			type: "circle",
			r: r,
		};
	}

	update({ dt, vx = this.vx, vy = this.vy } = {}) {
		this.x += vx * dt;
		this.y += vy * dt;
	}

	render({ g = this.graphics } = {}) {
		g.clear();
		g.lineStyle(1, 0x000, 0.5);
		g.beginFill(0x000, 0.3);
		g.drawCircle(this.x, this.y, this.model.r);
		g.endFill();

		return g;
	}
}

export default Physics;
