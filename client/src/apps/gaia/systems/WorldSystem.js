import System from "../../../modules/core/lib/message/System";

import EnumComponentType from "../components/EnumComponentType";
import EnumResourceType from "../components/EnumResourceType";

export const Actions = {};
export const Receivers = {
	joinWorld(message) {
		const { entity, game } = message.data;

		game.currentWorld.addEntity(entity);
	},
	leaveWorld(message) {
		const { entity, game } = message.data;

		game.currentWorld.removeEntity(entity);
	},
};

export class WorldSystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}

	update({ dt, game }) {
		const { viewport } = game.config.world;

		/* get the player's physics component */
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);

		/* make the viewport track the player */
		viewport.tx = playerPhysics.x;
		viewport.ty = playerPhysics.y;

		const { tx, ty, txr, tyr } = viewport;
		const filteredEntities = [];
		for(const entity of game.currentWorld.entityManager) {
			const physics = entity.getComponent(EnumComponentType.Physics);
			const { x, y } = physics;

			const health = entity.getComponent(EnumResourceType.Health);
			if(health?.isEmpty) {
				this.removeEntity(entity);
				continue;
			}

			/* check if the entity is within the viewport, treating tw and th as "rectangular radii" */
			if(x >= tx - txr && x <= tx + txr && y >= ty - tyr && y <= ty + tyr) {
				filteredEntities.push(entity);
			}
		}

		/* set the cache to the filtered entities, so that .render can use it */
		game.currentWorld.entityManager.writeCache(filteredEntities);

		/* update the current world */
		game.currentWorld?.update({ dt, game });
	}

	render({ dt, game }) {
		/* center the viewport on the player, scaling with zoom */
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { x, y } = playerPhysics;
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		/* translate to pixel space */
		const ppx = x * tw;
		const ppy = y * th;

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;

		/* center the Graphic on the player */
		game.currentWorld?.graphics.position.set(
			~~(centerX - (ppx * zoom)),
			~~(centerY - (ppy * zoom))
		);

		/* scale the Graphic */
		game.currentWorld?.graphics.scale.set(zoom);

		game.currentWorld?.render({ dt, game });
	}
};

export default WorldSystem;