import World from "../core/World";

import RPGGame from "./Game";
import BubbleComponent from "./components/Bubble";
import PlayerEntity from "./entities/Player";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
	const world = new World({
		game,
		entities: PlayerEntity.Factory(100, () => ({
			components: [
				new BubbleComponent({
					x: Math.random() * window.innerWidth,
					y: Math.random() * window.innerHeight,
					vx: (Math.random() - 0.5) * 200,
					vy: (Math.random() - 0.5) * 200,
					model: {
						r: Math.random() * 20 + 5,
					},
					color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
				}),
			],
		})),
	});

	game.addWorld(world);

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;