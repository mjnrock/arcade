import { v4 as uuid } from "uuid";

export class WebSocketBrowserClient {
	constructor ({ url, config = {}, router } = {}) {
		this.id = uuid(); // Assuming uuid() is available or imported elsewhere
		this.config = { url, ...config };
		this.router = router;
		this.init();
	}

	init() {
		this.ws = new WebSocket(this.config.url);

		this.ws.addEventListener("open", () => console.log("Connected to the server."));
		this.ws.addEventListener("message", (event) => this.router(event.data));
		this.ws.addEventListener("error", (event) => console.error(`WebSocket error: ${ event.error }`));
		this.ws.addEventListener("close", (event) => console.log(`Connection closed: ${ event.code } ${ event.reason }`));
	}

	send(message) {
		if(this.ws.readyState === WebSocket.OPEN) {
			try {
				this.ws.send(message);
			} catch(error) {
				console.error(`Send error: ${ error }`);
			}
		}
	}
};

export default WebSocketBrowserClient;