import Entity from "./Entity";

import Physics from "../components/Physics";
import Animus from "../components/Animus";
import Component from "../components/Component";
import Resource from "../../rpg/components/Resource";

import EnumComponentType from "../components/EnumComponentType";

/**
 * I vascillate on the naming here, but an AnimateEntity
 * is just a way to say an Entity that has Physics and Animus
 * components.  It's really just a way to slightly abstract
 * a pure Entity from a practical one.
 */
export class AnimateEntity extends Entity {
	constructor ({ id, meta = {}, components = [], physics = {}, animus = {} } = {}) {
		super({ id, meta });

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

		this.addComponent(...components);
	}

	addComponent(...components) {
		for(const component of components) {
			if(component instanceof Component) {
				super.addComponent(component);

				if(component instanceof Resource) {
					const animus = this.components.get(EnumComponentType.Animus);
					animus.graphics.addChild(component.graphics);
				}
			}
		}
	}

};

export default AnimateEntity;