import Game from "../core/Game";

import InputSystem from "./systems/InputSystem";
import EntitySystem from "./systems/EntitySystem";

import LivingEntity from "./entities/LivingEntity";

export class RPG extends Game {
	constructor ({ ...args } = {}) {
		super({ ...args });

		this.systems.InputSystem = new InputSystem({ game: this });
		this.addSystems([
			[ EntitySystem, {} ],
		]);

		this.player = {
			entity: new LivingEntity({
				physics: {
					x: Math.random() * window.innerWidth,
					y: Math.random() * window.innerHeight,
					speed: 5,

					model: {
						type: "circle",
						r: Math.random() * 20 + 5,
					},
				},
				animus: {},
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