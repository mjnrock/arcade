import chalk from "chalk";

import Circle from "../../modules/core/lib/geometry/Circle";

import CreatureEntity from "./entities/CreatureEntity";
import World from "./worlds/World";
import Game from "./Game";

import demoCaveMap from "./data/maps/demoCaveMap.json";
import BasicWizard from "./data/entities/templates/BasicWizard";

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

			/* STUB: Extra entity for collision testing */
			CreatureEntity.Spawn({
				components: BasicWizard.Components(),
				physics: {
					model: new Circle({
						x: 2,
						y: 8,
						radius: 0.32,
					}),
					speed: 2,
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