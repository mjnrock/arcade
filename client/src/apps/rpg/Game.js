import Game from "../core/Game";

import InputSystem from "./systems/InputSystem";
import EntitySystem from "./systems/EntitySystem";

import LivingEntity from "./entities/LivingEntity";

export class RPG extends Game {
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
				width: 800,
				height: 600,
				tileWidth: 32,
				tileHeight: 32,
				/* IDEA: Incorporate zooming into the game to simulate differently sized models viz. the world tiles */
				zoom: 1.0,
			},
		};

		this.player = {
			entity: LivingEntity.Spawn({
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
};

export default RPG;