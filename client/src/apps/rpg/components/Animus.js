import CoreAnimus from "../../core/components/Animus";
import { EnumComponentType } from "./EnumComponentType";

export class Animus extends CoreAnimus {
	constructor ({ color, ...props } = {}) {
		super({ ...props });

		this.color = color ?? `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`;
	}

	render({ entity, g = this.graphics } = {}) {
		const { x, y, model } = entity.getComponent(EnumComponentType.Physics);

		g.clear();
		g.lineStyle(1, this.color);
		g.beginFill(this.color);
		if(model.type === "circle") {
			g.drawCircle(~~x, ~~y, ~~model.r);
		} else if(model.type === "rect") {
			g.drawRect(~~x, ~~y, ~~model.w, ~~model.h);
		}
		g.endFill();

		return g;
	}
}

export default Animus;