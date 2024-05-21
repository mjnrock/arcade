import { v4 as uuid } from "uuid";

export class System {
	constructor ({ game } = {}) {
		this.id = uuid();
		this.game = game;
	}

	/* Centralized access to the game's router for easy refactoring */
	get router() {
		return this.game.router;
	}

	receive(message) {
		const [ to, type ] = message.type;

		if(typeof this[ type ] === "function") {
			return this[ type ](message);
		}
	}

	send(message) {
		this.router.route(message);
	}
	sendToNetwork(message) {
		this.router.send(message);
	}
};

export default System;