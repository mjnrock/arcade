import CoreSystem from "../../core/lib/message/System";

import { EnumComponentType } from "../components/EnumComponentType";
import LivingEntity from "../entities/LivingEntity";

export class InputSystem extends CoreSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		const dtSeconds = dt * 1000;

		const compPlayerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		if(compPlayerPhysics) {
			/* Map controller inputs into player physics state */
			const normalizedSpeed = compPlayerPhysics.speed * dtSeconds;
			if(game.player.input.mask?.joystick?.UP || game.input.keyboard?.hasFlag("UP")) {
				compPlayerPhysics.vy = normalizedSpeed * -1;
				compPlayerPhysics.facing = 0;
			} else if(game.player.input.mask?.joystick?.DOWN || game.input.keyboard?.hasFlag("DOWN")) {
				compPlayerPhysics.vy = normalizedSpeed;
				compPlayerPhysics.facing = 180;
			} else {
				compPlayerPhysics.vy = 0;
			}
			if(game.player.input.mask?.joystick?.LEFT || game.input.keyboard?.hasFlag("LEFT")) {
				compPlayerPhysics.vx = normalizedSpeed * -1;
				compPlayerPhysics.facing = 270;
			} else if(game.player.input.mask?.joystick?.RIGHT || game.input.keyboard?.hasFlag("RIGHT")) {
				compPlayerPhysics.vx = normalizedSpeed;
				compPlayerPhysics.facing = 90;
			} else {
				compPlayerPhysics.vx = 0;
			}

			/* Simulate automatic firing */
			if(game.input.keyboard.has("Space")) {
				let vx = 0,
					vy = 0,
					projSpeed = 250;

				if(compPlayerPhysics.facing === 0) {
					vy = projSpeed * -1;
				} else if(compPlayerPhysics.facing === 90) {
					vx = projSpeed;
				} else if(compPlayerPhysics.facing === 180) {
					vy = projSpeed;
				} else if(compPlayerPhysics.facing === 270) {
					vx = projSpeed * -1;
				}

				const entProjectile = LivingEntity.Spawn({
					meta: {
						ttl: 750,
					},
					physics: {
						x: compPlayerPhysics.x,
						y: compPlayerPhysics.y,
						facing: compPlayerPhysics.facing,
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

				game.currentWorld.addEntity(entProjectile);
			}
		}
	}
};

export default InputSystem;