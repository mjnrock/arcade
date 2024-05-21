/**
 * Actions are extension methods that can be used
 * when you need to either queue the execution of
 * said action, or when you need to emit side effects.
 * Accordingly, Actionable is a class that allows you
 * to quickly setup this functionality.  The action
 * system does not use the queue by default; it is
 * meant to be used, as needed, by the developer.
 */
export class Actionable {
	constructor ({ actions = {}, effects = [] } = {}) {
		this.queue = [];
		this.actions = new Map();
		this.effects = new Map();

		this.addActions(actions);
		this.addEffects(...effects);
	}

	enqueue(action, ...args) {
		this.queue.push([ action, ...args ]);
	}
	dequeue() {
		return this.queue.shift();
	}

	process({ ...args } = {}) {
		while(this.queue.length) {
			const [ action, ...vargs ] = this.dequeue();
			this.dispatch(action, { ...vargs, ...args });
		}
	}
	async processAsync({ ...args } = {}) {
		while(this.queue.length) {
			const [ action, ...vargs ] = this.dequeue();
			await this.dispatchAsync(action, { ...vargs, ...args });
		}
	}


	/**
	 * Run an action without emitting any effects
	 */
	run(action, ...args) {
		const fn = this.actions.get(action);
		if(fn) {
			const result = fn.call(this, ...args);

			return result;
		}

		return;
	}
	async runAsync(action, ...args) {
		const fn = this.actions.get(action);
		if(fn) {
			const result = await fn.call(this, ...args);

			return result;
		}

		return;
	}

	/**
	 * Dispatch an action and emit any effects
	 */
	dispatch(action, ...args) {
		const fn = this.actions.get(action);
		if(fn) {
			const result = fn.call(this, ...args);

			this.emit(action, result);

			return result;
		}

		return;
	}
	async dispatchAsync(action, ...args) {
		const fn = this.actions.get(action);
		if(fn) {
			const result = await fn.call(this, ...args);

			this.emit(action, result);

			return result;
		}

		return;
	}

	async emit(action, ...args) {
		if(this.effects.has(action)) {
			const effects = this.effects.get(action);
			for(const fn of effects) {
				fn(...args);
			}

			this.emit("*", action, ...args);

			return true;
		}

		return false;
	}

	addAction(alias, fn) {
		this.actions.set(alias, fn);

		return this;
	}
	addActions(actionObj = {}) {
		for(const [ alias, fn ] of Object.entries(actionObj)) {
			this.addAction(alias, fn);
		}

		return this;
	}
	removeAction(alias) {
		return this.actions.delete(alias);
	}
	removeActions(...aliases) {
		const results = [];
		for(const alias of aliases) {
			results.push(this.removeAction(alias));
		}

		return results;
	}

	addEffect(alias, fn) {
		if(this.actions.has(alias)) {
			if(!this.effects.has(alias)) {
				this.effects.set(alias, []);
			}

			this.effects.get(alias).push(fn);
		}

		return this;
	}
	addEffects(...addEffectArgs) {
		for(const [ alias, fn ] of addEffectArgs) {
			this.addEffect(alias, fn);
		}

		return this;
	}
	removeEffect(alias, fn) {
		if(this.effects.has(alias)) {
			const effects = this.effects.get(alias);
			const index = effects.indexOf(fn);

			if(index !== -1) {
				effects.splice(index, 1);
			}
		}

		return this;
	}
	removeEffects(...removeEffectArgs) {
		for(const [ alias, fn ] of removeEffectArgs) {
			this.removeEffect(alias, fn);
		}

		return this;
	}
};

export default Actionable;