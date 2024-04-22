import CoreSystem from "../../core/lib/message/System";

import { EnumComponentType } from "../components/EnumComponentType";

export class InputSystem extends CoreSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		const dtSeconds = dt * 1000;

		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		if(playerPhysics) {
			const speed = playerPhysics.speed * dtSeconds;

			if(game.player.input.mask?.joystick?.UP || game.input.keyboard?.hasFlag("UP")) {
				playerPhysics.vy = speed * -1;
			} else if(game.player.input.mask?.joystick?.DOWN || game.input.keyboard?.hasFlag("DOWN")) {
				playerPhysics.vy = speed;
			} else {
				playerPhysics.vy = 0;
			}

			if(game.player.input.mask?.joystick?.LEFT || game.input.keyboard?.hasFlag("LEFT")) {
				playerPhysics.vx = speed * -1;
			} else if(game.player.input.mask?.joystick?.RIGHT || game.input.keyboard?.hasFlag("RIGHT")) {
				playerPhysics.vx = speed;
			} else {
				playerPhysics.vx = 0;
			}
		}

	}
};

export default InputSystem;