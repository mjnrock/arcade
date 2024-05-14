import Rectangle from "../../../modules/core/lib/geometry/Rectangle";
import RPGPlayerEntity from "../../../modules/rpg/entities/PlayerEntity";
import Abilities from "../../../modules/rpg/components/Abilities";
import Resource from "../../../modules/rpg/components/Resource";
import EnumComponentType from "../../../modules/rpg/components/EnumComponentType";
import EnumResourceType from "../../../modules/rpg/components/EnumResourceType";

import ActionDamage from "../abilities/ActionDamage";
import EnumAbility from "../abilities/EnumAbility";

export class PlayerEntity extends RPGPlayerEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });

		//FIXME: This paradigm is currently insane, but it demonstrates each requirement
		const health = new Resource({
			type: EnumResourceType.Health,	// sic
			current: 100,
			max: 100,
			step: 0.1,
			regenRate: 0.1,
		});
		this.addComponent(health);

		const mana = new Resource({
			type: EnumResourceType.Mana,	// sic
			current: 250,
			max: 250,
			step: 0.1,
			regenRate: 0.5,
		});
		this.addComponent(mana);


		//* How should rendering like this be handled?
		const animus = this.components.get(EnumComponentType.Animus);
		animus.graphics.addChild(health.graphics);
		animus.graphics.addChild(mana.graphics);

		//FIXME: This paradigm is currently insane, but it demonstrates each requirement
		const abilities = new Abilities({
			abilities: [
				{
					name: EnumAbility.DeathRay,
					model: new Rectangle({ width: 4, height: 4 }),
					actions: [
						new ActionDamage({ amount: 0.1 }),
					],
				},
			],
		});
		this.addComponent(abilities);
	}
};

export default PlayerEntity;