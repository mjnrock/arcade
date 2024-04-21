import CoreArcadeInputSystem from "../../core/systems/ArcadeInputSystem";
import PlayerComponent from "../components/Player";

export class ArcadeInputSystem extends CoreArcadeInputSystem {
	constructor ({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		const dtSeconds = dt / 1000;
		const playerPhysics = game.player.entity.getComponent(PlayerComponent);

		if(playerPhysics) {
			const speed = playerPhysics.speed * dtSeconds;

			if(game.player.input.mask?.joystick?.UP) {
				playerPhysics.setVelocity({
					vy: speed * -1,
				});
			} else if(game.player.input.mask?.joystick?.DOWN) {
				playerPhysics.setVelocity({
					vy: speed,
				});
			} else {
				playerPhysics.setVelocity({
					vy: 0,
				});
			}

			if(game.player.input.mask?.joystick?.LEFT) {
				playerPhysics.setVelocity({
					vx: speed * -1,
				});
			} else if(game.player.input.mask?.joystick?.RIGHT) {
				playerPhysics.setVelocity({
					vx: speed,
				});
			} else {
				playerPhysics.setVelocity({
					vx: 0,
				});
			}
		}

	}
};

export default ArcadeInputSystem;