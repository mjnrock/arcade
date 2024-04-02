import { v4 as uuid } from "uuid";
import dgram from "dgram";

export class UDPClient {
	constructor ({ host, port } = {}) {
		this.id = uuid();
		this.client = dgram.createSocket("udp4");

		this.config = {
			host,
			port,
		};
	}

	send(message) {
		let messageBuffer;
		if(typeof message === "object") {
			messageBuffer = Buffer.from(JSON.stringify(message));
		} else {
			messageBuffer = message;
		}

		this.client.send(messageBuffer, 0, messageBuffer.length, this.config.port, this.config.host, (err) => {
			if(err) {
				console.error(`Failed to send message: ${ err }`);
				this.client.close();
			} else {
				console.log(`Message sent: "${ messageBuffer.toString() }"`);
			}
		});
	}

	close() {
		this.client.close();
	}
}

export default UDPClient;