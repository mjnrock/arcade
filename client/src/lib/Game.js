import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

export class Game {
	constructor ({ fps = 60 } = {}) {
		this.id = uuid();
		this.worlds = new Map();
		this.gameLoop = new GameLoop(this.update.bind(this), this.render.bind(this), fps);

		this.pixi = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
		});
	}

	addWorld(world) {
		this.worlds.set(world.id, world);

		return this;
	}

	removeWorld(world) {
		this.worlds.delete(world.id);
		return this;
	}

	start() {
		this.gameLoop.start();
	}

	stop() {
		this.gameLoop.stop();
		if(this.pixi.view.parentNode) {
			this.pixi.view.parentNode.removeChild(this.pixi.view);
		}
		this.pixi.destroy(true, { children: true, texture: true, baseTexture: true });
	}

	update(dt) {
		this.worlds.forEach(world => world?.update({
			game: this,
			dt: dt / 1000,
		}));
	}

	render() {
		this.worlds.forEach(world => world?.render({
			game: this,
		}));
	}
}

export default Game;