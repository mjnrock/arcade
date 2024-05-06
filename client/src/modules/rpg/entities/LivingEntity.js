import CoreLivingEntity from "../../core/entities/LivingEntity";

import Animus from "../components/Animus";

export class LivingEntity extends CoreLivingEntity {
	constructor ({ physics = {}, animus = {}, ...props } = {}) {
		super({
			...props,
			physics,
			animus: [ Animus, animus ],
		});
	}
};

export default LivingEntity;