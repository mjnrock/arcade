import * as PIXI from "pixi.js";

import { Component } from "../../core/components/Component";
import EnumComponentType from "../../core/components/EnumComponentType";
import Circle from "../../core/lib/geometry/Circle";
import Rectangle from "../../core/lib/geometry/Rectangle";

export class Resource extends Component {
	constructor ({ current = 0, min = 0, max = Infinity, step = 1, regenRate = 0, ...props } = {}) {
		super({ ...props });

		this.step = step;
		this.min = min;
		/* For initialization purposes, allow current to be set to an unconstrained value */
		this._current = current;
		this.max = max;

		this.graphics = new PIXI.Graphics();

		this.regenRate = regenRate;
	}

	get asArray() {
		return [ this.type, this.step, this.min, this.current, this.max ];
	}

	get current() {
		return this._current;
	}
	set current(value) {
		this._current = Math.max(this.min, Math.min(this.max, value));
		this._current = Math.round(this._current / this.step) * this.step;
	}

	get isAtMax() {
		return this.current >= this.max;
	}
	get isAtMin() {
		return this.current <= this.min;
	}
	get isEmpty() {
		return this.current <= 0;
	}
	get isFull() {
		return this.current >= this.max;
	}

	regen(dt = 1) {
		this.add(this.regenRate * dt);
		return this;
	}

	fill() {
		this.current = this.max;
		return this;
	}
	empty() {
		this.current = this.min;
		return this;
	}

	set(value) {
		this.current = value;
		return this;
	}

	add(value, { iterations = 1 } = {}) {
		this.current += value;

		if(iterations > 1) {
			this.add(value, { iterations: iterations - 1 });
		}

		return this;
	}
	sub(value, { iterations = 1 } = {}) {
		return this.add(-value, { iterations });
	}
	mul(value, { iterations = 1 } = {}) {
		this.current *= value;

		if(iterations > 1) {
			this.mul(value, { iterations: iterations - 1 });
		}

		return this;
	}
	div(value, { iterations = 1 } = {}) {
		this.current /= value;

		if(iterations > 1) {
			this.div(value, { iterations: iterations - 1 });
		}

		return this;
	}
	pow(value, { iterations = 1 } = {}) {
		this.current **= value;

		if(iterations > 1) {
			this.pow(value, { iterations: iterations - 1 });
		}

		return this;
	}
	mod(value, { iterations = 1 } = {}) {
		this.current %= value;

		if(iterations > 1) {
			this.mod(value, { iterations: iterations - 1 });
		}

		return this;
	}
	rot(value, { iterations = 1 } = {}) {
		this.current = (this.current + value) % this.max;

		if(iterations > 1) {
			this.rot(value, { iterations: iterations - 1 });
		}

		return this;
	}

	update({ game, dt, entity } = {}) {
		this.regen(dt);
	}
	//TODO: This look is interesting, but it needs work to be "correct"
	render({ game, dt, g = this.graphics, entity } = {}) {
		g.clear();

		// Accessing the physics component
		const physics = entity.components.get(EnumComponentType.Physics);
		const model = physics.model;

		const uiConfig = game.config.ui[ this.type ];
		if(uiConfig?.showBar) {
			// Define color thresholds using array of arrays [threshold, color]
			const colorThresholds = uiConfig.thresholds;

			// Border dimensions and style derived from config
			const maxWidth = uiConfig.width;
			const maxHeight = uiConfig.height;
			const borderWidth = 0.5; // Thickness of the border

			// Calculate the top position of the entity's model to place the UI
			let topY = 0;
			if(model instanceof Circle) {
				topY = -model.radius * game.config.world.tileHeight;
			} else if(model instanceof Rectangle) {
				topY = -model.height / 2 * game.config.world.tileHeight;
			}

			// Offset coordinates from config (adjusted for topY)
			const offsetX = uiConfig.ox;
			const offsetY = topY + uiConfig.oy - maxHeight;

			// Draw the full-sized black border rectangle for the bar
			g.lineStyle(borderWidth, 0x000000, 1);
			g.beginFill(0xFFFFFF, 0); // Transparent fill for the border-only rectangle
			g.drawRect(offsetX - maxWidth / 2, offsetY, maxWidth, maxHeight);
			g.endFill();

			// Determine the color based on the health ratio
			const ratio = this.current / this.max;
			let color = colorThresholds[ 0 ][ 1 ]; // Default color is the first threshold
			for(let i = 0; i < colorThresholds.length; i++) {
				if(ratio > colorThresholds[ i ][ 0 ]) {
					color = colorThresholds[ i ][ 1 ];
					break;
				}
			}

			// Draw the filled rectangle inside the border
			g.lineStyle(0); // No outline for the filled part
			g.beginFill(parseInt(color.slice(1), 16)); // Convert hex string to numeric hex
			// Adjust rectangle dimensions to fit inside the border
			g.drawRect(
				offsetX - maxWidth / 2 + borderWidth,
				offsetY + borderWidth,
				ratio * (maxWidth - 2 * borderWidth),
				maxHeight - 2 * borderWidth
			);
			g.endFill();
		}

		return g;
	}
};

export default Resource;