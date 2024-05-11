import AnimateEntity from "./AnimateEntity";

export class TerrainEntity extends AnimateEntity {
	constructor ({ physics, animus, ...props } = {}) {
		super({
			...props,
			physics,
			animus,
		});
	}
};

export default TerrainEntity;