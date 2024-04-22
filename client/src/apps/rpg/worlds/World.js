import CoreWorld from "../../core/World";

import LivingEntity from "../entities/LivingEntity";

export class World extends CoreWorld {
	constructor ({ width, height, terrain, ...args } = {}) {
		super({
			...args,
		});

		this.width = width;
		this.height = height;
		this.terrain = terrain ?? [];

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
				color: "#00F"
			},
		}));
	}
};

export default World;