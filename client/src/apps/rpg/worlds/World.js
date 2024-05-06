import AtlasWorld from "../../core/AtlasWorld";
import EnumComponentType from "../components/EnumComponentType";
import { TerrainEntity } from "../entities/TerrainEntity";

export class World extends AtlasWorld {
	constructor ({ atlas, entities = [], ...args } = {}) {
		super({
			...args,
		});

		this.loadFromAtlas(atlas, TerrainEntity);
		this.addEntity(...entities);
	}

	update({ game, dt } = {}) {
		super.update({ game, dt });

		const { viewport } = game.config.world;
		let { tx, ty, tw, th } = viewport;

		/* get the player's physics component */
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		/* make the viewport track the player */
		tx = playerPhysics.x;
		ty = playerPhysics.y;

		const filteredEntities = [];
		for(const entity of game.currentWorld.entityManager) {
			const physics = entity.getComponent(EnumComponentType.Physics);
			const { x, y } = physics;

			/* Kill any entities that are out of bounds */
			if(x < 0 || y < 0 || x >= this.atlas.map.width || y >= this.atlas.map.height) {
				entity.ttl = 0;
				continue;
			}

			/* check if the entity is within the viewport, treating tw and th as "rectangular radii" */
			if(x >= tx - tw && x <= tx + tw && y >= ty - th && y <= ty + th) {
				filteredEntities.push(entity);
			}
		}

		/* set the cache to the filtered entities, so that .render can use it */
		game.currentWorld.entityManager.writeCache(filteredEntities);
	}

	render({ game, dt } = {}) {
		/* center the viewport on the player, scaling with zoom */
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { x, y } = playerPhysics;
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		/* translate to pixel space */
		const ppx = x * tw;
		const ppy = y * th;

		//? Not sure if this is necessary
		// this.graphics.width = this.atlas.map.width;
		// this.graphics.height = this.atlas.map.height;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		/* center the Graphic on the player */
		this.graphics.position.set(
			centerX - (ppx * zoom),
			centerY - (ppy * zoom)
		);
		/* scale the Graphic */
		this.graphics.scale.set(zoom);

		return this;
	}

};

export default World;