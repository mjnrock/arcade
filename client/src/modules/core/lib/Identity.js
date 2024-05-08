import { v4 as uuid } from "uuid";
import { Tags } from "./Tags.js";

/**
 * @class IdentityClass
 * Represents an identity with unique identifier and associated tags.
 */
export class IdentityClass {
	/**
	 * Constructs an instance of IdentityClass with a unique identifier and tags.
	 * @param {Object} options - The options for creating an IdentityClass instance.
	 * @param {string} [options.id] - The unique identifier. If not provided, a new UUID will be generated.
	 * @param {Array} [options.tags=[]] - Initial set of tags for the instance.
	 * @param {Object} [rest] - Any additional properties and their values to be added to the instance.
	 */
	constructor ({ id, tags = [], ...rest } = {}) {
		this.$id = id || uuid();
		this.$tags = Tags.ToObject(Tags.From(...tags));

		// Bind `this` to any functions passed in.
		for(const key in rest) {
			if(typeof rest[ key ] === "function") {
				this[ key ] = rest[ key ].bind(this);
			} else {
				this[ key ] = rest[ key ];
			}
		}
	}

	/**
	 * Creates a copy of the current instance.
	 * @returns {IdentityClass} A new instance of IdentityClass with the same properties.
	 */
	copy() {
		return new this.constructor(this);
	}

	/**
	 * Converts the instance into a plain object.
	 * @returns {Object} A plain object representing the instance.
	 */
	toObject() {
		return Identity.toObject(this);
	}

	/**
	 * Converts the instance to a JSON string.
	 * @param {...any} args - Additional arguments to pass to JSON.stringify.
	 * @returns {string} A string representation of the instance.
	 */
	toString(...args) {
		return Identity.toString(this, ...args);
	}

	/**
	 * Converts the instance into a meta object containing only metadata properties.
	 * @returns {Object} A meta object with metadata properties.
	 */
	toMetaObject() {
		return Identity.toMetaObject(this);
	}

	/**
	 * Converts the meta object of the instance to a JSON string.
	 * @param {...any} args - Additional arguments to pass to JSON.stringify.
	 * @returns {string} A string representation of the meta object.
	 */
	toMetaString(...args) {
		return Identity.toMetaString(this, ...args);
	}
};

export const Identity = {
	/**
	 * Advances or updates an existing object with a new ID and tags, returning the updated object.
	 * @param {Object} options - Options containing new values.
	 * @param {string} [options.id] - The unique identifier. If not provided, a new UUID will be generated.
	 * @param {Array} [options.tags=[]] - The set of tags.
	 * @param {Object} [target] - Target object to be updated.
	 * @returns {Object} The updated object with a new ID and tags.
	 */
	Next({ id, tags = [], ...target } = {}) {
		target.$id = id || uuid();
		target.$tags = Tags.ToObject(Tags.From(...tags));
		return target;
	},

	/**
	 * Creates a new object with a unique identifier and tags, and returns it.
	 * @param {Object} options - Options for creating a new object.
	 * @returns {Object} The newly created object with an ID and tags.
	 */
	New({ id, tags = [], ...rest } = {}) {
		return Identity.Next({ id, tags, ...rest });
	},

	/**
	 * Converts an object to a plain object with metadata stored separately.
	 * @param {Object} target - The target object to convert.
	 * @returns {Object} The plain object with metadata stored in a `$meta` property.
	 */
	toObject(target) {
		const obj = {
			$meta: {},
		};

		for(const [ key, value ] of Object.entries(target)) {
			if(key.startsWith("$")) {
				obj.$meta[ key.slice(1) ] = value;
			} else {
				obj[ key ] = value;
			}
		}

		return obj;
	},

	/**
	 * Converts an object to a JSON string representation.
	 * @param {Object} target - The target object to stringify.
	 * @param {...any} args - Additional arguments to pass to JSON.stringify.
	 * @returns {string} A JSON string representation of the object.
	 */
	toString(target, ...args) {
		return JSON.stringify(target, ...args);
	},

	/**
	 * Creates an isolated object with only the metadata from the target object.
	 * @param {Object} target - The target object to extract metadata from.
	 * @returns {Object} An object containing only metadata.
	 */
	toMetaObject(target) {
		const meta = {};

		for(const [ key, value ] of Object.entries(target)) {
			if(key.startsWith("$")) {
				meta[ key.slice(1) ] = value;
			}
		}

		return meta;
	},

	/**
	 * Converts the metadata of an object to a JSON string.
	 * @param {Object} target - The target object whose metadata to stringify.
	 * @param {...any} args - Additional arguments to pass to JSON.stringify.
	 * @returns {string} A JSON string representation of the object's metadata.
	 */
	toMetaString(target, ...args) {
		return JSON.stringify(target.toMetaObject(), ...args);
	},
};

export default {
	IdentityClass,
	Identity,
};