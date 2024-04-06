import Entity from "../../core/entities/Entity";

export class Bubble extends Entity {
	constructor ({ id, meta = {}, components = [] } = {}) {
		super({ id, meta, components });
	}
};

export default Bubble;