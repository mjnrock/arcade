import CoreSystem from "../../../modules/core/lib/message/System";
import { Circle } from "../../../modules/core/lib/geometry/Circle";
import AnimateEntity from "../../../modules/rpg/entities/AnimateEntity";

import EnumComponentType from "../components/EnumComponentType";
import { EnumFacing, FacingMatrix } from "../components/EnumFacing";
import ActionDamage from "../abilities/ActionDamage";
import AbilityEntity from "../../../modules/rpg/entities/AbilityEntity";

export class InputSystem extends CoreSystem {
	constructor ({ game } = {}) {
		super({ game });

		game.input.mouse.target.addEventListener("wheel", e => {
			game.config.world.zoom += Math.sign(e.deltaY) * (game.config.world.zoom * -0.05);
			game.config.world.zoom = Math.min(Math.max(0.1, game.config.world.zoom), 33);
		});
		game.input.keyboard.target.addEventListener("keypress", e => {
			/* Randomly teleport the player */
			if(e.code === "KeyQ") {
				const physics = game.player.entity.getComponent(EnumComponentType.Physics);
				physics.x = ~~(Math.random() * game.currentWorld.cols);
				physics.y = ~~(Math.random() * game.currentWorld.rows);

				console.log(`Teleported player to ${ physics.x }, ${ physics.y }`)
			}

			//FIXME: Debug only
			if(e.code === "F5") {
				window.location.reload();
			}

			if(e.code === "Digit1") {
				game.config.world.zoom = 1;
			}
			if(e.code === "Digit2") {
				game.config.world.zoom = 2;
			}
			if(e.code === "Digit3") {
				game.config.world.zoom = 4;
			}
			if(e.code === "Digit4") {
				game.config.world.zoom = 8;
			}

			/* Toggle health bar */
			if(e.code === "KeyV") {
				game.config.ui.health.showBar = !game.config.ui.health.showBar;
			}
		});
	}

	update({ game, dt } = {}) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { speed } = playerPhysics;

		if(playerPhysics) {
			/* Map controller inputs into player physics state */
			if(game.input.arcade?.joystick?.LEFT || game.input.keyboard?.hasFlag("LEFT")) {
				playerPhysics.vx = speed * -1;
				playerPhysics.facing = EnumFacing.WEST;
			} else if(game.input.arcade?.joystick?.RIGHT || game.input.keyboard?.hasFlag("RIGHT")) {
				playerPhysics.vx = speed;
				playerPhysics.facing = EnumFacing.EAST;
			} else {
				playerPhysics.vx = 0;
			}
			if(game.input.arcade?.joystick?.UP || game.input.keyboard?.hasFlag("UP")) {
				playerPhysics.vy = speed * -1;
				playerPhysics.facing = EnumFacing.NORTH;
			} else if(game.input.arcade?.joystick?.DOWN || game.input.keyboard?.hasFlag("DOWN")) {
				playerPhysics.vy = speed;
				playerPhysics.facing = EnumFacing.SOUTH;
			} else {
				playerPhysics.vy = 0;
			}

			/* Calculate diagonal facings, if any */
			if(playerPhysics.vx && playerPhysics.vy) {
				if(playerPhysics.vx > 0 && playerPhysics.vy < 0) {
					playerPhysics.facing = EnumFacing.NORTH_EAST;  // Right and Up
				} else if(playerPhysics.vx > 0 && playerPhysics.vy > 0) {
					playerPhysics.facing = EnumFacing.SOUTH_EAST;  // Right and Down
				} else if(playerPhysics.vx < 0 && playerPhysics.vy < 0) {
					playerPhysics.facing = EnumFacing.NORTH_WEST;  // Left and Up
				} else if(playerPhysics.vx < 0 && playerPhysics.vy > 0) {
					playerPhysics.facing = EnumFacing.SOUTH_WEST;  // Left and Down
				}
			}

			if(game.input.keyboard.has("Backquote")) {
				const health = game.player.entity.getComponent(EnumComponentType.Health);
				health.fill();
			}

			/* Simulate automatic firing */
			if(game.input.arcade?.buttons?.K1 || game.input.keyboard.has("Space")) {
				//* ABILITY TESTING */
				const playerAbilities = game.player.entity.getComponent(EnumComponentType.Abilities);

				/* Get direction vector based on the current facing from the matrix */
				let direction = FacingMatrix[ playerPhysics.facing ] || [ 0, 0 ];

				let projSpeed = 12.5;
				let vx = direction[ 0 ] * projSpeed;
				let vy = direction[ 1 ] * projSpeed;

				/* Spawn a projectile */
				const entProjectile = AbilityEntity.Spawn({
					ability: playerAbilities.getAbility("melee"),
					source: game.player.entity,
					meta: {
						ttl: 1500,
					},
					physics: {
						facing: playerPhysics.facing,
						vx,
						vy,

						speed: projSpeed,
						model: new Circle({
							x: playerPhysics.x,
							y: playerPhysics.y,
							radius: Math.random() > 0.33 ? 0.25 : 0.5,
						}),
					},
					animus: {
						color: "rgba(64, 64, 228, 0.25)",
					},
				});

				/* Add the projectile to the world */
				game.currentWorld.addEntity(entProjectile);
			}
		}
	}
};

export default InputSystem;