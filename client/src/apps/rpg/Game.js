import CoreGame from "../core/Game";

import InputSystem from "./systems/InputSystem";
import EntitySystem from "./systems/EntitySystem";

import LivingEntity from "./entities/LivingEntity";
import { PlayerEntity } from "./entities/PlayerEntity";

export class RPG extends CoreGame {
	constructor ({ ...args } = {}) {
		super({
			...args,
		});

		this.mountSystems(
			InputSystem,
			EntitySystem,
		);

		this.config = {
			world: {
				viewport: {
					x: 0,
					y: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				},
				width: 800,
				height: 600,
				tileWidth: 32,
				tileHeight: 32,
				/* IDEA: Incorporate zooming into the game to simulate differently sized models viz. the world tiles */
				zoom: 1.0,
			},
		};

		this.player = {
			entity: PlayerEntity.Spawn({
				physics: {
					x: 3,
					y: 3,
					speed: 0.18,

					model: {
						type: "circle",
						r: 0.5,
					},
				},
				animus: {
					color: "#3AF",
				},
			}),
			input: {
				mask: {},
				x: ~~(window.innerWidth / 2),
				y: ~~(window.innerHeight / 2),
				speed: 9,
			},
			...(args.player ?? {}),
		};

		console.log(this.player)
	}

	resize() {
		this.pixi.resize(window.innerWidth, window.innerHeight);
		this.currentWorld?.refreshViewport();
	}
};

export default RPG;