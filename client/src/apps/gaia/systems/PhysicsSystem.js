import CorePhysicsSystem from "../../../modules/core/systems/PhysicsSystem";
import { PlayerEntity } from "../../../modules/rpg/entities/PlayerEntity";
import TerrainEntity from "../../../modules/rpg/entities/TerrainEntity";

import EnumComponentType from "../components/EnumComponentType";

export const Actions = {
	moveToNearestTerrain({ game, entity, dt } = {}) {
		const world = game.currentWorld;
		const physics = entity.getComponent(EnumComponentType.Physics);
		const { x, y } = physics;
		const nearest = world.getNearestTerrain(x, y);

		if(x !== nearest.x || y !== nearest.y) {
			console.log(`Player was at ${ x }, ${ y }`)
			console.log(`Moving entity to nearest terrain at ${ nearest.x }, ${ nearest.y }`)
			physics.setPosition({ x: nearest.x, y: nearest.y });
		}
	},
	handleEntityTerrainInteraction({ game, entity, dt } = {}) {
		const physics = entity.getComponent(EnumComponentType.Physics);
		const { x, y } = physics;

		const world = game.currentWorld;
		const terrain = world.getTerrainAt(x, y);
		const { width: atlasWidth, height: atlasHeight } = game.currentWorld.atlas.map;

		/* If the terrain is VOID, move the entity to the nearest terrain */
		if(terrain.type === "VOID") {
			this.run("moveToNearestTerrain", { game, entity, dt });
			return;
		}

		if(x >= 0 && y >= 0 && x < atlasWidth && y < atlasHeight) {
			const inverseCost = 1 / terrain.cost;
			physics.vx *= inverseCost;
			physics.vy *= inverseCost;

			//FIXME
			/**
			 * Currently, this selects "projectiles".  The projectiles appear
			 * to come to a standstill when they hit non-cost=1 terrain.  This
			 * is because of how quickly the inverseCost is applied to the
			 * projectile's velocity.  The fix here is probably to implement a
			 * more robust physics system that considers forces and momentum and
			 * such.  Alternatively, we could just make the projectiles cost=1 or
			 * apply a different cost function to them.
			 * 
			 * IDEA: This is a perfect Action candidate.
			 */
			if(
				!(entity instanceof TerrainEntity)
				&& !(entity instanceof PlayerEntity)
			) {
				// console.log(physics.vx, physics.vy, inverseCost);
			}

			physics.applyVelocity({ dt });

			const { x: nextX, y: nextY } = physics;
			const nextTerrain = world.getTerrainAt(nextX, nextY);

			/* If the *next* terrain is VOID, undo the movement */
			if(nextTerrain?.type === "VOID") {
				/* Kill any projectile that hits the VOID */
				//FIXME: Adjust this to be more robust once a "ProjectileEntity" is implemented
				if(!(entity instanceof TerrainEntity) && !(entity instanceof PlayerEntity)) {
					entity.meta.ttl = 0;
				}

				physics.vx = 0;
				physics.vy = 0;
				physics.setPosition({ x: x, y: y });
			}
		} else {
			this.run("moveToNearestTerrain", { game, entity, dt });
		}
	}
};

export class PhysicsSystem extends CorePhysicsSystem {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
	}

	update({ game, dt } = {}) {
		for(const entity of game.currentWorld.entityManager.cached) {
			entity.update({ game, dt });

			if(entity instanceof TerrainEntity) continue;

			this.run("handleEntityTerrainInteraction", { game, entity, dt });
		}

	}
	render({ game, dt } = {}) {
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		const cache = game.currentWorld.entityManager.cached;
		for(const entity of cache) {
			const animus = entity.getComponent(EnumComponentType.Animus);
			const { graphics: g } = animus;
			const { x: tx, y: ty } = entity.getComponent(EnumComponentType.Physics);

			g.x = tx * tw;
			g.y = ty * th;

			entity.render({ game, dt });

			g.visible = true;
		}

		const difference = game.currentWorld.entityManager.difference(cache);
		for(const entity of difference) {
			const animus = entity.getComponent(EnumComponentType.Animus);
			const { graphics: g } = animus;

			g.visible = false;
		}
	}
}

export default PhysicsSystem;