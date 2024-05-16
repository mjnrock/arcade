import System from "../../core/lib/message/System";

/**
 * Since this client-side input system is a receiver of data from the server,
 * we basically just use this as a passthrough to the game state, using the
 * server data as the source of truth.  Once running, just refer to the generated
 * mask for querying the state of the controller.
 */
export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}

	/**
	 * This data is sent from the Server, processed through the System message
	 * routing, and then sent to the Client. The Client then processes the arcade
	 * input data and updates the game state accordingly.  As such, the controller
	 * data actually "gets into the game" through this method.
	 */
	input(message) {
		/* Commented here to show values that map to the USB controller hardware pins and their names */
		// const { buttons, joystick } = data;
		// const { K1, K2, K3, K4, K11, K12, SE, ST } = buttons;
		// const { UP, DOWN, LEFT, RIGHT } = joystick;

		/* Pump the server state directly into the client state */
		this.game.input.arcade = message.data;

		const { buttons, joystick } = message.data;
		return {
			...buttons,
			...joystick,
		};
	}

	update({ game, dt } = {}) { }
};

export default ArcadeInputSystem;