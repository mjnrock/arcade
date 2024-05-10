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
				health: {
					showBar: true,
					thresholds: [
						[ 0.8, "#005500" ],
						[ 0.65, "#50AA50" ],
						[ 0.3, "#CCCC33" ],
						[ 0, "#FF5555" ],
					],
				}
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
					speed: 4,
					model: new Circle({
						x: 0,
						y: 8,
						radius: 0.16,
					}),
				},
				animus: {
					color: "#3AF",
				},
			}),
			input: {
				mask: {},
			},
			...(args.player ?? {}),
		};
	}
};

export default Game;