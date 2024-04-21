import CoreArcadeInputSystem from "../../core/systems/ArcadeInputSystem";

export class ArcadeInputSystem extends CoreArcadeInputSystem {
	constructor ({ game } = {}) {
		super({ game });
	}
	update({ game, dt } = {}) {
		const step = game.player.input.speed;
		if(game.player.input.mask?.joystick?.UP) {
			game.player.input.y -= step;
		}
		if(game.player.input.mask?.joystick?.DOWN) {
			game.player.input.y += step;
		}
		if(game.player.input.mask?.joystick?.LEFT) {
			game.player.input.x -= step;
		}
		if(game.player.input.mask?.joystick?.RIGHT) {
			game.player.input.x += step;
		}

		if(game.player.input.x < 0) {
			game.player.input.x = 0;
		} else if(game.player.input.x > window.innerWidth) {
			game.player.input.x = window.innerWidth;
		}

		if(game.player.input.y < 0) {
			game.player.input.y = 0;
		} else if(game.player.input.y > window.innerHeight) {
			game.player.input.y = window.innerHeight;
		}

		const { buttons } = game.player.input.mask ?? {}
		const { K1, K2, K3, K4, K11, K12 } = buttons ?? {};
		const cursor = game.player.input;
	}
};

export default ArcadeInputSystem;