import WebSocket from "ws";
import { v4 as uuid } from "uuid";

class WebSocketClient {
	constructor ({ url, config = {}, router } = {}) {
		this.id = uuid();
		this.config = { url, ...config };
		this.router = router;
		this.init();
	}

	init() {
		this.ws = new WebSocket(this.config.url);

		this.ws.on("open", () => console.log("Connected to the server."));
		this.ws.on("message", (msg) => this.router(msg));
		this.ws.on("error", (error) => console.error(`WebSocket error: ${ error }`));
	}

	send(message) {
		if(this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(message, (error) => {
				if(error) console.error(`Send error: ${ error }`);
			});
		}
	}
}

export default WebSocketClient;