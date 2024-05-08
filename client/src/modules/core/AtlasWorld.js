import CoreWorld from "./World";
import TerrainEntity from "./entities/TerrainEntity";
import Rectangle from "./lib/geometry/Rectangle";

export class AtlasWorld extends CoreWorld {
	constructor ({ atlas, entities = [], ...args } = {}) {
		super({
			...args,
		});

		this.loadFromAtlas(atlas);
		this.addEntity(...entities);
	}

	get rows() {
		return this.atlas.map.tiles.length;
	}
	get cols() {
		return this.atlas.map.tiles[ 0 ].length;
	}
	get width() {
		return this.atlas.map.width;
	}
	get height() {
		return this.atlas.map.height;
	}

	isInBounds(x, y) {
		return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
	}
	getTileAt(x, y) {
		if(this.isInBounds(x, y)) {
			return this.atlas.map.tiles[ y ][ x ];
		}

		return false;
	}

	loadFromAtlas(atlas, terrainEntityClass = TerrainEntity) {
		if(!atlas) return;

		this.atlas = atlas;

		let { tileWidth: tw, tileHeight: th, zoom } = this.game.config.world;

		for(const col of this.atlas.map.tiles) {
			for(const tile of col) {
				const { x, y, data } = tile;
				const terrain = this.atlas.terrain.terrains[ data ];

				const { texture: color } = terrain;

				this.addEntity(terrainEntityClass.Spawn({
					physics: {
						model: new Rectangle({
							x,
							y,
							width: tw,
							height: th,
						}),
					},
					animus: {
						color,
					},
				}));
			}
		}

		return this;
	}
	async loadFromAtlasFile(uri) {
		const atlas = await fetch(uri).then(response => response.json());

		this.loadFromAtlas(atlas);

		return this;
	}


	getTerrainAt(x, y) {
		if(isNaN(x) || isNaN(y) || x === Infinity || y === Infinity || x === -Infinity || y === -Infinity) {
			return false;
		}

		let ty = ~~y;
		let tx = ~~x;

		try {
			const tile = this.atlas.map.tiles[ ty ][ tx ];
			const terrain = this.atlas.terrain.terrains[ tile.data ];

			return terrain;
		} catch(e) {
			return false;
		}
	}
	resolveTerrain(x, y) {
		const terrain = this.getTerrainAt(x, y);

		if(terrain) {
			if(terrain.type !== "VOID") {
				return {
					x: ~~x,
					y: ~~y,
					...terrain,
				};
			}
		}

		/* Circularly iterating searching tiles from the north clockwise, find the nearest non-VOID terrain */
		const radius = 1;
		const maxRadius = Math.max(this.rows, this.cols);

		for(let r = radius; r < maxRadius; r++) {
			for(let i = 0; i < 4; i++) {
				const dx = r * Math.cos(i * Math.PI / 2);
				const dy = r * Math.sin(i * Math.PI / 2);

				const nx = ~~(x + dx);
				const ny = ~~(y + dy);

				const terrain = this.getTerrainAt(nx, ny);

				if(terrain) {
					if(terrain.type !== "VOID") {
						return {
							x: nx,
							y: ny,
							...terrain,
						};
					}
				}
			}
		}
	}
};

export default AtlasWorld;