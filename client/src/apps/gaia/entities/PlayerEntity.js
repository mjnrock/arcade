import Rectangle from "../../../modules/core/lib/geometry/Rectangle";
import RPGPlayerEntity from "../../../modules/rpg/entities/PlayerEntity";
import Abilities from "../../../modules/rpg/components/Abilities";
import Resource from "../../../modules/rpg/components/Resource";
import EnumComponentType from "../../../modules/rpg/components/EnumComponentType";

import ActionDamage from "../abilities/ActionDamage";

export class PlayerEntity extends RPGPlayerEntity {
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

		//FIXME: This paradigm is currently insane, but it demonstrates each requirement
		const abilities = new Abilities({
			abilities: [
				{
					name: "melee",
					model: new Rectangle({ width: 4, height: 4 }),
					actions: [
						new ActionDamage({ amount: 1 }),
					],
				},
			],
		});
		this.addComponent(abilities);
	}
};

export default PlayerEntity;