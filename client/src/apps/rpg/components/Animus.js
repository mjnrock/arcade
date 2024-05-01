import * as PIXI from "pixi.js";
import CoreAnimus from "../../core/components/Animus";
import { EnumComponentType } from "./EnumComponentType";

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
		/* model.r is unitary, so we must scale it */
		const radius = model.r * scaleFactor;

		g.clear();

		const gSoma = this.soma;
		g.zIndex = 1;
		gSoma.clear();
		gSoma.lineStyle(1, this.color);
		gSoma.beginFill(this.color);
		if(model.type === "circle") {
			gSoma.drawCircle(0, 0, ~~radius);
		} else if(model.type === "rect") {
			gSoma.drawRect(0, 0, ~~model.w, ~~model.h);
		}
		gSoma.endFill();

		this.isDirty = false;

		return g;
	}
}

export default Animus;