import * as PIXI from "pixi.js";

import Game from "../core/Game";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";
import EntitySystem from "./systems/EntitySystem";

import Player from "./entities/Player";
import PlayerComponent from "./components/Player";

export class RPG extends Game {
	constructor ({ ...args } = {}) {
		super({ ...args });

		this.systems.ArcadeInputSystem = new ArcadeInputSystem({ game: this });
		this.addSystems([
			[ EntitySystem, {} ],
		]);

		this.player = {
			entity: new Player({
				components: [
					new PlayerComponent({
						x: 0.5 * window.innerWidth,
						y: 0.5 * window.innerHeight,
						vx: (Math.random() - 0.5) * 200,
						vy: (Math.random() - 0.5) * 200,
						model: {
							r: Math.random() * 20 + 5,
						},
						color: `#000`,
					}),
				],
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


	update(...args) {
		super.update(...args);
	}

	render(...args) {
		super.render(...args);
	}
};

export default RPG;