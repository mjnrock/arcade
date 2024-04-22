import CoreWorld from "../../core/World";

import LivingEntity from "../entities/LivingEntity";

export class World extends CoreWorld {
	constructor ({ width = 10, height = 10, terrain, ...args } = {}) {
		super({
			...args,
		});

		this.width = width;
		this.height = height;
		this.terrain = terrain ?? [];

		/* generate a width by height matrix of terrain, evenly randomized between green and blue */
		let tw = (this.terrain?.[ 0 ]?.length || 1) / this.width * window.innerWidth,
			th = (this.terrain?.length || 1) / this.height * window.innerHeight;
		for(let x = 0; x < this.width; x++) {
			this.terrain[ x ] = [];
			for(let y = 0; y < this.height; y++) {
				this.terrain[ x ][ y ] = Math.random() > 0.5 ? "#007BA7 " : "#4CBB17 ";

				this.addEntity(LivingEntity.Spawn({
					physics: {
						x: x * tw,
						y: y * th,
						vx: 0,
						vy: 0,

						model: {
							type: "rect",
							w: tw,
							h: th,
						},
					},
					animus: {
						color: this.terrain[ x ][ y ],
					},
				}));
			}
		}

		this.addEntity(LivingEntity.Spawn({
			physics: {
				x: Math.random() * window.innerWidth,
				y: Math.random() * window.innerHeight,
				vx: Math.random() * 250 - 5,
				vy: Math.random() * 250 - 5,

				model: {
					type: "circle",
					r: Math.random() * 20 + 5,
				},
			},
			animus: {
				color: "#00F",
			},
		}));
	}
};

export default World;