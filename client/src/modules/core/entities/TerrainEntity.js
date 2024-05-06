import AnimateEntity from "./AnimateEntity";

export class TerrainEntity extends AnimateEntity {
	constructor ({ physics, animus, ...props } = {}) {
		super({
			...props,
			physics: {
				...(physics ?? {}),
				model: {
					type: "rect",
					...(physics?.model ?? {}),
				},
			},
			animus,
		});
	}
};

export default TerrainEntity;