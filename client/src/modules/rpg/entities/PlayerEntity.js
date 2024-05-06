import LivingEntity from "./LivingEntity";

import Resource from "../components/Resource";
import EnumComponentType from "../components/EnumComponentType";

export class PlayerEntity extends LivingEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });

		//FIXME: This paradigm is currently insane, but it demonstrates each requirement
		const health = new Resource({
			type: EnumComponentType.Health,
			current: 100,
			max: 100,
		});
		this.addComponent(health);
		//* How should rendering like this be handled?
		const animus = this.components.get(EnumComponentType.Animus);
		animus.graphics.addChild(health.graphics);
	}
};

export default PlayerEntity;