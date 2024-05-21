import { Identity } from "../../../modules/core/lib/Identity";

/**
 * @class Action
 * An Action should never be executed directly.  Instead, it should be
 * executed by an Ability.  The Ability will pass in the necessary
 * arguments to the Action and handle Entity-specific logic, like
 * selecting targets, etc.
 */
export class Action extends Identity {
	constructor ({ action } = {}) {
		super();

		if(action) {
			this.action = action;
		}

		if(typeof this.action !== "function") {
			throw new Error("Action requires a trigger function");
		}
	}

	setAction(action) {
		if(typeof action !== "function") {
			return false;
		}

		this.action = action;

		return this;
	}

	/* NOTE: While this does not directly explicate arguments, a working data model should exist when using Actions (e.g. source, target, etc.) */
	exec({ dt, game, ...args } = {}) {
		return this.action({ dt, game, ...args })
	}
};

export default Action;