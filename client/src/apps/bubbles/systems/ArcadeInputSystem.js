import System from "../lib/message/System.js";

export class ArcadeInputSystem extends System {
	constructor ({ game } = {}) {
		super({ game });
	}

	button({ data, message } = {}) {
		console.log(data);
		console.log(message);
	}
};

export default ArcadeInputSystem;