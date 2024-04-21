import System from "../../core/lib/message/System";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}

	input({ data, message } = {}) {
		/* Commented here to show values that map to the USB controller hardware pins and their names */
		// const { buttons, joystick } = data;
		// const { K1, K2, K3, K4, K11, K12, SE, ST } = buttons;
		// const { UP, DOWN, LEFT, RIGHT } = joystick;

		this.game.player.input.mask = data;

		const { buttons, joystick } = data;
		return {
			...buttons,
			...joystick,
		};
	}

	update({ game, dt } = {}) { }
};

export default ArcadeInputSystem;