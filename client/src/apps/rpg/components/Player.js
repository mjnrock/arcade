import { Graphics } from "pixi.js";
import Component from "../../core/components/Component";

export class Player extends Component {
	constructor({ id, x, y, vx, vy, r, color } = {}) {
		super({ id });

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;

		this.color = color; // Ensure this is a numeric color value for PIXI

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
		g.lineStyle(1, this.color, 0.5);
		g.beginFill(this.color, 0.3);
		g.drawCircle(this.x, this.y, this.model.r);
		g.endFill();

		return g;
	}
}

export default Player;
