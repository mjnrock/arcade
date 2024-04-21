import World from "../core/World";

import RPGGame from "./Game";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
	const world = new World({
		game,
		entities: [],
	});

	world.addEntity(game.player.entity);

	game.addWorld(world);

	console.log(game)

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;