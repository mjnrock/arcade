import CoreWorld from "../../core/World";
import { TerrainEntity } from "../entities/TerrainEntity";

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
		console.log(atlas);

		this.atlas = atlas;

		// let { tw: atlasTw, th: atlasTh } = this.atlas.map;
		let { tileWidth: tw, tileHeight: th, zoom } = this.game.config.world;
		tw *= zoom;
		th *= zoom;

		for(const col of this.atlas.map.tiles) {
			for(const tile of col) {
				const { x, y, data } = tile;
				const terrain = this.atlas.terrain.terrains[ data ];

				const { texture: color } = terrain;

				this.addEntity(TerrainEntity.Spawn({
					x,
					y,
					tw,
					th,
					color,
				}));
			}
		}

		return this;
	};

	async loadFromAtlasFile(uri) {
		const atlas = await fetch(uri).then(response => response.json());

		this.loadFromAtlas(atlas);

		return this;
	}
};

export default World;