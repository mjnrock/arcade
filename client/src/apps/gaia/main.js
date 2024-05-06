import Game from "./Game";
import World from "../../modules/rpg/worlds/World";

import demoCaveMap from "./data/maps/demoCaveMap.json";

export const main = async ({ settings = {}, start = false } = {}) => {
	const game = new Game(settings);
	const world = new World({
		game,
		atlas: demoCaveMap,
		entities: [
			game.player.entity
		],
	});

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