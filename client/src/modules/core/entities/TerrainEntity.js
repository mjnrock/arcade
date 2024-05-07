import Rectangle from "../lib/geometry/Rectangle";
import AnimateEntity from "./AnimateEntity";

export class TerrainEntity extends AnimateEntity {
	constructor ({ physics, animus, ...props } = {}) {
		super({
			...props,
			physics: {
				...(physics ?? {}),
				model: new Rectangle({
					width: 1,
					height: 1,
					...(physics?.model ?? {}),
				}),
			},
			animus,
		});
	}
};

export default TerrainEntity;