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

	getTerrainAt(x, y) {
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

	update({ game, dt } = {}) {
		super.update({ game, dt });

		this.entityManager.update(({ entity }) => {
			if(entity === game.player.entity) {
				const playerPhysics = entity.getComponent(EnumComponentType.Physics);
				const { x, y } = playerPhysics;

				const terrain = this.getTerrainAt(x, y);
				if(!terrain) return;

				const inverseCost = 1 / terrain.cost;
				playerPhysics.vx *= inverseCost;
				playerPhysics.vy *= inverseCost;

				playerPhysics.applyVelocity({ dt });

				const { x: x2, y: y2 } = playerPhysics;
				const nextTerrain = this.getTerrainAt(x2, y2);
				if(nextTerrain && (nextTerrain.type === "VOID" || nextTerrain.cost === null || nextTerrain.cost === Infinity)) {
					playerPhysics.vx = 0;
					playerPhysics.vy = 0;

					playerPhysics.setPosition({ x, y });
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