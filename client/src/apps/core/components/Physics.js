import Component from "./Component";
import { EnumComponentType } from "./EnumComponentType";

export class Physics extends Component {
	static Type = EnumComponentType.Physics;

	constructor ({ x, y, vx, vy, ...props } = {}) {
		super({ ...props });

		this.facing = 0;

		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}

	setFacing({ facing = 0 } = {}) {
		this.facing = facing;

		return this;
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
