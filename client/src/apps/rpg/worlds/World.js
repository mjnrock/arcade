import AtlasWorld from "../../core/AtlasWorld";
import EnumComponentType from "../components/EnumComponentType";
import { TerrainEntity } from "../entities/TerrainEntity";

/* .dispatch/.run Actions will be called with the World instance as the context */
export const Actions = {
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
		}

		return this;
	},
};

export class World extends AtlasWorld {
	constructor ({ atlas, entities = [], ...args } = {}) {
		super({
			...args,
		});

		this.loadFromAtlas(atlas, TerrainEntity);
		this.addEntity(...entities);
		this.addActions(Actions, { bind: this });
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
					console.log(playerPhysics.x, playerPhysics.y, entity);
					this.dispatch("moveToNearestTerrain", entity);
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
			const g = entity.getComponent(EnumComponentType.Animus).graphics;
			const { x: tx, y: ty } = entity.getComponent(EnumComponentType.Physics);
			const dx = Math.abs(tx - x);
			const dy = Math.abs(ty - y);
			const sight = 2;

			g.x = tx * tw;
			g.y = ty * th;
			
			if(dx < sight && dy < sight) {
				g.visible = true;
			} else {
				g.visible = false;
			}

			entity.render({ game, dt });
		}, { game, dt });

		return this;
	}
};

export default World;