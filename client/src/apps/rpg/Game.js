import * as PIXI from "pixi.js";

import Game from "../core/Game";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";
import EntitySystem from "./systems/EntitySystem";

import Player from "./entities/Player";

export class RPG extends Game {
	constructor ({ ...args } = {}) {
		super({ ...args });

		this.systems.ArcadeInputSystem = new ArcadeInputSystem({ game: this });
		this.addSystems([
			[ EntitySystem, {} ],
		]);

		this.player = {
			entity: new Player(),
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