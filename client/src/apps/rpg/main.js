import World from "../core/World";

import RPGGame from "./Game";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
	const world = new World({
		game,
		entities: [
			game.player.entity,
		],
	});

	game.addWorld(world);

	// console.log(game)
	// console.log(game.player)
	// console.log(EnumComponentType.Physics)
	// console.log(game.player.entity.getComponent(EnumComponentType.Physics))

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;