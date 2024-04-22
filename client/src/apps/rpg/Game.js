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

		this.player = {
			entity: LivingEntity.Spawn({
				physics: {
					x: 0.5 * window.innerWidth,
					y: 0.5 * window.innerHeight,
					speed: 5,

					model: {
						type: "circle",
						r: Math.random() * 20 + 5,
					},
				},
				animus: {
					color: "#000",
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