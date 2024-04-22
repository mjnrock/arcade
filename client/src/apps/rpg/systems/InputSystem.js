import CoreSystem from "../../core/lib/message/System";

import { EnumComponentType } from "../components/EnumComponentType";
import LivingEntity from "../entities/LivingEntity";

export class InputSystem extends CoreSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		const dtSeconds = dt * 1000;

		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		if(playerPhysics) {
			/* Map controller inputs into player physics state */
			const normalizedSpeed = playerPhysics.speed * dtSeconds;
			if(game.player.input.mask?.joystick?.UP || game.input.keyboard?.hasFlag("UP")) {
				playerPhysics.vy = normalizedSpeed * -1;
				playerPhysics.facing = 0;
			} else if(game.player.input.mask?.joystick?.DOWN || game.input.keyboard?.hasFlag("DOWN")) {
				playerPhysics.vy = normalizedSpeed;
				playerPhysics.facing = 180;
			} else {
				playerPhysics.vy = 0;
			}
			if(game.player.input.mask?.joystick?.LEFT || game.input.keyboard?.hasFlag("LEFT")) {
				playerPhysics.vx = normalizedSpeed * -1;
				playerPhysics.facing = 270;
			} else if(game.player.input.mask?.joystick?.RIGHT || game.input.keyboard?.hasFlag("RIGHT")) {
				playerPhysics.vx = normalizedSpeed;
				playerPhysics.facing = 90;
			} else {
				playerPhysics.vx = 0;
			}

			/* Simulate automatic firing */
			if(game.input.keyboard.has("Space")) {
				let vx = 0,
					vy = 0,
					projSpeed = 250;

				if(playerPhysics.facing === 0) {
					vy = projSpeed * -1;
				} else if(playerPhysics.facing === 90) {
					vx = projSpeed;
				} else if(playerPhysics.facing === 180) {
					vy = projSpeed;
				} else if(playerPhysics.facing === 270) {
					vx = projSpeed * -1;
				}

				const projectile = new LivingEntity({
					meta: {
						ttl: 750,
					},
					physics: {
						x: playerPhysics.x,
						y: playerPhysics.y,
						facing: playerPhysics.facing,
						vx,
						vy,

						model: {
							type: "circle",
							r: 5,
						},
					},
					animus: {
						color: 0x000,
					},
				});

				game.currentWorld.addEntity(projectile);
			}
		}
	}
};

export default InputSystem;