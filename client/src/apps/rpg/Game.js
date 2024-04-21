import Game from "../core/Game";

import ArcadeInputSystem from "./systems/ArcadeInputSystem";
import EntitySystem from "./systems/EntitySystem";

import PhysicsComponent from "../core/components/Physics";
import AnimusComponent from "../core/components/Animus";

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
					PhysicsComponent.Factory({
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 200,
						vy: (Math.random() - 0.5) * 200,
						model: {
							r: Math.random() * 20 + 5,
						},
					}),
					AnimusComponent.Factory({
						color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
						render({ entity, g = this.graphics } = {}) {
							const { x, y, model } = entity.getComponent(PhysicsComponent);

							g.clear();
							g.lineStyle(1, this.color, 0.5);
							g.beginFill(this.color, 0.3);
							g.drawCircle(x, y, model.r);
							g.endFill();

							return g;
						},
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