import * as PIXI from "pixi.js";

import CoreAnimus from "../../../modules/core/components/Animus";
import Circle from "../../../modules/core/lib/geometry/Circle";
import Rectangle from "../../../modules/core/lib/geometry/Rectangle";
import { EnumComponentType } from "../../../modules/rpg/components/EnumComponentType";

export class Animus extends CoreAnimus {
	constructor ({ color, ...props } = {}) {
		super({ ...props });

		this.color = color ?? `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`;

		/* Use this.graphics as an abstract container for all the PIXI.Graphics objects, so that we can easily manipulate them (e.g. ordering) */
		this.soma = new PIXI.Graphics();
		this.graphics.addChild(this.soma);
	}

	render({ game, entity, g = this.graphics } = {}) {
		if(this.isDirty === false) return g;

		const { model } = entity.getComponent(EnumComponentType.Physics);
		const { tileWidth: scaleFactor } = game.config.world;
		const radius = model.radius * scaleFactor;

		const gSoma = this.soma;
		gSoma.clear();
		gSoma.lineStyle(1, this.color);
		gSoma.beginFill(this.color);
		if(model instanceof Circle) {
			gSoma.drawCircle(0, 0, ~~radius);
		} else if(model instanceof Rectangle) {
			gSoma.drawRect(0, 0, ~~model.width, ~~model.height);
		}
		gSoma.endFill();

		this.isDirty = false;

		return g;
	}
}

export default Animus;