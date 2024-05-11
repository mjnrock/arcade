import Component from "./Component";
import { EnumComponentType } from "./EnumComponentType";
import Geometry from "../lib/geometry/Geometry";

export class Physics extends Component {
	static Type = EnumComponentType.Physics;

	constructor ({ x, y, vx = 0, vy = 0, model, ...props } = {}) {
		super({ ...props });

		this.model = model ?? new Geometry({ x, y });

		this.vx = vx;
		this.vy = vy;
	}

	get x() {
		return this.model.x;
	}
	set x(value) {
		this.model.x = value;
	}
	get y() {
		return this.model.y;
	}
	set y(value) {
		this.model.y = value;
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
}

export default Physics;
