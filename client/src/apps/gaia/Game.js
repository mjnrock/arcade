import CoreGame from "../../modules/core/Game";
import { Circle } from "../../modules/core/lib/geometry/Circle";
import EnumResourceType from "./components/EnumResourceType";

import InputSystem from "./systems/InputSystem";
import PhysicsSystem from "./systems/PhysicsSystem";
import AbilitySystem from "./systems/AbilitySystem";
import WorldSystem from "./systems/WorldSystem";
import { PlayerEntity } from "./entities/PlayerEntity";

import BasicWizard from "./data/entities/templates/BasicWizard";


export class Game extends CoreGame {
	constructor ({ config = {}, ...args } = {}) {
		super({
			...args,
		});

		this.mountSystems(
			InputSystem,
			PhysicsSystem,
			AbilitySystem,
			WorldSystem,
		);

		this.mergeConfig({
			/* If enabled, locks facing to the joystick direction */
			arcadeMode: false,
			/* Difficulty level, as a scaling factor */
			difficulty: 1,
			/* UI configuration for resources */
			ui: {
				[ EnumResourceType.Health ]: {
					showBar: true,
					thresholds: [
						[ 0.8, "#306630" ],
						[ 0.65, "#339933" ],
						[ 0.35, "#FFCC33" ],
						[ 0.15, "#FF9933" ],
						[ 0, "#FF5555" ],
					],
					ox: 0,
					oy: -5,
					width: 24,
					height: 6,
				},
				[ EnumResourceType.Mana ]: {
					showBar: true,
					thresholds: [
						[ 0.75, "#333366" ],
						[ 0.5, "#555588" ],
						[ 0.25, "#9999CC" ],
						[ 0, "#CCCCFF" ],
					],
					ox: 0,
					oy: -2,
					width: 20,
					height: 3,
				},
			},
			/* World tile configuration */
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
				components: BasicWizard.Components(),
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