import { v4 as uuid } from "uuid";
import { Actionable } from "../Actionable";

export class System extends Actionable {
	constructor ({ game, ...actionable } = {}) {
		super({ ...actionable });

		this.id = uuid();
		this.game = game;
	}

	addReceiver(fn) {
		this[ fn.name ] = fn.bind(this);

		return this;
	}
	addReceivers(fns) {
		if(Array.isArray(fns)) {
			fns.forEach(fn => this.addReceiver(fn));
		} else if(typeof fns === "object") {
			for(const key in fns) {
				this.addReceiver(fns[ key ]);
			}
		}

		return this;
	}
	removeReceiver(fn) {
		delete this[ fn.name ];

		return this;
	}
	removeReceivers(fns) {
		fns.forEach(fn => this.removeReceiver(fn));

		return this;
	}

	update({ game, dt } = {}) { }
	render({ game, dt } = {}) { }

	/* Centralized access to the game's router for easy refactoring */
	get router() {
		return this.game.router;
	}

	receive(message) {
		const { data } = message;
		const [ to, type ] = message.type;

		if(typeof this[ type ] === "function") {
			return this[ type ]({ data, message });
		}
	}

	send(message) {
		this.router.route(message);
	}
	sendToNetwork(message) {
		this.router.send(message);
	}

	static Spawn({ game, ...args } = {}) {
		return new this({ game, ...args });
	}
};

export default System;