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
		g.lineStyle(1, this.color, 0.5);
		g.beginFill(this.color, 0.3);
		g.drawCircle(~~x, ~~y, ~~model.r);
		g.endFill();

		return g;
	}
}

export default Animus;