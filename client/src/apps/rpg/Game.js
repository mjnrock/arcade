import CoreGame from "../core/Game";

import InputSystem from "./systems/InputSystem";
import PhysicsSystem from "./systems/PhysicsSystem";

import { PlayerEntity } from "./entities/PlayerEntity";

export class RPG extends CoreGame {
	constructor ({ ...args } = {}) {
		super({
			...args,
		});

		this.mountSystems(
			InputSystem,
			PhysicsSystem,
		);

		this.config = {
			ui: {
				showHealth: false,
			},
			world: {
				viewport: {
					tx: 0,
					ty: 0,
					tw: 4,
					th: 4,
				},
				width: 800,
				height: 600,
				tileWidth: 32,
				tileHeight: 32,
				/* IDEA: Incorporate zooming into the game to simulate differently sized models viz. the world tiles */
				zoom: 4,
			},
		};

		this.player = {
			entity: PlayerEntity.Spawn({
				physics: {
					x: 3,
					y: 3,
					speed: 0.25,	// 0.045

					model: {
						type: "circle",
						r: 0.16,
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
	}
};

export default RPG;