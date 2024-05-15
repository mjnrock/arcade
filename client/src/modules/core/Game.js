import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

import KeyboardInput from "./input/Keyboard";
import MouseInput from "./input/Mouse";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";

import Router from "./lib/message/Router";
import System from "./lib/message/System";
import WebSocketBrowserClient from "./lib/ws/WebSocketBrowserClient";
import { nestedMerge } from "./util/nestedMerge";

export const CommonSide = {
	initializeNetworking({ game, args }) {
		game.router = new Router({
			game: game,
			network: null,
			...(args.router ?? {}),
		});
		game.router.network = new WebSocketBrowserClient({
			url: "ws://localhost:8080",
			router: game.router.receive.bind(game.router),
			...(args.network ?? {}),
		});
	},
	initializeGameLoop({ game, args }) {
		game.loop = new GameLoop({
			onTick: game.update.bind(game),
			onDraw: game.render.bind(game),
			fps: 60,
			...(args.loop ?? {}),
		});

		//TODO: This is a good idea, but it throws all sorts of errors when the window is re-focused
        // window.addEventListener("blur", () => game.loop.pause());
        // window.addEventListener("focus", () => game.loop.resume());
	},
	initializeWorlds({ game, args }) {
		game.worlds = new Map();
	},
};

export const ClientSide = {
	initializeGraphics({ game, args }) {
		game.pixi = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			backgroundColor: "#000",
			transparent: true,
			antialias: true,
			powerPreference: "high-performance",

			...(args.pixi ?? {}),
		});

		/*FIXME: _this$pixi.resize is not a function keeps happening a lot on resizes */
		// window.addEventListener("resize", (...args) => game.resize.call(game, ...args));/
	},
	initializeControls({ game, args }) {
		game.input = {
			arcade: {
				joystick: {},
				buttons: {},
			},
			keyboard: new KeyboardInput({
				target: window,
				game: game,
				...(args.input?.keyboard ?? {})
			}),
			mouse: new MouseInput({
				target: window,
				game: game,
				...(args.input?.mouse ?? {}),
			}),
		};

		game.systems = {
			ArcadeInputSystem: new ArcadeInputSystem({ game: game }),
			...(args.systems ?? {}),
		};
	},
};
export const ServerSide = {};

export class Game {
	static IsServer = false;
	static get IsClient() {
		return !this.IsServer;
	}

	constructor ({ ...args } = {}) {
		this.id = uuid();

		this.config = {};

		CommonSide.initializeNetworking({ game: this, args });
		CommonSide.initializeGameLoop({ game: this, args });
		CommonSide.initializeWorlds({ game: this, args });

		if(Game.IsClient) {
			ClientSide.initializeControls({ game: this, args });
			ClientSide.initializeGraphics({ game: this, args });
		}
	}

	resize() {
		this.pixi?.resize(window.innerWidth, window.innerHeight);
	}

	mergeConfig(...partials) {
		partials.forEach(partial => {
			if(typeof partial === "function") {
				partial = partial(this.config);
			} else if(typeof partial !== "object") {
				return;
			}

			this.config = nestedMerge(this.config, partial);
		});

		return this;
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