import AnimateEntity from "../../core/entities/AnimateEntity";

import BubbleAnimus from "../components/BubbleAnimus";

export class Bubble extends AnimateEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics,
			animus: [ BubbleAnimus, animus ],
		});
	}
};

export default Bubble;