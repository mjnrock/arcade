import Message from "./Message";
import Envelope from "./Envelope";
import Serializer from "./Serializer";

export const resources = {
	[ Message.ResourceName ]: Message,
	[ Envelope.ResourceName ]: Envelope,
	[ Serializer.ResourceName ]: Serializer,
};

export default {
	Message,
	Envelope,
	Serializer,
};