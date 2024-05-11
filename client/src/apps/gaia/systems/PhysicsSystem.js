import chalk from "chalk";

import CorePhysicsSystem from "../../../modules/core/systems/PhysicsSystem";
import TerrainEntity from "../../../modules/rpg/entities/TerrainEntity";

import EnumComponentType from "../components/EnumComponentType";
import { PlayerEntity } from "../entities/PlayerEntity";

import CollisionHelper from "../../../modules/core/lib/geometry/CollisionHelper";
import AbilityEntity from "../../../modules/rpg/entities/AbilityEntity";

export const Actions = {
	/**
	 * BUG: Because of the circular calculation from north, coupled with
	 * a tick's worth of applied velocity, you can exploit being out of
	 * bounds and adjacent VOID tiles to "teleport" to the another tile.
	 * 
	 * NOTE: ./appendix/map-edge-exploit-a.bug.png
	 * NOTE: ./appendix/map-edge-exploit-b.bug.png
	 */
	moveToNearestTerrain({ game, entity, dt } = {}) {
		const world = game.currentWorld;
		const physics = entity.getComponent(EnumComponentType.Physics);
		const { x, y, vx, vy } = physics;

		/* First check if the entity is within the bounds of the world, but on a VOID tile */
		const currentTerrain = world.getTerrainAt(x, y);
		if(currentTerrain.type === "VOID") {
			const terrain = world.resolveTerrain(x, y);
			physics.x = terrain.x;
			physics.y = terrain.y;

			return;
		}

		/* Assume the character is out of bounds, and move it to the nearest terrain */
		const nextX = x + vx * dt;
		const nextY = y + vy * dt;
		const nextTerrain = world.resolveTerrain(nextX, nextY);

		/* Calculate the reflection point on the terrain */
		const dx = nextX - nextTerrain.x;
		const dy = nextY - nextTerrain.y;

		/* Reflect the position based on the incoming direction */
		physics.x = Math.max(Math.min(nextTerrain.x + dx, world.atlas.map.columns), 0);
		physics.y = Math.max(Math.min(nextTerrain.y + dy, world.atlas.map.rows), 0);

		// Optionally, reflect the velocity if the terrain is meant to reflect motion
		// This part depends on whether the terrain should reflect entities or just stop them
		physics.vx = -vx;
		physics.vy = -vy;
	},

	handleEntityTerrainCollision({ game, entity, dt } = {}) {
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

			if(Math.abs(physics.vx) < 0.01) physics.vx = 0;
			if(Math.abs(physics.vy) < 0.01) physics.vy = 0;

			const { x: nextX, y: nextY } = physics;
			const nextTerrain = world.getTerrainAt(nextX, nextY);

			/* If the *next* terrain is VOID or OOB, undo the movement */
			if(nextTerrain?.type === "VOID" || !world.isInBounds(nextX, nextY)) {
				//FIXME: Adjust this to be more robust once a "ProjectileEntity" is implemented
				/* Kill any projectile that hits the VOID */
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
	},
	handleCollisions({ game, dt } = {}) {
		const { quadTree } = game.currentWorld;
		const checkedPairs = new Set();

		const returnObjects = [];
		for(const entity of game.currentWorld.entityManager.cached) {
			if(entity instanceof TerrainEntity) continue;

			quadTree.retrieve(returnObjects, entity);
			for(const other of returnObjects) {
				if(other === entity) continue;
				if(checkedPairs.has(`${ Math.min(entity.id, other.id) }-${ Math.max(entity.id, other.id) }`)) continue;
				/* Prevent Abilities from colliding to dramatically reduce the number of collision checks */
				if(entity instanceof AbilityEntity && other instanceof AbilityEntity) continue;

				const shape1 = entity.getComponent(EnumComponentType.Physics).model;
				const shape2 = other.getComponent(EnumComponentType.Physics).model;

				if(CollisionHelper.collide(shape1, shape2)) {
					checkedPairs.add(`${ Math.min(entity.id, other.id) }-${ Math.max(entity.id, other.id) }`);

					//NOTE: I'm not sure where the bug is, but this only triggers when you're *not* holding Spacebar
					if(
						(entity instanceof PlayerEntity && other instanceof AbilityEntity && other.source !== entity)
						|| (other instanceof PlayerEntity && entity instanceof AbilityEntity && entity.source !== other)
					) {
						console.log(chalk.blue("Ability Collision") + ":", entity, other);
					}
					//STUB: Test is the thing hit the other test PlayerEntity
					if(entity instanceof PlayerEntity || other instanceof PlayerEntity) {
						if(entity.source !== game.player.entity && other.source !== game.player.entity) {
							console.log(chalk.red("Player Collision") + ":", entity, other);
						}
					}
				}
			}

			/* Clear the array without creating a new one */
			returnObjects.length = 0;
		}
	},
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

			this.run("handleEntityTerrainCollision", { game, entity, dt });
		}

		this.run("handleCollisions", { game, dt });

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