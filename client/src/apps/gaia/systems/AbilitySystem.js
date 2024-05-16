import RPGAbilitySystem from "../../../modules/rpg/systems/AbilitySystem";
import AbilityEntity from "../../../modules/rpg/entities/AbilityEntity";

import EnumComponentType from "../components/EnumComponentType";

/**
 * Actions are a part of the core/Actionable class, meant to be added into the system
 * to be used as dispatchable actions.
 * 
 * In practice, Actions are meant to be utilized at the game-loop level and therefore
 * more related to in-the-moment gameplay.
 */
export const Actions = {};

/**
 * Receivers are part of the core/lib/message System class, meant to be mounted to the system
 * to act as routeable endpoints for Messages.
 * 
 * In practice, Receivers are meant to be utilized at the message-passing level and therefore
 * more related to inter-system communication.
 */
export const Receivers = {
	castAbility({ data, message } = {}) {
		const { name, entity, entityArgs = {}, abilityArgs = {}, game } = data;
		const abilities = entity.getComponent(EnumComponentType.Abilities);
		const abilityFactory = abilities.getAbility(name);

		/* If the ability is not found, return */
		if(!abilityFactory) {
			return;
		}

		const ability = abilityFactory({ ...abilityArgs });
		const paid = ability.pay(entity.compObj);
		/* true if all Resources were paid, else false */
		if(!paid) {
			return;
		}

		/* Spawn a projectile */
		const entProjectile = new AbilityEntity({
			...entityArgs,
			ability,
			source: entity,
		});

		const entPhysics = entProjectile.getComponent(EnumComponentType.Physics);
		entPhysics.speed = ability.speed;
		entPhysics.model = ability.model;

		//TODO: Move this into a WorldSystem with a "joinWorld" action
		/* Add the projectile to the world */
		game.currentWorld.addEntity(entProjectile);

		return entProjectile;
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