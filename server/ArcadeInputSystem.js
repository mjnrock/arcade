import Message from "./lib/message/Message.js";
import System from "./lib/message/System.js";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.game.input.arcade.addListener(({ state }) => {
			this.input({ data: state });
		})
	}

	input(message) {
		this.sendToNetwork(Message.Message({
			type: [ "ArcadeInputSystem", "input" ],
			data: message.data,
		}));
	}
};

export default ArcadeInputSystem;