import { v4 as uuid } from "uuid";
import { Envelope } from "./Envelope.js";
import { Serializer } from "./Serializer.js";

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
		try {
			const [ to ] = message.type;
			const system = this.systems[ to ];

			system.receive(message);
		} catch(e) {
			console.log("Invalid message sent to router");
			console.log(message);
			console.log(e);
		}
	}

	send(message) {
		const envelope = Envelope({ message });

		this.network.send(Serializer.Envelope.serialize(envelope));
	}
	receive(envelope) {
		const { message } = Serializer.Envelope.deserialize(envelope);

		this.route(message);
	}
};

export default Router;