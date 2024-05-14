import CoreSystem from "../../../modules/core/lib/message/System";
import { Circle } from "../../../modules/core/lib/geometry/Circle";

import EnumComponentType from "../components/EnumComponentType";
import { EnumFacing, FacingMatrix } from "../components/EnumFacing";
import EnumResourceType from "../../../modules/rpg/components/EnumResourceType";
import AbilityEntity from "../../../modules/rpg/entities/AbilityEntity";
import EnumAbility from "../abilities/EnumAbility";

export const hasDirection = (input, direction) => input.arcade?.joystick?.[ direction ] || input.keyboard?.hasFlag(direction);
export const hasUp = input => hasDirection(input, "UP");
export const hasDown = input => hasDirection(input, "DOWN");
export const hasLeft = input => hasDirection(input, "LEFT");
export const hasRight = input => hasDirection(input, "RIGHT");

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
				game.config.ui[ EnumResourceType.Health ].showBar = !game.config.ui[ EnumResourceType.Health ].showBar;
				game.config.ui[ EnumResourceType.Mana ].showBar = !game.config.ui[ EnumResourceType.Mana ].showBar;
			}
		});
	}

	// Helper functions for directional checks
	hasDirection(input, direction) {
		return input.arcade?.joystick?.[ direction ] || input.keyboard?.hasFlag(direction);
	}
	hasUp() { return this.hasDirection(this.game.input, "UP"); }
	hasDown() { return this.hasDirection(this.game.input, "DOWN"); }
	hasLeft() { return this.hasDirection(this.game.input, "LEFT"); }
	hasRight() { return this.hasDirection(this.game.input, "RIGHT"); }
	manageArcadeFacing(facing) {
		const left = this.hasLeft();
		const right = this.hasRight();
		const up = this.hasUp();
		const down = this.hasDown();

		if(left && up) {
			return EnumFacing.NORTH_WEST;
		} else if(right && up) {
			return EnumFacing.NORTH_EAST;
		} else if(left && down) {
			return EnumFacing.SOUTH_WEST;
		} else if(right && down) {
			return EnumFacing.SOUTH_EAST;
		} else if(left) {
			return EnumFacing.WEST;
		} else if(right) {
			return EnumFacing.EAST;
		} else if(up) {
			return EnumFacing.NORTH;
		} else if(down) {
			return EnumFacing.SOUTH;
		}

		return EnumFacing.NORTH;
	}


	update({ game, dt }) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { speed } = playerPhysics;

		if(playerPhysics) {
			/* Map controller inputs into player physics state */
			playerPhysics.vx = this.hasLeft() ? -speed : this.hasRight() ? speed : 0;
			playerPhysics.vy = this.hasUp() ? -speed : this.hasDown() ? speed : 0;

			/* Since there's no mouse, we'll use the joystick to determine facing */
			if(game.config.arcadeMode) {
				playerPhysics.facing = this.manageArcadeFacing(playerPhysics.facing);
			}

			if(game.input.keyboard.has("Backquote")) {
				const health = game.player.entity.getComponent(EnumComponentType.Health);
				health.fill();
			}

			/* Simulate automatic firing */
			if(game.input.arcade?.buttons?.K1 || game.input.keyboard.has("Space") || game.input.mouse.has("RIGHT")) {
				//* ABILITY TESTING */
				const playerAbilities = game.player.entity.getComponent(EnumComponentType.Abilities);

				/* Get direction vector based on the current facing from the matrix */
				let direction = FacingMatrix[ playerPhysics.facing ] || [ 0, 0 ];

				let projSpeed = 12.5;
				let vx = direction[ 0 ] * projSpeed;
				let vy = direction[ 1 ] * projSpeed;

				/* Spawn a projectile */
				const entProjectile = AbilityEntity.Spawn({
					ability: playerAbilities.getAbility(EnumAbility.DeathRay),
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
						color: "rgba(176, 64, 228, 0.25)",
					},
				});

				/* Add the projectile to the world */
				game.currentWorld.addEntity(entProjectile);
			}
		}
	}

	render({ dt, game }) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);

		const centerX = window.innerWidth / 2;
		const centerY = window.innerHeight / 2;
		const mouseX = game.input.mouse.x;
		const mouseY = game.input.mouse.y;

		const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
		const angleDegrees = ((angle * 180 / Math.PI) - 90 + 540) % 360;
		const angle45 = Math.round(angleDegrees / 45) * 45 % 360;

		playerPhysics.facing = angle45;
	}

};

export default InputSystem;