import Geometry from "../../core/lib/geometry/Geometry";
import Action from "./Action";

/**
 * @class Ability
 * The general idea of an Ability is that a Geometric .model is
 * used to create a hitbox.  When the hitbox is triggered, a
 * series of .actions are executed upon any entities that are
 * within the hitbox.
 */
export class Ability {
	constructor ({ name, model } = {}) {
		/* A unique identifier for the Ability */
		this.name = name;

		/* A Geometry to describe the area of effect */
		this.model = model;

		/* An ordered list of repeatable-actions to execute when the ability is triggered */
		this.actions = [];
	}

	setModel(model) {
		if(!(model instanceof Geometry)) {
			throw new Error("Ability .model must be an instance of Geometry");
		}

		this.model = model;
		return this;
	}

	addAction(...actions) {
		for(const action of actions) {
			if(action instanceof Action) {
				this.actions.push(action);
			} else if(typeof action === "function") {
				this.actions.push(new Action({ action }));
			}
		}

		return this;
	}

	//TODO: Decide on to handle things like: source, target, trigger, etc.
	exec({ dt, game, ...args } = {}) {
		const results = [];
		for(const action of this.actions) {
			results.push(action.exec({ dt, game, ...args, ability: this }));
		}

		return results;
	}
};

export default Ability;