import { v4 as uuid, validate } from "uuid";
import { Tags } from "./Tags.js";

/**
 * @class IdentityClass
 * Represents an identity with unique identifier and associated tags.
 */
export class Identity {

	static Comparators = {
		/**
		 * Single-comparison evaluators
		 */
		IsUndefined(input) {
			return input === void 0;
		},
		IsNull(input) {
			return input === null;
		},
		IsDefined(input) {
			return input != null;
		},
		IsBoolean(input) {
			return typeof input === "boolean";
		},
		IsNumber(input) {
			return typeof input === "number";
		},
		IsNumeric(input) {
			return !isNaN(parseFloat(input));
		},
		IsString(input) {
			return typeof input === "string" || input instanceof String;
		},
		IsSymbol(input) {
			return typeof input === "symbol";
		},
		IsSet(input) {
			return input instanceof Set;
		},
		IsMap(input) {
			return input instanceof Map;
		},
		IsArray(input) {
			return Array.isArray(input);
		},
		IsObject(input) {
			return input != null && typeof input === "object";
		},
		IsStrictObject(input) {
			return Object.getPrototypeOf(input) === Object.prototype;
		},
		IsFunction(input) {
			return typeof input === "function";
		},
		IsDate(input) {
			return input instanceof Date;
		},
		IsRegExp(input) {
			return input instanceof RegExp;
		},
		IsPromise(input) {
			return input instanceof Promise;
		},
		IsIterable(input) {
			return input != null && typeof input[ Symbol.iterator ] === "function";
		},
		IsUUID(input) {
			return validate(input);
		},
		IsIdentity(input) {
			return input instanceof Identity;
		},
		IsHierarchy(input) {
			if(Identity.Comparators.IsArray(input)) {
				return input.every(row => {
					return Identity.Comparators.IsArray(row) && row.length === 4	//NOTE: [ id, tags, data, children ]
						&& Identity.Comparators.IsNumeric(row[ 0 ])
						&& (Identity.Comparators.IsNumeric(row[ 1 ]) || Identity.Comparators.IsNull(row[ 1 ]));
				});
			}

			return false;
		},
		IsClass(input) {
			return input.toString().substring(0, 5) === "class";
		},
		IsInstance(input) {
			if(typeof input !== "object") {
				return false;
			}

			return input instanceof input.constructor;
		},
		/**
		 * This is meant as a broader "instanceof" checker,
		 * allowing either @clazz instances and/or Objects that
		 * have an @keys-defined shape (i.e. duck typing).
		 */
		Conforms(input, { keys = [], clazz } = {}) {
			if(!Identity.Comparators.IsObject(input)) {
				return false;
			}

			if(clazz && input instanceof clazz) {
				return true;
			}

			return keys.every(key => key in input);
		},

		/**
		 * Complex comparators
		 */
		IsStringOrSymbol(input) {
			return Identity.Comparators.IsString(input) || Identity.Comparators.IsSymbol(input);
		},
		IsArrayOrSet(input) {
			return Identity.Comparators.IsArray(input) || Identity.Comparators.IsSet(input);
		},

		HasTag(input, tag) {
			return input.tags.has(tag);
		},
		HasTags(input, ...tags) {
			return tags.every(tag => input.tags.has(tag));
		},
	};

	/**
	 * Constructs an instance of IdentityClass with a unique identifier and tags.
	 * @param {Object} options - The options for creating an IdentityClass instance.
	 * @param {string} [options.id] - The unique identifier. If not provided, a new UUID will be generated.
	 * @param {Array} [options.tags=[]] - Initial set of tags for the instance.
	 * @param {Object} [rest] - Any additional properties and their values to be added to the instance.
	 */
	constructor ({ id, tags = [], ...rest } = {}) {
		this.id = id || uuid();
		this.tags = Tags.ToObject(Tags.From(...tags));

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
	 * @returns {Identity} A new instance of IdentityClass with the same properties.
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

export default Identity;