import RPGGame from "./Game";
import World from "./worlds/World";

import demoCaveMap from "./data/maps/demoCaveMap.json";
import { TerrainEntity } from "./entities/TerrainEntity";
import EnumComponentType from "./components/EnumComponentType";

export const main = async ({ config = {}, start = false } = {}) => {
	const game = new RPGGame(config);
	const world = new World({
		game,
		/* As-is, this effectively only processes the player entity's immediate surroundings, update and render */
		culler({ game }) {
			if(Math.random() < 0.01) console.log(this)

			const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
			const { x: playerX, y: playerY } = playerPhysics;
			const visionRadius = 10;

			const entities = this.filter(entity => {
				const physics = entity.getComponent(EnumComponentType.Physics);
				const animus = entity.getComponent(EnumComponentType.Animus);
				const { x, y } = physics;

				if(x >= playerX - visionRadius && x <= playerX + visionRadius && y >= playerY - visionRadius && y <= playerY + visionRadius) {
					if(entity instanceof TerrainEntity) {
						animus.graphics.visible = true;
						return true;
					}

					// const terrain = game.currentWorld.getTerrainAt(x, y);
					// const { type } = terrain;

					return true;
				} else {
					animus.graphics.visible = false;
					return false;
				}
			});

			return entities;
		},
		atlas: demoCaveMap,
		entities: [
			game.player.entity
		],
	});

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