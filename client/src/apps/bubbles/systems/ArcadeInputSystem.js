import CoreArcadeInputSystem from "../../core/systems/ArcadeInputSystem";
import PhysicsComponent from "../../core/components/Physics";

import BubbleEntity from "../entities/Bubble";
import BubbleAnimusComponent from "../components/BubbleAnimus";

export class ArcadeInputSystem extends CoreArcadeInputSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	//FIXME: This paradigm has been deprecated in favor of the new input(message) paradigm
	// input(message) {
	// 	const { ST } = super.input(message);
	input({ data, message } = {}) {
		const { ST } = super.input({ data, message });

		if(ST) {
			this.game.player.input.x = ~~(Math.random() * window.innerWidth);
			this.game.player.input.y = ~~(Math.random() * window.innerHeight);
		}
	}

	update({ game, dt } = {}) {
		const step = game.player.input.speed;
		if(game.input.arcade?.joystick?.UP) {
			game.player.input.y -= step;
		}
		if(game.input.arcade?.joystick?.DOWN) {
			game.player.input.y += step;
		}
		if(game.input.arcade?.joystick?.LEFT) {
			game.player.input.x -= step;
		}
		if(game.input.arcade?.joystick?.RIGHT) {
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

		const { buttons } = game.input.arcade ?? {}
		const { K1, K2, K3, K4, K11, K12 } = buttons ?? {};
		const cursor = game.player.input;
		if(K1 || K2 || K3) {
			const quantity = 1;
			const bubbles = BubbleEntity.Factory(quantity, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 2 + 1),
				},
				physics: {
					x: cursor.x,
					y: cursor.y,
					vx: (Math.random() - 0.5) * 50,
					vy: (Math.random() - 0.5) * 50,

					model: {
						type: "circle",
						r: Math.random() * 10 + 5,
					},
				},
				animus: {},
			}));

			game.currentWorld?.addEntity(...bubbles);
		}
		if(K4 || K11 || K12) {
			const bubbles = BubbleEntity.Factory(1, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 3),
				},
				physics: {
					x: Math.random() * window.innerWidth,
					y: Math.random() * window.innerHeight,
					vx: (Math.random() - 0.5) * 75,
					vy: (Math.random() - 0.5) * 75,

					model: {
						type: "circle",
						r: Math.random() * 50 + 5,
					},
				},
				animus: {},
			}));

			game.currentWorld?.addEntity(...bubbles);
		}
	}
};

export default ArcadeInputSystem;