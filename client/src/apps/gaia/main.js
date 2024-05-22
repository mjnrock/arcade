import chalk from "chalk";

import Circle from "../../modules/core/lib/geometry/Circle";
import Rectangle from "../../modules/core/lib/geometry/Rectangle";

import CreatureEntity from "./entities/CreatureEntity";
import World from "./worlds/World";
import Game from "./Game";

import demoCaveMap from "./data/maps/demoCaveMap.json";
import BasicWizard from "./data/entities/templates/BasicWizard";
import Wayfinder from "./components/Wayfinder";
import EnumComponentType from "./components/EnumComponentType";

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

console.log(BasicWizard.Components())

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
			...CreatureEntity.Factory(5, () => ({
				components: [
					...BasicWizard.Components(),
					new Wayfinder()
						.addPath({
							x: ~~(9 + ((Math.random() > 0.5 ? -1 : 1) * Math.random() * 4)),
							y: ~~(9 + ((Math.random() > 0.5 ? -1 : 1) * Math.random() * 4)),
						}),
				],
				physics: {
					speed: 10,
					model: new Circle({
						x: 10 + Math.floor(Math.random() * 10),
						y: 10 + Math.floor(Math.random() * 10),
						radius: 0.32,
					}),
				},
				animus: {
					color: "#F33",
				},
			})),
		],
	});

	console.log(game)
	console.log(world)
	console.log(game.player.entity)
	// get the last entity in the world
	const entity = world.entities[ world.entities.length - 1 ];
	console.log(entity)
	const wayfinder = entity.getComponent(EnumComponentType.Wayfinder);
	console.log(wayfinder)

	if(start) {
		game.start();
	}

	return {
		game,
	};
};

export default main;