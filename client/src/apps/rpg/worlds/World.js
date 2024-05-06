import AtlasWorld from "../../core/AtlasWorld";
import EnumComponentType from "../components/EnumComponentType";
import { TerrainEntity } from "../entities/TerrainEntity";

/* .dispatch/.run Actions will be called with the World instance as the context */
export const Actions = {
	updateVisibility(entity, playerX, playerY, sightRadius) {
		const entityPhysics = entity.getComponent(EnumComponentType.Physics);
		const { x: entityX, y: entityY } = entityPhysics;
		const dx = entityX - playerX;
		const dy = entityY - playerY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		const animus = entity.getComponent(EnumComponentType.Animus);
		animus.graphics.visible = (entity instanceof TerrainEntity) ? true : distance <= sightRadius;
	},

	moveToNearestTerrain(entity) {
		const physics = entity.getComponent(EnumComponentType.Physics);
		const { x, y } = physics;
		const terrain = this.getTerrainAt(x, y);

		if(!terrain) {
			const nearest = this.getNearestTerrain(x, y);
			physics.setPosition({ x: nearest.x, y: nearest.y });
		}
	},

	handlePlayerTerrainInteraction(playerEntity, dt) {
		const physics = playerEntity.getComponent(EnumComponentType.Physics);
		const { x: playerX, y: playerY } = physics;
		if(playerX >= 0 && playerX < this.atlas.map.width && playerY >= 0 && playerY < this.atlas.map.height) {
			const terrain = this.getTerrainAt(playerX, playerY);
			const inverseCost = 1 / terrain.cost;
			physics.vx *= inverseCost;
			physics.vy *= inverseCost;

			physics.applyVelocity({ dt });

			const { x: nextX, y: nextY } = physics;
			const nextTerrain = this.getTerrainAt(nextX, nextY);
			if(nextTerrain && (nextTerrain.type === "VOID" || nextTerrain.cost === null || nextTerrain.cost === Infinity)) {
				physics.vx = 0;
				physics.vy = 0;
				physics.setPosition({ x: playerX, y: playerY });
			}
		} else {
			this.run("moveToNearestTerrain", playerEntity);
		}
	}
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


	/*FIXME: Update/render needs to be broken out for terrain and entities */
	/*NOTE: The visibility is interesting, but it needs to be removed until it's made better */

	update({ game, dt } = {}) {
		super.update({ game, dt });

		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { x: playerX, y: playerY } = playerPhysics;
		const sightRadius = 5;

		this.entityManager.update(({ entity }) => {
			if(entity === game.player.entity) return;

			const physics = entity.getComponent(EnumComponentType.Physics);
			this.run("updateVisibility", entity, playerX, playerY, sightRadius);
			entity.update({ game, dt });

			if(entity instanceof TerrainEntity) return;

			physics.applyVelocity({ dt });
		}, { game, dt });

		this.run("handlePlayerTerrainInteraction", game.player.entity, dt);

		return this;
	}

	render({ game, dt } = {}) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { x, y } = playerPhysics;
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		const px = x * tw;
		const py = y * th;

		this.graphics.width = this.atlas.map.width;
		this.graphics.height = this.atlas.map.height;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		this.graphics.position.set(
			centerX - (px * zoom),
			centerY - (py * zoom)
		);
		this.graphics.scale.set(zoom);

		const sightRadius = 10;

		this.entityManager.render(({ entity }) => {
			const animus = entity.getComponent(EnumComponentType.Animus);
			const { graphics: g, soma } = animus;
			const { x: tx, y: ty } = entity.getComponent(EnumComponentType.Physics);

			if(tx < 0 || ty < 0 || tx >= game.worldWidth || ty >= game.worldHeight) {
				entity.ttl = 0;
				return;
			}

			g.x = tx * tw;
			g.y = ty * th;

			const dx = tx - x;
			const dy = ty - y;
			const distance = Math.sqrt(dx * dx + dy * dy);

			/*FIXME Trivial blocking, this should be handled by the terrain renderer */
			if(distance > sightRadius) {
				soma.visible = false;
			} else {
				soma.visible = true;
				entity.render({ game, dt });
			}
		}, { game, dt });

		return this;
	}

};

export default World;