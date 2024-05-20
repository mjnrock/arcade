import { v4 as uuid } from "uuid";
import { Actionable } from "../Actionable";

export class System extends Actionable {
	/** 
	 * A convenience template "message-to-action" dispatcher, to be used as an Effect listener.
	 * This expects that `Message.data` is an object with the following properties:
	 * - `action`: The action to dispatch
	 * - `payload`: The payload to pass to the action
	 * - `?shouldSpread`: Whether the payload should be spread, or passed as a single argument
	 * 
	 * @param {Message} message The message to process
	 * @returns {any} The result of the dispatched action
	 */
	static ActionMessage(message) {
		const { data } = message;
		const { action, payload, shouldSpread = false } = data;

		if(shouldSpread) {
			return this.dispatch(action, ...payload);
		} else {
			return this.dispatch(action, payload);
		}
	}

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

	static Spawn({ game, ...args } = {}) {
		return new this({ game, ...args });
	}
};

export default System;