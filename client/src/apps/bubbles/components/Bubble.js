import PhysicsComponent from "../../core/components/Physics";

export class Bubble extends PhysicsComponent {
	constructor ({ id, x, y, vx, vy, model = {}, color } = {}) {
		super({ id, x, y, vx, vy });

		this.color = color;
		this.model = {
			type: "circle",
			r: 10,
			...model,
		};
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

export default Bubble;