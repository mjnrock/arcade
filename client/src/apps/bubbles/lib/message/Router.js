import { v4 as uuid } from "uuid";
import { Envelope } from "./Envelope.js";

export class Router {
	constructor ({ game, network } = {}) {
		this.id = uuid();
		this.game = game;

		/* Either the client or the server facilitation class */
		this.network = network;
	}

	/* Centralized access to the game's systems for easy refactoring */
	get systems() {
		return this.game.systems;
	}

	route(message) {
		for(const name in this.systems) {
			const system = this.systems[ name ];
			const [ to ] = message.type;

			if(name === to || system.id === to) {
				return system.receive(message);
			}
		}
	}

	send(message) {
		const envelope = Envelope({ message });

		this.network.send(envelope);
	}
	receive(envelope) {
		const { message } = envelope;

		this.route(message);
	}
};

export default Router;