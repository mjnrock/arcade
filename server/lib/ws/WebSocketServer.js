import { WebSocketServer as WSS } from "ws";
import { v4 as uuid } from "uuid";

export class WebSocketServer {
	constructor ({ port, config = {}, router } = {}) {
		this.id = uuid();
		this.config = { port, ...config };
		this.router = router;
		this.clients = new Set();
		this.init();
	}

	init() {
		this.wss = new WSS({ port: this.config.port });

		this.wss.on("connection", (ws) => {
			this.clients.add(ws);
			ws.on("message", (msg) => {
				try {
					const data = JSON.parse(msg);
					this.router(data);
				} catch(error) {
					console.error("Error parsing JSON message:", error);
					// this.router(msg);	// Send the original message to the router
				}
			});
			ws.on("close", () => this.clients.delete(ws));
		});
	}

	broadcast(message) {
		for(const client of this.clients) {
			client.send(message);
		}
	}
	send(message) {
		for(const client of this.clients) {
			client.send(message);
		}
	}
}

export default WebSocketServer;