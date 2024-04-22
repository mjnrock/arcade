import CoreWorld from "../../core/World";

import LivingEntity from "../entities/LivingEntity";

export class World extends CoreWorld {
	constructor ({ atlas, entities, ...args } = {}) {
		super({
			...args,
		});

		if(atlas) {
			this.loadFromAtlas(atlas);
		}

		this.addEntity(...entities);
	}

	getTerrainAt(x, y) {
		const tile = this.atlas.map.tiles[ y ][ x ];
		const terrain = this.atlas.terrain.terrains[ tile.data ];

		return terrain;
	};

	loadFromAtlas(atlas) {
		this.atlas = atlas;

		for(const col of this.atlas.map.tiles) {
			for(const tile of col) {
				const { x, y, data } = tile;
				const terrain = this.atlas.terrain.terrains[ data ];

				const { texture: color } = terrain;

				this.addEntity(LivingEntity.Spawn({
					physics: {
						x: x * 32,
						y: y * 32,
						vx: 0,
						vy: 0,

						model: {
							type: "rect",
							w: 32,
							h: 32,
						},
					},
					animus: {
						color,
					},
				}));
			}
		}

		return this;
	};

	async loadFromAtlasFile(filepath) {
		const atlas = await fetch(filepath).then(response => response.json());

		this.loadFromAtlas(atlas);

		return this;
	}
};

export default World;