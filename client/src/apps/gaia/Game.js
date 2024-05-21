import CoreGame from "../../modules/core/Game";
import { Circle } from "../../modules/core/lib/geometry/Circle";

import InputSystem from "./systems/InputSystem";
import PhysicsSystem from "./systems/PhysicsSystem";
import AbilitySystem from "./systems/AbilitySystem";
import WorldSystem from "./systems/WorldSystem";
import { PlayerEntity } from "./entities/PlayerEntity";

import BasicWizard from "./data/entities/templates/BasicWizard";
import EntitySystem from "./systems/EntitySystem";

import Config from "./game.config";


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
			EntitySystem,
		);

		this.mergeConfig(Config, config);

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