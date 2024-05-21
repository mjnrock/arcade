import RPGAbilitySystem from "../../../modules/rpg/systems/AbilitySystem";
import AbilityEntity from "../../../modules/rpg/entities/AbilityEntity";

import EnumComponentType from "../components/EnumComponentType";
import { Message } from "../../../modules/core/lib/message/Message";

export const Actions = {};

export const Receivers = {
	castAbility(message) {
		const { name, entity, entityArgs = {}, game } = message.data;
		const abilities = entity.getComponent(EnumComponentType.Abilities);
		const ability = abilities.getState(name);
		const abilityFn = abilities.getAbility(name);

		const paid = ability.pay(entity.compObj);
		/* true if all Resources were paid, else false */
		if(!paid) {
			return;
		}

		/* Spawn a projectile */
		const entProjectile = new AbilityEntity({
			...entityArgs,
			//FIXME: This is a problem.
			ability: abilityFn(),
			source: entity,
		});

		const entPhysics = entProjectile.getComponent(EnumComponentType.Physics);
		entPhysics.speed = ability.speed;
		entPhysics.model = ability.model;
		entPhysics.x = entity.components.get(EnumComponentType.Physics).x;
		entPhysics.y = entity.components.get(EnumComponentType.Physics).y;

		/* Add the projectile to the world */
		this.router.route(Message({
			type: [ "WorldSystem", "joinWorld" ],
			data: {
				game,
				entity: entProjectile,
			},
		}));
	},
};

export class AbilitySystem extends RPGAbilitySystem {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}
};

export default AbilitySystem;