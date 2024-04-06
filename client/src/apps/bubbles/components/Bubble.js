import { Graphics } from "pixi.js";
import Component from "../../core/components/Component";

export class Bubble extends Component {
	constructor ({ id, x, y, vx, vy, r, color } = {}) {
		super({ id });

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;

		this.color = color;

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
		g.beginFill(this.color, 1);
		g.drawCircle(this.x, this.y, this.model.r);
		g.endFill();

		return g;
	}
};

export default Bubble;