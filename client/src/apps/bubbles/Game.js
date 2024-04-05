import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

import KeyboardInput from "./input/Keyboard";
import MouseInput from "./input/Mouse";
// import Arcade from "./input/Arcade";

import BubbleEntity from "./entities/Bubble";
import BubbleComponent from "./components/Bubble";

export class Game {
	constructor ({ fps = 60, ...pixi } = {}) {
		this.id = uuid();

		this.systems = {};

		this.input = {
			keyboard: new KeyboardInput({
				target: window,
				game: this,
			}),
			mouse: new MouseInput({
				target: window,
				game: this,
			}),
			// arcade: new Arcade({ vid: 121, pid: 6 }),	// HID device -- you need to sniff the device first to get the vendorId and productId (e.g. node-hid)
		};

		this.worlds = new Map();

		this.loop = new GameLoop(this.update.bind(this), this.render.bind(this), fps);
		this.pixi = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			...pixi,
		});
	}

	get currentWorld() {
		return this.worlds.get("current");
	}

	addWorld(world) {
		this.worlds.set(world.id, world);

		if(!this.worlds.has("current")) {
			this.worlds.set("current", world);
		}

		return this;
	}

	removeWorld(world) {
		this.worlds.delete(world.id);

		if(this.worlds.get("current") === world) {
			this.worlds.delete("current");
		}

		return this;
	}

	start() {
		this.loop.start();

		if(!this.pixi.view.parentNode) {
			document.body.appendChild(this.pixi.view);
		}
	}

	stop() {
		this.loop.stop();

		if(this.pixi.view.parentNode) {
			this.pixi.view.parentNode.removeChild(this.pixi.view);
		}
		this.pixi.destroy(true, { children: true, texture: true, baseTexture: true });

		this.input.keyboard.detachListeners();
		this.input.mouse.detachListeners();
	}

	update(dt) {
		this.currentWorld?.update({
			game: this,
			dt: dt / 1000,
		});
	}

	render() {
		this.currentWorld?.render({
			game: this,
		});
	}
}

export default Game;