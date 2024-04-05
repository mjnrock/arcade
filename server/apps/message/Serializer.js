import Message from "./Message.js";
import Envelope from "./Envelope.js";

/* A system-wide unique identifier for this resource */
export const ResourceName = `arcade.server.apps.message.Serializer`;

export const Serializer = {
	Message: {
		serialize: (message) => JSON.stringify(message),
		deserialize: (message) => Message(JSON.parse(message)),
	},
	Envelope: {
		serialize: (envelope) => JSON.stringify(envelope),
		deserialize: (envelope) => Envelope(JSON.parse(envelope)),
	},
};

export default {
	ResourceName,
	Serializer,
};