import RPGGame from "../../modules/rpg/Game";
import { PlayerEntity } from "../../modules/rpg/entities/PlayerEntity";
import { Circle } from "../../modules/core/lib/geometry/Circle";

import InputSystem from "./systems/InputSystem";
import PhysicsSystem from "./systems/PhysicsSystem";


export class Game extends RPGGame {
	constructor ({ config = {}, ...args } = {}) {
		super({
			...args,
		});

		this.mountSystems(
			InputSystem,
			PhysicsSystem,
		);

		this.mergeConfig({
			ui: {
				showHealth: false,
			},
			world: {
				tileWidth: 32,
				tileHeight: 32,
				zoom: 4,
				viewport: {
					tx: 0,
					ty: 0,
					txr: 25,
					tyr: 25,
				},
			},
		}, config);

		this.player = {
			entity: PlayerEntity.Spawn({
				physics: {
					x: 3,
					y: 3,
					speed: 0.25,	// 0.045

					model: new Circle({
						radius: 0.16,
					}),
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

export default Game;