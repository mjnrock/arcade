import dgram from "dgram";

export class UDPClient {
	constructor ({ host, port } = {}) {
		this.host = host;
		this.port = port;
		this.client = dgram.createSocket("udp4");
	}

	send(message) {
		const messageBuffer = Buffer.from(message);
		this.client.send(messageBuffer, 0, messageBuffer.length, this.port, this.host, (err) => {
			if(err) {
				console.error(`Failed to send message: ${ err }`);
				this.client.close();
			} else {
				console.log(`Message sent: "${ message }"`);
			}
		});
	}

	close() {
		this.client.close();
	}
};

export default UDPClient;