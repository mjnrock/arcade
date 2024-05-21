import AnimateEntity from "./AnimateEntity";

export class TileEntity extends AnimateEntity {
	constructor ({ physics, animus, ...props } = {}) {
		super({
			...props,
			physics,
			animus,
		});
	}
};

export default TileEntity;