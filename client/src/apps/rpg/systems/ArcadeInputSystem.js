import CoreArcadeInputSystem from "../../core/systems/ArcadeInputSystem";

import { EnumComponentType } from "../../core/components/EnumComponentType";

export class ArcadeInputSystem extends CoreArcadeInputSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		const dtSeconds = dt * 1000;

		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		if(playerPhysics) {
			const speed = playerPhysics.speed * dtSeconds;

			if(game.player.input.mask?.joystick?.UP) {
				playerPhysics.vy = speed * -1;
			} else if(game.player.input.mask?.joystick?.DOWN) {
				playerPhysics.vy = speed;
			} else {
				playerPhysics.vy = 0;
			}

			if(game.player.input.mask?.joystick?.LEFT) {
				playerPhysics.vx = speed * -1;
			} else if(game.player.input.mask?.joystick?.RIGHT) {
				playerPhysics.vx = speed;
			} else {
				playerPhysics.vx = 0;
			}
		}

	}
};

export default ArcadeInputSystem;