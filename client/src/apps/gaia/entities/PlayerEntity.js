import Rectangle from "../../../modules/core/lib/geometry/Rectangle";
import RPGPlayerEntity from "../../../modules/rpg/entities/PlayerEntity";
import Abilities from "../../../modules/rpg/components/Abilities";
import ActionDamage from "../abilities/ActionDamage";
import EnumAbility from "../abilities/EnumAbility";

export class PlayerEntity extends RPGPlayerEntity {
	constructor ({ ...props } = {}) {
		super({ ...props });

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