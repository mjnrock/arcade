import Resource from "./Resource";

export class Cooldown extends Resource {
	constructor ({ current = 0, max = 1000, ...props } = {}) {
		super({
			type: "cooldown",
			current,
			max,
			min: 0,
			step: 1,
			regenRate: 1,
			...props,
		});
	}

	/* Drain the current value */
	drain() {
		this.current = 0;

		return this;
	}
	/* Fill the current value */
	refresh() {
		this.current = this.max;

		return this;
	}

	update({ game, dt, entity } = {}) {
		console.log(dt, this.regenRate, (1 / dt) * this.regenRate)
		super.update({
			game,
			dt: (1 / dt) * this.regenRate,
			entity,
		});
	}
	render({ entity, g = this.graphics, i } = {}) {
		//DEBUG: Black bar of the Cooldown for testing
		/* Check if the pixi graphic has been parented to the entity's container */
		if(!g.parent) {
			const animus = entity.components.get("animus");
			if(animus) {
				animus.graphics.addChild(g);
			}
		}

		const width = 16;
		const height = 6;
		const barWidth = width * this.ratio;

		g.lineStyle(0);
		g.beginFill("#000", 0.5);
		g.drawRect(-width / 2, (height + 1) * i + 16, barWidth, height);
		g.endFill();

		return g;
	}
};

export default Cooldown;