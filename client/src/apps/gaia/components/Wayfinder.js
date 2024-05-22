import Component from "../../../modules/core/components/Component";
import Geometry from "../../../modules/core/lib/geometry/Geometry";
import { isWithinTolerance } from "../../../modules/core/util/math";
import EnumComponentType from "./EnumComponentType";
import Path from "./Path";

export class Wayfinder extends Component {
	static Type = EnumComponentType.Wayfinder;

	constructor ({ ...component } = {}) {
		super({ ...component });

		this.index = 0;
		this.paths = [];
	}

	get current() {
		return this.paths[ this.index ];
	}
	reset() {
		this.index = 0;
		this.paths = [];

		return this;
	}

	addPath(x, y) {
		if(x instanceof Path) {
			this.paths.push(x);
		} else {
			let points = {
				x: 0,
				y: 0,
			};

			if(Array.isArray(x)) {
				let [ xt, yt ] = x;
				points = {
					x: xt,
					y: yt,
				};
			} else if(typeof x === "object") {
				let { x: xt, y: yt } = x;
				points = {
					x: xt,
					y: yt,
				};
			} else {
				points = {
					x,
					y,
				};
			}

			this.paths.push(new Path({
				points: [
					new Geometry(points),
				],
			}));
		}

		return this;
	}

	update({ entity, dt, game }) {
		const physics = entity.getComponent(EnumComponentType.Physics);

		//TODO: This works, but +/- speed may cyclically over/undershoot the target axis, causing a "jittering" effect (implement some "memory" concept)
		const { x, y } = physics;
		const precision = 0.025 * physics.speed;

		if(this.paths.length) {
			const path = this.current;
			const geometry = path.current;
			const { x: targetX, y: targetY } = geometry;

			/* Check the X-axis */
			if(x < targetX) {
				physics.vx = physics.speed;
			} else if(x > targetX) {
				physics.vx = -physics.speed;
			} else {
				physics.vx = 0;
			}

			/* Check the Y-axis */
			if(y < targetY) {
				physics.vy = physics.speed;
			} else if(y > targetY) {
				physics.vy = -physics.speed;
			} else {
				physics.vy = 0;
			}

			/* Check if the entity is at the destination, within tolerance */
			if(isWithinTolerance(x, targetX, precision) && isWithinTolerance(y, targetY, precision)) {
				this.reset();
				physics.vx = 0;
				physics.vy = 0;
			}
		}

		if(entity === game.player.entity) {
			console.log(this, x, y);
		}
	}
};

export default Wayfinder;