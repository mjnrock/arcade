import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

import KeyboardInput from "./input/Keyboard";
import MouseInput from "./input/Mouse";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";

import Router from "./lib/message/Router";
import WebSocketBrowserClient from "./lib/ws/WebSocketBrowserClient";
import Message from "./lib/message/Message";

export class Game {
	constructor ({ fps = 60, ...pixi } = {}) {
		this.id = uuid();

		this.router = new Router({
			game: this,
			network: null,
		});
		this.router.network = new WebSocketBrowserClient({
			url: "ws://localhost:8080",
			router: this.router.receive.bind(this.router),
		});
		this.systems = {
			ArcadeInputSystem: new ArcadeInputSystem({ game: this }),
		};

		setTimeout(() => {
			this.router.send(Message.Message({
				type: [ "TestSystem", "test" ],
				data: {
					now: Date.now(),
				},
			}));
		}, 1000);

		this.input = {
			keyboard: new KeyboardInput({
				target: window,
				game: this,
			}),
			mouse: new MouseInput({
				target: window,
				game: this,
			}),
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