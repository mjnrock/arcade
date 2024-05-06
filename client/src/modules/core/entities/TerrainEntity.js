import LivingEntity from "./LivingEntity";

export class TerrainEntity extends LivingEntity {
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