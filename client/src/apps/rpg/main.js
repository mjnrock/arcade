import RPGGame from "./Game";
import World from "./worlds/World";

import demoCaveMap from "./data/maps/demoCaveMap.json";
import { TerrainEntity } from "./entities/TerrainEntity";
import EnumComponentType from "./components/EnumComponentType";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
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