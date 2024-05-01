import CoreWorld from "./World";
import EnumComponentType from "./components/EnumComponentType";

export class AtlasWorld extends CoreWorld {
	constructor ({ atlas, entities = [], ...args } = {}) {
		super({
			...args,
		});

		if(atlas) {
			this.loadFromAtlas(atlas);
		}

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
	};

	loadFromAtlas(atlas, entityClass) {
		this.atlas = atlas;

		let { tileWidth: tw, tileHeight: th, zoom } = this.game.config.world;
		tw *= zoom;
		th *= zoom;

		for(const col of this.atlas.map.tiles) {
			for(const tile of col) {
				const { x, y, data } = tile;
				const terrain = this.atlas.terrain.terrains[ data ];

				const { texture: color } = terrain;

				this.addEntity(entityClass.Spawn({
					physics: {
						x,
						y,
						model: {
							w: tw,
							h: th,
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

	async loadFromAtlasFile(uri) {
		const atlas = await fetch(uri).then(response => response.json());

		this.loadFromAtlas(atlas);

		return this;
	}

	//IDEA: This is a perfect action candidate
	getNearestTerrain(x, y) {
		const terrain = this.getTerrainAt(x, y);

		if(terrain) {
			return terrain;
		} else {
			/* iterate through this.atlas.map.tiles[ ty ][ tx ] to find the first non-VOID terrain */
			for(let y = 0; y < this.atlas.map.tiles.length; y++) {
				for(let x = 0; x < this.atlas.map.tiles[ y ].length; x++) {
					const terrain = this.getTerrainAt(x, y);

					if(terrain && terrain.type !== "VOID") {
						return { x, y };
					}
				}
			}
		}
	}

	//IDEA: This is a perfect action candidate
	moveToNearestTerrain(entity) {
		const physics = entity.getComponent(EnumComponentType.Physics);
		const { x, y } = physics;
		const terrain = this.getTerrainAt(x, y);

		if(!terrain) {
			const nearest = this.getNearestTerrain(x, y);

			physics.setPosition({
				x: nearest.x,
				y: nearest.y,
			});

			return this.moveToNearestTerrain(entity);
		}

		return this;
	}
};

export default AtlasWorld;