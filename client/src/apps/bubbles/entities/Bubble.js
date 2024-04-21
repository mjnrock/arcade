import LivingEntity from "../../core/entities/LivingEntity";

import BubbleAnimus from "../components/BubbleAnimus";

export class Bubble extends LivingEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics,
			animus: [ BubbleAnimus, animus ],
		});
	}
};

export default Bubble;