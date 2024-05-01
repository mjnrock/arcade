import * as PIXI from "pixi.js";
import { Component } from "../../core/components/Component";

export class Resource extends Component {
	constructor ({ current = 0, min = 0, max = Infinity, step = 1, ...props } = {}) {
		super({ ...props });

		this.step = step;
		this.min = min;
		/* For initialization purposes, allow current to be set to an unconstrained value */
		this._current = current;
		this.max = max;

		this.graphics = new PIXI.Graphics();
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

	render({ game, dt, g = this.graphics } = {}) {
		g.clear();
		
		if(game.config.ui.showHealth) {
			/* draw a rectangle representing the current value of the resource */
			g.beginFill("#0F0");
			const ratio = this.current / this.max;
			const maxWidth = 24;
			g.drawRect(-maxWidth / 2, -maxWidth + maxWidth / 6, ratio * maxWidth, maxWidth / 6);
			g.endFill();
		}

		return g;
	}
};

export default Resource;