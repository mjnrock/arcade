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

	const physics = game.player.entity.getComponent("physics");
	const { x, y } = physics;

	console.log(world.resolveTerrain(x, y))
	console.log(world.resolveTerrain(-1, 8))

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;