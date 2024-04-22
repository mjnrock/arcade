import RPGGame from "./Game";
import World from "./worlds/World";

import demoCaveMap from "./data/maps/demoCaveMap.json";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
	const world = new World({
		game,
		atlas: demoCaveMap,
		entities: [
			game.player.entity
		]
	});

	// world.addEntity(game.player.entity);
	game.addWorld(world);

	console.log(game)
	console.log(world)

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;