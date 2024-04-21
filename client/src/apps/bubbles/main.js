import World from "../core/World";

import BubbleGame from "./Game";
import BubbleEntity from "./entities/Bubble";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new BubbleGame(config);
	const world = new World({
		game,
		entities: BubbleEntity.Factory(100, () => ({
			physics: {
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: (Math.random() - 0.5) * 200,
				vy: (Math.random() - 0.5) * 200,

				model: {
					type: "circle",
					r: Math.random() * 20 + 5,
				},
			},
			animus: {},
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