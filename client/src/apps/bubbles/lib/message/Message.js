import { v4 as uuid } from "uuid";

/* A system-wide unique identifier for this resource */
export const ResourceName = `arcade.server.apps.message.Message`;

/**
 * 
 */
export const Message = ({
	id = uuid(),
	type,
	data,
	meta = {},
	ts = Date.now(),
} = {}) => ({
	$rn: ResourceName,

	id,
	type,
	data,
	meta,
	ts,
});

export const isMessage = (message) => {
	return (
		typeof message === "object" &&
		typeof message.id === "string" &&
		(typeof message.type === "string" || Array.isArray(message.type)) &&
		typeof message.data === "object" &&
		typeof message.meta === "object" &&
		typeof message.ts === "number"
	);
};

export default {
	ResourceName,
	Message,
	isMessage,
};