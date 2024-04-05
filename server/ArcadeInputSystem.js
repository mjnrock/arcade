import Message from "./lib/message/Message.js";
import System from "./lib/message/System.js";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.game.input.arcade.addListener(({ state }) => {
			this.button({ data: state });
		})
	}

	button({ data, message } = {}) {
		this.sendToNetwork(Message.Message({
			type: [ "ArcadeInputSystem", "button" ],
			data,
		}));
	}
};

export default ArcadeInputSystem;