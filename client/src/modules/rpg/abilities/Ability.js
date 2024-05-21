import * as PIXI from "pixi.js";

import { Identity } from "../../core/lib/Identity";
import Geometry from "../../core/lib/geometry/Geometry";
import Resource from "../../core/components/Resource";

import Cooldown from "../components/Cooldown";
import Action from "./Action";

/* Self is synonymous with the Source here, as its Entity-level by this point is use */
export const Selectors = {
	Self: (entities = [], source) => [ source ],
	All: (entities = [], source) => entities,
	AllButSelf: (entities = [], source) => entities.filter(entity => entity !== source),
};

/**
 * @class Ability
 * The general idea of an Ability is that a Geometric .model is
 * used to create a hitbox.  When the hitbox is triggered, a
 * series of .actions are executed upon any entities that are
 * within the hitbox.
 */
export class Ability extends Identity {
	static Selectors = Selectors;

	constructor ({ name, model, cost, actions = [], cooldown = 1000, selector } = {}) {
		super();

		/* A unique identifier for the Ability */
		this.name = name;

		/* A Geometry to describe the area of effect */
		this.model = model;

		/* An ordered list of repeatable-actions to execute when the ability is triggered */
		this.actions = [];
		this.addAction(...actions);

		/* The cost(s) to use the ability */
		this.setCost(cost);

		/* The cooldown status of the ability.  This should be managed through overriding this default instance. */
		this.cooldown = new Cooldown({
			current: cooldown,
			max: cooldown,
		});

		/* A function to select the targets of the ability */
		if(typeof selector === "function") {
			this.selector = selector;
		}

		this.lastResults = [];

		this.graphics = new PIXI.Graphics();
	}

	get isReady() {
		return this.cooldown.isFull === true;
	}

	selector(entities = [], source) {
		return entities;
	}

	setModel(model) {
		if(!(model instanceof Geometry)) {
			throw new Error("Ability .model must be an instance of Geometry");
		}

		this.model = model;
		return this;
	}

	setCost(cost) {
		if(Array.isArray(cost)) {
			this.cost = [
				...cost,
			];
		} else {
			this.cost = [
				cost,
			];
		}

		return this;
	}
	pay(resources = {}) {
		if(!this.isReady) {
			return false;
		}

		for(const [ type, amount ] of this.cost) {
			const resource = resources[ type ];
			if(resource instanceof Resource) {
				if(!resource.check(amount)) {
					return false;
				}
			} else {
				return false;
			}
		}

		for(const [ type, amount ] of this.cost) {
			const resource = resources[ type ];
			resource.sub(amount);
		}

		/* Drain the cooldown */
		this.cooldown.drain();

		return true;
	}

	addAction(...actions) {
		for(const action of actions) {
			if(action instanceof Action) {
				this.actions.push(action);
			} else if(typeof action === "object") {
				this.actions.push(new Action(action));
			} else if(typeof action === "function") {
				this.actions.push(new Action({ action }));
			}
		}

		return this;
	}

	/**
	 * Collision detection should happen elsewhere using the .model and passed in.
	 */
	exec(collidedEntities = [], { dt, game, source, ...args } = {}) {
		const targets = this.selector.call(this, collidedEntities, source);

		const results = [];
		for(const action of this.actions) {
			results.push(action.exec.call(action, { dt, game, targets, source, ...args, ability: this }));
		}

		this.lastResults = Array.from(results);

		return results;
	}

	copy({ ...props } = {}) {
		return new Ability({
			name: this.name,
			model: this.model,
			actions: this.actions,
			cost: this.cost,
			selector: this.selector,
			...props,
		});
	}

	update({ game, dt, entity } = {}) {
		this.cooldown.update({ game, dt, entity });
	}
	render({ game, dt, g = this.graphics, entity, i } = {}) {
		this.cooldown.render({ game, dt, entity, i });

		return g;
	}
};

export default Ability;