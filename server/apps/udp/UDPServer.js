import dgram from "dgram";

export class UDPServer {
	constructor ({ port } = {}) {
		this.server = dgram.createSocket("udp4");
		this.messageQueue = [];
		this.port = port;

		this.server.on("error", (err) => this.onError(err));
		this.server.on("message", (msg, rinfo) => this.onMessage(msg, rinfo));
		this.server.on("listening", () => this.onListening());
	}

	onError(err) {
		console.log(`Server error:\n${ err.stack }`);
		this.server.close();
	}

	onMessage(msg, rinfo) {
		console.log(`Server got: ${ msg } from ${ rinfo.address }:${ rinfo.port }`);
		// Add message to queue
		this.messageQueue.push(msg.toString());
		// Start processing messages if not already started
		if(this.messageQueue.length === 1) {
			this.processMessage();
		}
	}

	onListening() {
		const address = this.server.address();
		console.log(`Server listening ${ address.address }:${ address.port }`);
	}

	async processMessage() {
		if(this.messageQueue.length === 0) {
			return;
		}

		const message = this.messageQueue.shift();
		console.log(`Processing message: ${ message }`);

		// Simulate asynchronous message processing
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Process the next message
		this.processMessage();
	}

	start() {
		this.server.bind(this.port);
	}
};

export default UDPServer;