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
			backgroundColor: "#fff",
			antialias: true,
			...(args.pixi ?? {}),
		});

		console.log(this.pixi.stage.x, this.pixi.stage.y, this.pixi.stage.width, this.pixi.stage.height)

		window.addEventListener("resize", this.resize.bind(this));
	}

	resize() {
		this.pixi.resize(window.innerWidth, window.innerHeight);
		this.currentWorld?.refreshViewport();
	}

	/**
	 * If @systemClass is an instance of System, it will be mounted as-is.
	 * Otherwise, it will be instantiated with @args and mounted.
	 * In either case, the name of the constructor will be used as the key.
	 */
	mountSystem(systemClass, args = {}) {
		if(systemClass instanceof System) {
			this.systems[ systemClass.constructor ] = systemClass;
		} else {
			this.systems[ systemClass ] = new systemClass({ game: this, ...args });
		}

		return this;
	}
	mountSystems(...systems) {
		for(let entry of systems) {
			if(entry instanceof System) {
				this.mountSystem(entry);
				continue;
			} else if(!Array.isArray(entry)) {
				entry = [ entry ];
			}

			const [ system, args ] = entry;
			this.mountSystem(system, args);
		}

		return this;
	}
	unmountSystem(systemClass) {
		if(systemClass instanceof System) {
			delete this.systems[ systemClass.constructor ];
		} else {
			delete this.systems[ systemClass ];
		}

		return this;
	}
	unmountSystems(systems = []) {
		for(const system of systems) {
			this.unmountSystem(system);
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