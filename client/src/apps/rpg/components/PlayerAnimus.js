import PhysicsComponent from "../../core/components/Physics";

import Animus from "../../core/components/Animus";

export class PlayerAnimus extends Animus {
	constructor ({ color, ...props } = {}) {
		super({ ...props });

		this.color = color ?? `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`;
	}

	render({ entity, g = this.graphics } = {}) {
		const { x, y, model } = entity.getComponent(PhysicsComponent);

		g.clear();
		g.lineStyle(1, this.color, 0.5);
		g.beginFill(this.color, 0.3);
		g.drawCircle(~~x, ~~y, ~~model.r);
		g.endFill();

		return g;
	}
}

export default PlayerAnimus;