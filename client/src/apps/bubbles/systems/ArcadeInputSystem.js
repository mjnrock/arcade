import System from "../../core/lib/message/System";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}

	input({ data, message } = {}) {
		const { buttons, joystick } = data;
		const { K1, K2, K3, K4, K11, K12, SE, ST } = buttons;
		const { UP, DOWN, LEFT, RIGHT } = joystick;

		const cursor = this.game.player.input;

		if(ST) {
			this.game.player.input.x = ~~(Math.random() * window.innerWidth);
			this.game.player.input.y = ~~(Math.random() * window.innerHeight);
		}

		this.game.player.input.mask = data;
	}
};

export default ArcadeInputSystem;