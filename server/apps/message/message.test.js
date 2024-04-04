import { Serializer } from "./Serializer.js";
import { Envelope, isEnvelope, EnumEnvelopeType } from "./Envelope.js";
import { Message, isMessage } from "./Message.js";

// Basic assertion function to simplify testing
const assert = (condition, message) => {
	if(!condition) {
		throw new Error(`Assertion failed: ${ message }`);
	}
};

// Test serialization and deserialization of Message
const testMessageSerialization = () => {
	const originalMessage = Message({ type: "test", data: { content: "Hello World" } });
	const serialized = Serializer.Message.serialize(originalMessage);
	const deserialized = Serializer.Message.deserialize(serialized);

	assert(isMessage(deserialized), "Deserialized object should be a valid Message");
	assert(deserialized.type === "test" && deserialized.data.content === "Hello World", "Message content should match original");
};

// Test serialization and deserialization of Envelope
const testEnvelopeSerialization = () => {
	const message = Message({ type: "test", data: { content: "Hello World" } });
	const originalEnvelope = Envelope({ type: EnumEnvelopeType.REQUEST, message });
	const serialized = Serializer.Envelope.serialize(originalEnvelope);
	const deserialized = Serializer.Envelope.deserialize(serialized);

	assert(isEnvelope(deserialized), "Deserialized object should be a valid Envelope");
	assert(deserialized.message.data.content === "Hello World", "Envelope message content should match original");
	assert(deserialized.type === EnumEnvelopeType.REQUEST, "Envelope type should match original");
};

// Test creation and validation of Message
const testMessageCreation = () => {
	const message = Message({ type: "test", data: { content: "Test" } });
	assert(isMessage(message), "Created object should be a valid Message");
};

// Test creation and validation of Envelope
const testEnvelopeCreation = () => {
	const message = Message({ type: "reply", data: { content: "Reply Message" } });
	const envelope = Envelope({ type: EnumEnvelopeType.RESPONSE, message });
	assert(isEnvelope(envelope), "Created object should be a valid Envelope");
	assert(envelope.type === EnumEnvelopeType.RESPONSE, "Envelope type should be RESPONSE");
};

// Execute tests
testMessageSerialization();
testEnvelopeSerialization();
testMessageCreation();
testEnvelopeCreation();

console.log("All tests passed!");