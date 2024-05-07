import CoreAnimateEntity from "../../core/entities/AnimateEntity";

import Physics from "../../../apps/gaia/components/Physics";
import Animus from "../../../apps/gaia/components/Animus";

export class AnimateEntity extends CoreAnimateEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics: [ Physics, physics ],
			animus: [ Animus, animus ],
		});
	}
};

export default AnimateEntity;