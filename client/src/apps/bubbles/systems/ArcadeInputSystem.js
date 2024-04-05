import System from "../lib/message/System";


import BubbleEntity from "../entities/Bubble";
import BubbleComponent from "../components/Bubble";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}

	input({ data, message } = {}) {
		const { buttons, joystick } = data;

		const { K1, K2, K3, K4, K11, K12 } = buttons;

		if(K1 || K2 || K3 || K4 || K11 || K12) {
			const bubbles = BubbleEntity.Factory(1, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 5 + 3),
				},
				components: [
					new BubbleComponent({
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 75,
						vy: (Math.random() - 0.5) * 75,
						r: Math.random() * 50 + 5,
						// color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
						color: `#ff${Math.floor(Math.random() * 256).toString(16).padStart(2, "0")}${Math.floor(Math.random() * 256).toString(16).padStart(2, "0")}`,
					}),
				],
			}));

			this.game.currentWorld?.addEntity(...bubbles);
		}

		const { UP, DOWN, LEFT, RIGHT } = joystick;

		if(UP || DOWN || LEFT || RIGHT) {
			const qty = ~~(Math.random() * 5 + 1);
			const bubbles = BubbleEntity.Factory(qty, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 5 + 3),
				},
				components: [
					new BubbleComponent({
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 75,
						vy: (Math.random() - 0.5) * 75,
						r: Math.random() * 50 + 5,
						color: `#${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }ff`,
					}),
				],
			}));

			this.game.currentWorld?.addEntity(...bubbles);
		}
	}
};

export default ArcadeInputSystem;