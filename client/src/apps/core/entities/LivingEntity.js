import Entity from "./Entity";

import Physics from "../components/Physics";
import Animus from "../components/Animus";

export class LivingEntity extends Entity {
	constructor ({ id, meta = {}, components = [], physics = {}, animus = {} } = {}) {
		super({ id, meta, components });

		/* Allow for overriding the physics and animus component classes */
		if(Array.isArray(physics)) {
			const [ clazz, ...args ] = physics;

			this.addComponent(clazz.Factory(...args));
		} else {
			this.addComponent(Physics.Factory(physics));
		}
		if(Array.isArray(animus)) {
			const [ clazz, ...args ] = animus;

			this.addComponent(clazz.Factory(...args));
		} else {
			this.addComponent(Animus.Factory(animus));
		}
	}
};

export default LivingEntity;