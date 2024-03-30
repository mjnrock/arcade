import Entity from "./Entity";

import BubbleComponent from "../components/Bubble";

export class Bubble extends Entity {
	constructor ({ id, meta = {}, components = [] } = {}) {
		super({ id, meta, components });

		this.addComponent(new BubbleComponent({
			x: Math.random() * 500,
			y: Math.random() * 500,
			vx: (Math.random() - 0.5) * 200,
			vy: (Math.random() - 0.5) * 200,
			r: Math.random() * 20 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		}));
	}
};

export default Bubble;