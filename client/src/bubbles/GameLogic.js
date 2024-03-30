import Bubble from "./Bubble";

export class GameLogic {
	constructor ({ qty = 50, width = 800, height = 600 } = {}) {
		this.qty = qty;
		this.width = width;
		this.height = height;
		this.bubbles = [];
		this.requestId = null;
		this.lastTime = 0;

		this.initBubbles();
		this.animate = this.animate.bind(this);
		this.requestId = requestAnimationFrame(this.animate);
	}

	initBubbles() {
		this.bubbles = Array.from({ length: this.qty }).map(() => new Bubble({
			x: Math.random() * this.width,
			y: Math.random() * this.height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			r: Math.random() * 20 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		}));
	}

	addBubbleAtPosition({ x, y }) {
		const newBubble = new Bubble({
			x,
			y,
			vx: (Math.random() - 0.5) * 4,
			vy: (Math.random() - 0.5) * 4,
			r: Math.random() * 50 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		});
		this.bubbles = [ ...this.bubbles, newBubble ];
	}

	checkForCollision({ x, y } = {}) {
		const collisionIndex = this.bubbles.findIndex(bubble => {
			const dx = x - bubble.x;
			const dy = y - bubble.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			return distance <= bubble.r;
		});

		if(collisionIndex >= 0) {
			this.bubbles = this.bubbles.filter((_, index) => index !== collisionIndex);
			return true;
		}
		return false;
	}

	animate(currentTime) {
		this.requestId = requestAnimationFrame(this.animate);
		const delta = (currentTime - this.lastTime) * 0.01;
		this.lastTime = currentTime;

		const now = Date.now();
		this.bubbles = this.bubbles.reduce((acc, bubble) => {
			if(now <= bubble.meta.ts + bubble.meta.ttl) {
				bubble.update({ dt: delta });
				acc.push(bubble);
			}
			return acc;
		}, []);
	}

	cleanup() {
		if(this.requestId) {
			cancelAnimationFrame(this.requestId);
		}
	}
};

export default GameLogic;