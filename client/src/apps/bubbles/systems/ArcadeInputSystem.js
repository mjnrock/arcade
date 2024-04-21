import CoreArcadeInputSystem from "../../core/systems/ArcadeInputSystem";

import BubbleComponent from "../components/Bubble";
import BubbleEntity from "../entities/Bubble";

export class ArcadeInputSystem extends CoreArcadeInputSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	input({ data, message } = {}) {
		const { ST } = super.input({ data, message });

		if(ST) {
			this.game.player.input.x = ~~(Math.random() * window.innerWidth);
			this.game.player.input.y = ~~(Math.random() * window.innerHeight);
		}
	}

	update({ game, dt } = {}) {
		const step = game.player.input.speed;
		if(game.player.input.mask?.joystick?.UP) {
			game.player.input.y -= step;
		}
		if(game.player.input.mask?.joystick?.DOWN) {
			game.player.input.y += step;
		}
		if(game.player.input.mask?.joystick?.LEFT) {
			game.player.input.x -= step;
		}
		if(game.player.input.mask?.joystick?.RIGHT) {
			game.player.input.x += step;
		}

		if(game.player.input.x < 0) {
			game.player.input.x = 0;
		} else if(game.player.input.x > window.innerWidth) {
			game.player.input.x = window.innerWidth;
		}

		if(game.player.input.y < 0) {
			game.player.input.y = 0;
		} else if(game.player.input.y > window.innerHeight) {
			game.player.input.y = window.innerHeight;
		}

		const { buttons } = game.player.input.mask ?? {}
		const { K1, K2, K3, K4, K11, K12 } = buttons ?? {};
		const cursor = game.player.input;
		if(K1 || K2 || K3) {
			const quantity = 1;
			const bubbles = BubbleEntity.Factory(quantity, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 2 + 1),
				},
				components: [
					new BubbleComponent({
						x: cursor.x,
						y: cursor.y,
						vx: (Math.random() - 0.5) * 50,
						vy: (Math.random() - 0.5) * 50,
						model: {
							r: Math.random() * 10 + 5,
						},
						color: `#ff${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }`,
					}),
				],
			}));

			game.currentWorld?.addEntity(...bubbles);
		}
		if(K4 || K11 || K12) {
			const bubbles = BubbleEntity.Factory(1, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 3),
				},
				components: [
					new BubbleComponent({
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 75,
						vy: (Math.random() - 0.5) * 75,
						model: {
							r: Math.random() * 50 + 5,
						},
						// color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
						color: `#${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }ff`,
					}),
				],
			}));

			game.currentWorld?.addEntity(...bubbles);
		}
	}
};

export default ArcadeInputSystem;