import Entity from "../../core/entities/Entity";

export class Player extends Entity {
	constructor ({ id, meta = {}, components = [] } = {}) {
		super({ id, meta, components });
	}
};

export default Player;