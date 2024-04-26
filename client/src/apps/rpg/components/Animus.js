import CoreAnimus from "../../core/components/Animus";
import { EnumComponentType } from "./EnumComponentType";

export class Animus extends CoreAnimus {
	constructor ({ color, ...props } = {}) {
		super({ ...props });

		this.color = color ?? `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`;
	}

	render({ game, entity, g = this.graphics } = {}) {
		const { model } = entity.getComponent(EnumComponentType.Physics);
		const { tileWidth: scaleFactor, zoom } = game.config.world;
		/* model.r is unitary, so we must scale it */
		const radius = model.r * zoom * scaleFactor;

		g.clear();
		g.lineStyle(1, this.color);
		g.beginFill(this.color);
		if(model.type === "circle") {
			g.drawCircle(0, 0, ~~radius);
		} else if(model.type === "rect") {
			g.drawRect(0, 0, ~~model.w, ~~model.h);
		}
		g.endFill();

		return g;
	}
}

export default Animus;