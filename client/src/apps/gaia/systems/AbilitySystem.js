import AbilityEntity from "../entities/AbilityEntity";

import EnumComponentType from "../components/EnumComponentType";
import { Message } from "../../../modules/core/lib/message/Message";
import System from "../../../modules/core/lib/message/System";

export const Actions = {};

export const Receivers = {
	castAbility(message) {
		const { name, source, abilityArgs = {}, entityArgs = {}, game } = message.data;
		const abilities = source.getComponent(EnumComponentType.Abilities);
		const ability = abilities.getState(name);
		const abilityFn = abilities.getAbility(name);

		const paid = ability.pay(source.compObj);
		/* true if all Resources were paid, else false */
		if(!paid) {
			return;
		}

		/* Spawn a projectile */
		const abilityInstance = abilityFn(abilityArgs);
		console.log(entityArgs)
		const entProjectile = new AbilityEntity({
			...entityArgs,
			ability: abilityInstance,
			source: source,
		});

		const entPhysics = entProjectile.getComponent(EnumComponentType.Physics);
		entPhysics.speed = ability.speed;
		entPhysics.model = ability.model;

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

export class AbilitySystem extends System {
	constructor ({ game } = {}) {
		super({ game });

		this.addActions(Actions);
		this.addReceivers(Receivers);
	}
};

export default AbilitySystem;