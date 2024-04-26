import CoreAnimus from "../../core/components/Animus";
import { EnumComponentType } from "./EnumComponentType";

export class Animus extends CoreAnimus {
	constructor ({ color, ...props } = {}) {
		super({ ...props });

		this.color = color ?? `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`;
	}

	render({ game, entity, g = this.graphics } = {}) {
		let { x: px, y: py, model } = entity.getComponent(EnumComponentType.Physics);
		const { tileWidth: tw, tileHeight: th, zoom } = game.config.world;

		px *= tw * zoom;
		py *= th * zoom;

		let radius = model.r * tw * zoom;

		g.clear();
		g.lineStyle(1, this.color);
		g.beginFill(this.color);
		if(model.type === "circle") {
			g.drawCircle(~~px, ~~py, ~~radius);
		} else if(model.type === "rect") {
			g.drawRect(~~px, ~~py, ~~model.w, ~~model.h);
		}
		g.endFill();

		return g;
	}
}

export default Animus;