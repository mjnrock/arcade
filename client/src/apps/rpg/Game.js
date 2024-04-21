import * as PIXI from "pixi.js";

import Game from "../core/Game";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";
import EntitySystem from "./systems/EntitySystem";

export class RPG extends Game {
	constructor ({ ...args } = {}) {
		super({ ...args });

		this.systems.ArcadeInputSystem = new ArcadeInputSystem({ game: this });
		this.addSystems([
			[ EntitySystem, {} ],
		]);

		this.player = {
			input: {
				crosshairGraphic: new PIXI.Graphics(),
				mask: {},
				x: ~~(window.innerWidth / 2),
				y: ~~(window.innerHeight / 2),
				speed: 9,
			},
			...(args.player ?? {}),
		};

		this.pixi.stage.addChild(this.player.input.crosshairGraphic);
	}


	update(...args) {
		super.update(...args);
	}

	render(...args) {
		super.render(...args);

		this.player.input.crosshairGraphic.clear();
		this.player.input.crosshairGraphic.lineStyle(2, 0x000000, 1);
		this.player.input.crosshairGraphic.moveTo(this.player.input.x - 10, this.player.input.y);
		this.player.input.crosshairGraphic.lineTo(this.player.input.x + 10, this.player.input.y);
		this.player.input.crosshairGraphic.moveTo(this.player.input.x, this.player.input.y - 10);
		this.player.input.crosshairGraphic.lineTo(this.player.input.x, this.player.input.y + 10);
	}
};

export default RPG;