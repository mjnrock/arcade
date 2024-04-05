import { v4 as uuid } from "uuid";
import dgram from "dgram";

export class UDPServer {
	constructor ({ port, config = {}, router }) {
		if(!router) {
			throw new Error("A router function must be provided");
		}

		this.id = uuid();
		this.server = dgram.createSocket("udp4");

		this.queue = [];
		this.router = router;

		this.config = {
			port,
			autoProcessOverflow: true,
			batchSize: 10,
			delay: 100,
			...config,
		};

		this.server.on("error", (err) => this.onError(err));
		this.server.on("message", (msg, rinfo) => this.onMessage(msg, rinfo));
		this.server.on("listening", () => this.onListening());
	}

	onError(err) {
		console.log(`Server error:\n${ err.stack }`);
		this.server.close();
	}

	onMessage(msg, rinfo) {
		console.log(`Server @${ this.config.port } got: ${ msg } from ${ rinfo.address }:${ rinfo.port } of ${ rinfo.size } bytes`);

		try {
			const data = msg.toString();
			this.queue.push({ data, type: "json" });
		} catch {
			this.queue.push({ data: msg, type: "buffer" });
		}

		if(this.queue.length === 1) {
			this.processBatch();
		}
	}

	onListening() {
		const address = this.server.address();
		console.log(`Server listening ${ address.address }:${ address.port }`);
	}

	async processBatch() {
		const message = this.queue.splice(0, this.config.batchSize);
		for(let { data, type } of message) {
			console.log(`Processing data: ${ typeof data === "object" ? JSON.stringify(data) : data }`);
			try {
				await this.router({ data, type });
			} catch(error) {
				console.error(`Error processing data: ${ error }`);
			}
		}
		if(this.config.autoProcessOverflow && this.queue.length > 0) {
			setTimeout(() => this.processBatch(), this.config.delay);
		}
	}

	start() {
		this.server.bind(this.config.port);
	}
}

export default UDPServer;