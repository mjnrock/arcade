import * as PIXI from "pixi.js";
import { v4 as uuid } from "uuid";
import GameLoop from "./GameLoop";

import KeyboardInput from "./input/Keyboard";
import MouseInput from "./input/Mouse";

import BubbleEntity from "./entities/Bubble";
import BubbleComponent from "./components/Bubble";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";

import Router from "./lib/message/Router";
import WebSocketBrowserClient from "./lib/ws/WebSocketBrowserClient";

export class Game {
	constructor ({ fps = 60, ...pixi } = {}) {
		this.id = uuid();

		this.player = {
			input: {
				crosshairGraphic: new PIXI.Graphics(),
				mask: {},
				x: ~~(window.innerWidth / 2),
				y: ~~(window.innerHeight / 2),
			},
		};

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

		this.pixi.stage.addChild(this.player.input.crosshairGraphic);

		const fn = e => {
			if(this.pixi?.renderer?.resize) {
				this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
			} else {
				window.removeEventListener("resize", fn);
			}
		};
		window.addEventListener("resize", fn);
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
		const step = 11;
		if(this.player.input.mask?.joystick?.UP) {
			this.player.input.y -= step;
		}
		if(this.player.input.mask?.joystick?.DOWN) {
			this.player.input.y += step;
		}
		if(this.player.input.mask?.joystick?.LEFT) {
			this.player.input.x -= step;
		}
		if(this.player.input.mask?.joystick?.RIGHT) {
			this.player.input.x += step;
		}

		if(this.player.input.x < 0) {
			this.player.input.x = 0;
		} else if(this.player.input.x > window.innerWidth) {
			this.player.input.x = window.innerWidth;
		}

		if(this.player.input.y < 0) {
			this.player.input.y = 0;
		} else if(this.player.input.y > window.innerHeight) {
			this.player.input.y = window.innerHeight;
		}

		const { buttons } = this.player.input.mask ?? {}
		const { K1, K2, K3, K4, K11, K12 } = buttons ?? {};
		const cursor = this.player.input;
		if(K1 || K2 || K3) {
			const quantity = 1;
			const bubbles = BubbleEntity.Factory(quantity, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 2 + 1),
				},
				components: [
					new BubbleComponent({
						x: cursor.x,
						y: cursor.y,
						vx: (Math.random() - 0.5) * 50,
						vy: (Math.random() - 0.5) * 50,
						r: Math.random() * 10 + 5,
						color: `#ff${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }`,
					}),
				],
			}));

			this.currentWorld?.addEntity(...bubbles);
		}
		if(K4 || K11 || K12) {
			const bubbles = BubbleEntity.Factory(1, () => ({
				meta: {
					ttl: 1000 * (Math.random() * 3),
				},
				components: [
					new BubbleComponent({
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 75,
						vy: (Math.random() - 0.5) * 75,
						r: Math.random() * 50 + 5,
						// color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
						color: `#${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }${ Math.floor(Math.random() * 256).toString(16).padStart(2, "0") }ff`,
					}),
				],
			}));

			this.currentWorld?.addEntity(...bubbles);
		}






		this.currentWorld?.update({
			game: this,
			dt: dt / 1000,
		});
	}

	render() {
		this.player.input.crosshairGraphic.clear();
		this.player.input.crosshairGraphic.lineStyle(2, 0x000000, 1);
		this.player.input.crosshairGraphic.moveTo(this.player.input.x - 10, this.player.input.y);
		this.player.input.crosshairGraphic.lineTo(this.player.input.x + 10, this.player.input.y);
		this.player.input.crosshairGraphic.moveTo(this.player.input.x, this.player.input.y - 10);
		this.player.input.crosshairGraphic.lineTo(this.player.input.x, this.player.input.y + 10);

		this.currentWorld?.render({
			game: this,
		});
	}
}

export default Game;