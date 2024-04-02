import UDPServer from "./UDPServer.js";
import UDPClient from "./UDPClient.js";

class DuplexUDP {
	constructor (config = {}) {
		this.servers = new Map();
		this.clients = new Map();

		this.config = {
			...config,
		};
	}

	/* Client management */
	connect({ host, port } = {}) {
		const client = new UDPClient({ host, port });
		if(!this.clients.has(client.id)) {
			this.clients.set(client.id, client);

			console.log(`Client connected with ID ${ client.id }`);
		}
	}
	disconnect(id) {
		const client = this.clients.get(id);
		if(client) {
			client.close();

			this.clients.delete(id);

			console.log(`Closed client connection with ID ${ id }`);
		}
	}

	/* Server management */
	start({ port, router, config = {} }) {
		const server = new UDPServer({ port, router, config });

		server.start();

		this.servers.set(server.id, server);

		console.log(`Server started with ID ${ server.id }`);
	}
	stop(id) {
		const server = this.servers.get(id);
		if(server) {
			server.server.close();

			this.servers.delete(id);

			console.log(`Server with ID ${ id } stopped`);
		}
	}

	shutdown() {
		this.servers.forEach(server => {
			server.server.close();

			console.log(`Server with ID ${ server.id } stopped`);
		});
		this.servers.clear();

		this.clients.forEach(client => {
			client.close();

			console.log(`Client with ID ${ client.id } closed`);
		});
		this.clients.clear();
	}

	/* Communication */
	send(fromId, message) {
		const client = this.clients.get(fromId);
		if(client) {
			client.send(message);
		} else {
			console.error(`No client found with ID ${ fromId }`);
		}
	}

	broadcast(message) {
		this.clients.forEach(client => {
			client.send(message);
		});
	}
}

export default DuplexUDP;