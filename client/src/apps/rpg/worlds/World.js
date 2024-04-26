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

		const tile = this.atlas.map.tiles[ ty ][ tx ];
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

	update({ game, dt } = {}) {
		this.entityManager.update(({ entity }) => {
			if(entity === game.player.entity) {
				const playerPhysics = entity.getComponent(EnumComponentType.Physics);
				const { x, y } = playerPhysics;

				const terrain = this.getTerrainAt(x, y);
				const { type } = terrain;

				if(type === "VOID") {
					game.player.entity.getComponent(EnumComponentType.Animus).graphics.tint = 0x0000ff;

					const dampeningFactor = 0.25; // Dampening factor to reduce velocity
					playerPhysics.vx *= dampeningFactor;
					playerPhysics.vy *= dampeningFactor;
				} else {
					game.player.entity.getComponent(EnumComponentType.Animus).graphics.tint = 0xffffff;
				}

				playerPhysics.applyVelocity({ dt });
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
		this.refreshViewport({ game, dt });

		const { viewport } = game.config.world;
		
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		viewport.x = playerPhysics.x * game.config.world.tileWidth;
		viewport.y = playerPhysics.y * game.config.world.tileHeight;

		this.entityManager.render(({ entity }) => {
			const g = entity.getComponent(EnumComponentType.Animus).graphics;

			let { x: tx, y: ty, model } = entity.getComponent(EnumComponentType.Physics);
			const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

			let px = tx * tw;
			let py = ty * th;

			if(entity === game.player.entity) {
				g.x = viewport.width / 2;
				g.y = viewport.height / 2;
				if(Math.random() < 0.01) console.log(viewport)
			} else {
				/* offset all other entities so that player is center screen */
				g.x = px - viewport.x + viewport.width / 2;
				g.y = py - viewport.y + viewport.height / 2;
			}

			entity.render({ game, dt });
		}, { game, dt });

		return this;
	}
};

export default World;