import CoreAnimateEntity from "../../core/entities/AnimateEntity";

import Animus from "../../../apps/gaia/components/Animus";

export class AnimateEntity extends CoreAnimateEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics,
			animus: [ Animus, animus ],
		});
	}
};

export default AnimateEntity;