import LivingEntity from "../../core/entities/LivingEntity";

import PlayerAnimus from "../components/PlayerAnimus";

export class Player extends LivingEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics,
			animus: [ PlayerAnimus, animus ],
		});
	}
};

export default Player;