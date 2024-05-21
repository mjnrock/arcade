import { Message } from "../../../modules/core/lib/message/Message";
import CoreSystem from "../../../modules/core/lib/message/System";

import EnumComponentType from "../components/EnumComponentType";
import EnumResourceType from "../components/EnumResourceType";
import { EnumFacing, FacingMatrix } from "../components/EnumFacing";
import EnumAbility from "../abilities/EnumAbility"

/* NOTE: Apparently keypress doesn't capture F-keys, so keydown with repeat check */
export const KeyDownHandler = ({ game }) => (e) => {
	//DEBUG: Development controls
	if(e.code === "F5") {
		window.location.reload();
	} else if(e.code === "F12") {
		//NOOP: Allow console access by not preventing default
	} else {
		/* Outside of meta controls, prevent default behavior */
		e.preventDefault();
	}

	/* Put anything above this that needs to respect key holding */
	if(e.repeat) return;

	/* Randomly teleport the player */
	if(e.code === "KeyQ") {
		const physics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { facing } = physics;
		let distance = 2;

		// Move the player in the direction they're facing
		physics.x += FacingMatrix[ facing ][ 0 ] * distance;
		physics.y += FacingMatrix[ facing ][ 1 ] * distance;

		console.log(`Teleported player to ${ physics.x }, ${ physics.y }`)
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

	/* Toggle arcade mode */
	if(e.code === "F8" && e.ctrlKey) {
		game.config.settings.arcadeMode = !game.config.settings.arcadeMode;
		console.log(`Arcade mode is now ${ game.config.settings.arcadeMode ? "enabled" : "disabled" }`);
	}
};

export class InputSystem extends CoreSystem {
	constructor ({ game } = {}) {
		super({ game });

		game.input.mouse.target.addEventListener("wheel", e => {
			game.config.world.zoom += Math.sign(e.deltaY) * (game.config.world.zoom * -0.05);
			game.config.world.zoom = Math.min(Math.max(0.1, game.config.world.zoom), 33);
		});

		document.addEventListener("keydown", KeyDownHandler({ game }));
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

		return facing;
	}


	update({ game, dt }) {
		const playerPhysics = game.player.entity.getComponent(EnumComponentType.Physics);
		const { speed } = playerPhysics;

		if(playerPhysics) {
			/* Map controller inputs into player physics state */
			playerPhysics.vx = this.hasLeft() ? -speed : this.hasRight() ? speed : 0;
			playerPhysics.vy = this.hasUp() ? -speed : this.hasDown() ? speed : 0;

			/* Since there's no mouse, we'll use the joystick to determine facing */
			if(game.config.settings.arcadeMode) {
				playerPhysics.facing = this.manageArcadeFacing(playerPhysics.facing);
			}

			if(game.input.keyboard.has("Backquote")) {
				const health = game.player.entity.getComponent(EnumResourceType.Health);
				health.fill();
			}

			if(game.input.arcade?.buttons?.K1 || game.input.keyboard.has("Space") || game.input.mouse.has("RIGHT")) {
				this.router.route(Message({
					type: [ "AbilitySystem", "castAbility" ],
					data: {
						name: EnumAbility.EnergyBall,
						source: game.player.entity,
						game,
						entityArgs: {
							meta: {
								ttl: 1500,
							},
							physics: {
								facing: playerPhysics.facing,
								x: playerPhysics.x,
								y: playerPhysics.y,
								vx: FacingMatrix[ playerPhysics.facing ][ 0 ] * 12.5,
								vy: FacingMatrix[ playerPhysics.facing ][ 1 ] * 12.5,
							},
							animus: {
								color: "rgba(176, 64, 228, 0.25)",
							},
						},
					},
				}));
			}
			if(game.input.mouse.has("LEFT")) {
				this.router.route(Message({
					type: [ "AbilitySystem", "castAbility" ],
					data: {
						name: EnumAbility.HolyNova,
						source: game.player.entity,
						game,
						entityArgs: {
							meta: {
								ttl: 25,
							},
							physics: {
								facing: playerPhysics.facing,
								x: playerPhysics.x,
								y: playerPhysics.y,
							},
							animus: {
								color: "rgba(176, 176, 228, 0.25)",
							},
						},
					},
				}));
			}
		}
	}

	render({ dt, game }) {
		if(!game.config.settings.arcadeMode) {
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
	}

};

export default InputSystem;