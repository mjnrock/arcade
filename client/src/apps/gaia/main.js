import chalk from "chalk";

import Game from "./Game";
import World from "../../modules/rpg/worlds/World";

import demoCaveMap from "./data/maps/demoCaveMap.json";
import Circle from "../../modules/core/lib/geometry/Circle";
import CreatureEntity from "./entities/CreatureEntity";
import Resource from "../../modules/rpg/components/Resource";
import EnumResourceType from "../../modules/rpg/components/EnumResourceType";

/* Get GPU info */
function getWebGLContext() {
	const canvas = document.createElement('canvas');
	const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

	if(!gl) {
		console.log('WebGL not supported');
		return;
	}

	const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
	return debugInfo ? {
		vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
		renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
	} : {
		vendor: 'Not available',
		renderer: 'Not available'
	};
}
const gpuInfo = getWebGLContext();
console.log(chalk.bold.blue('GPU Vendor:'), gpuInfo.vendor);
console.log(chalk.bold.blue('GPU Renderer:'), gpuInfo.renderer);

export const main = async ({ settings = {}, start = false } = {}) => {
	const game = new Game({
		...settings,
		loop: {
			fps: 60,
		},
	});
	const world = new World({
		game,
		atlas: demoCaveMap,
		entities: [
			game.player.entity,
			// STUB: Extra entity for collision testing
			CreatureEntity.Spawn({
				components: [
					new Resource({
						type: EnumResourceType.Health,
						current: 100,
						max: 100,
						step: 0.1,
						regenRate: 0.1,
					}),
					new Resource({
						type: EnumResourceType.Mana,
						current: 250,
						max: 250,
						step: 0.1,
						regenRate: 0.5,
					}),
				],
				physics: {
					model: new Circle({
						x: 2,
						y: 8,
						radius: 0.32,
					}),
				},
				animus: {
					color: "#F33",
				},
			}),
		],
	});

	console.log(game)
	console.log(world)
	console.log(game.player.entity)

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;