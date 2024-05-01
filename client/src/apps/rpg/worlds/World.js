import CoreWorld from "../../core/World";
import EnumComponentType from "../components/EnumComponentType";
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

	loadFromAtlas(atlas) {
		this.atlas = atlas;

		let { tileWidth: tw, tileHeight: th, zoom } = this.game.config.world;
		tw *= zoom;
		th *= zoom;

		for(const col of this.atlas.map.tiles) {
			for(const tile of col) {
				const { x, y, data } = tile;
				const terrain = this.atlas.terrain.terrains[ data ];

				const { texture: color } = terrain;

				this.addEntity(TerrainEntity.Spawn({
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

	update({ game, dt } = {}) {
		super.update({ game, dt });

		this.entityManager.update(({ entity }) => {
			if(entity === game.player.entity) {
				const playerPhysics = entity.getComponent(EnumComponentType.Physics);
				const { x: x0, y: y0 } = playerPhysics;

				if(x0 >= 0 && x0 < this.atlas.map.width && y0 >= 0 && y0 < this.atlas.map.height) {
					const terrain = this.getTerrainAt(x0, y0);

					const inverseCost = 1 / terrain.cost;
					playerPhysics.vx *= inverseCost;
					playerPhysics.vy *= inverseCost;

					playerPhysics.applyVelocity({ dt });

					const { x: x1, y: y1 } = playerPhysics;
					const nextTerrain = this.getTerrainAt(x1, y1);
					if(nextTerrain && (nextTerrain.type === "VOID" || nextTerrain.cost === null || nextTerrain.cost === Infinity)) {
						playerPhysics.vx = 0;
						playerPhysics.vy = 0;

						/* Undo the velocity update */
						playerPhysics.setPosition({ x: x0, y: y0 });
					}
				} else {
					this.moveToNearestTerrain(entity);
					console.log(entity)
				}
			}

			entity.update({ game, dt });
		}, { game, dt });

		for(const entity of this.entityManager) {
			if(entity.isDead) {
				this.removeEntity(entity);
			}
		}

		return this;
	}

	render({ game, dt } = {}) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { x, y } = playerPhysics;
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		const px = x * tw;
		const py = y * th;
		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		this.graphics.scale.set(zoom);
		this.graphics.position.set(
			centerX - (px * zoom),
			centerY - (py * zoom)
		);

		this.entityManager.render(({ entity }) => {
			let { x: tx, y: ty, model } = entity.getComponent(EnumComponentType.Physics);

			const g = entity.getComponent(EnumComponentType.Animus).graphics;
			const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

			// const { x: px, y: py } = playerPhysics;
			// const dx = Math.abs(tx - px);
			// const dy = Math.abs(ty - py);

			// if(dx <= 5 || dy <= 5) {
			// 	g.visible = true;
			// } else {
			// 	g.visible = false;
			// }

			g.x = tx * tw;
			g.y = ty * th;

			entity.render({ game, dt });
		}, { game, dt });

		return this;
	}

};

export default World;