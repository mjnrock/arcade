import { v4 as uuid } from "uuid";

import { isMessage, Message } from "./Message.js";

/* A system-wide unique identifier for this resource */
export const ResourceName = `arcade.server.apps.message.Envelope`;

export const EnumEnvelopeType = {
	REQUEST: "request",
	RESPONSE: "response",
};

/**
 * A wrapper for `Message` objects, with additional metadata.
 * The primary purpose is for wrapping intermodule communication,
 * whether locally or over a network.
 */
export const Envelope = ({
	id = uuid(),
	type = EnumEnvelopeType.REQUEST,
	message,
	meta = {},
	ts = Date.now(),
	request,
} = {}) => ({
	$rn: ResourceName,

	id,
	type,
	/* If the `message` is already a `Message`, use it; otherwise, wrap it in a `Message` */
	message: isMessage(message) ? message : Message(message),
	ts,
	meta: {
		/* The `id` property of the original `Message`, if passed, for provenance */
		request,
		...meta,
	},
});

/**
 * Validate whether the given object is an `Envelope`.
 * By default, this validates the `message` property as a `Message`.
 */
export const isEnvelope = (envelope, { enforceMessage = true } = {}) => {
	return (
		typeof envelope === "object" &&
		typeof envelope.id === "string" &&
		typeof envelope.type === "string" &&
		(enforceMessage ? isMessage(envelope.message) : typeof envelope.message === "object") &&
		typeof envelope.ts === "number" &&
		typeof envelope.meta === "object"
	);
};

export default Envelope;