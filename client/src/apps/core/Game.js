import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

import KeyboardInput from "./input/Keyboard";
import MouseInput from "./input/Mouse";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";

import Router from "./lib/message/Router";
import System from "./lib/message/System";
import WebSocketBrowserClient from "./lib/ws/WebSocketBrowserClient";


export class Game {
	constructor ({ ...args } = {}) {
		this.id = uuid();

		this.router = new Router({
			game: this,
			network: null,
			...(args.router ?? {}),
		});
		this.router.network = new WebSocketBrowserClient({
			url: "ws://localhost:8080",
			router: this.router.receive.bind(this.router),
			...(args.network ?? {}),
		});
		this.systems = {
			ArcadeInputSystem: new ArcadeInputSystem({ game: this }),
			...(args.systems ?? {}),
		};

		this.input = {
			arcade: {
				joystick: {},
				buttons: {},
			},
			keyboard: new KeyboardInput({
				target: window,
				game: this,
				...(args.input?.keyboard ?? {})
			}),
			mouse: new MouseInput({
				target: window,
				game: this,
				...(args.input?.mouse ?? {}),
			}),
		};

		this.worlds = new Map();

		this.loop = new GameLoop({
			onTick: this.update.bind(this),
			onDraw: this.render.bind(this),
			fps: 60,
			...(args.loop ?? {}),
		});
		this.pixi = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: 0x1099bb,
			...(args.pixi ?? {}),
		});

		const fn = e => {
			if(this.pixi?.renderer?.resize) {
				this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
			} else {
				window.removeEventListener("resize", fn);
			}
		};
		window.addEventListener("resize", fn);
	}

	addSystem(systemClass, args = {}) {
		if(systemClass instanceof System) {
			this.systems[ systemClass.constructor ] = systemClass;
		} else {
			this.systems[ systemClass ] = new systemClass({ game: this, ...args });
		}

		return this;
	}
	addSystems(systems = []) {
		for(const [ system, args = {} ] of systems) {
			this.addSystem(system, args);
		}

		return this;
	}
	removeSystem(systemClass) {
		if(systemClass instanceof System) {
			delete this.systems[ systemClass.constructor ];
		} else {
			delete this.systems[ systemClass ];
		}

		return this;
	}
	removeSystems(systems = []) {
		for(const system of systems) {
			this.removeSystem(system);
		}

		return this;
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
		const args = {
			game: this,
			dt: dt / 1000,
		};

		for(const system of Object.values(this.systems)) {
			system.update(args);
		}

		this.currentWorld?.update(args);
	}

	render(dt, ip) {
		const args = {
			game: this,
			dt: dt / 1000,
			ip,
		};

		for(const system of Object.values(this.systems)) {
			system.render(args);
		}

		this.currentWorld?.render(args);
	}
}

export default Game;