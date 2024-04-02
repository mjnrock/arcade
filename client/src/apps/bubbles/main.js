import BubbleGame from "./Game";
import World from "./World";

import BubbleComponent from "./components/Bubble";
import BubbleEntity from "./entities/Bubble";

export const main = async ({ viewport, config = {}, start = false } = {}) => {
	const game = new BubbleGame(config);
	const world = new World({
		game,
		entities: BubbleEntity.Factory(100, () => ({
			components: [
				new BubbleComponent({
					x: Math.random() * window.innerWidth,
					y: Math.random() * window.innerHeight,
					vx: (Math.random() - 0.5) * 200,
					vy: (Math.random() - 0.5) * 200,
					r: Math.random() * 20 + 5,
					color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
				}),
			],
		})),
	});

	game.addWorld(world);

	if(viewport) {
		viewport.appendChild(game.pixi.view);
	}

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;