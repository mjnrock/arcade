import PhysicsComponent from "../../core/components/Physics";

export class Player extends PhysicsComponent {
	constructor ({ id, x, y, vx, vy, speed = 5, model = {}, color } = {}) {
		super({ id, x, y, vx, vy });

		this.speed = speed;
		this.color = color; // Ensure this is a numeric color value for PIXI

		this.model = {
			type: "circle",
			r: 10,
			...model,
		};
	}

	update({ dt } = {}) {
		super.update({ dt });

		return this;
	}

	render({ g = this.graphics } = {}) {
		g.clear();
		g.lineStyle(1, this.color, 0.5);
		g.beginFill(this.color, 0.3);
		g.drawCircle(~~this.x, ~~this.y, ~~this.model.r);
		g.endFill();

		return g;
	}
}

export default Player;