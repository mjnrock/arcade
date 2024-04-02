import { UDPServer } from "./UDPServer.js";
import { UDPClient } from "./UDPClient.js";

const server = new UDPServer({ port: 41234 });
server.start();

const client = new UDPClient({ host: "localhost", port: 41234 });

function sendMessages() {
	client.send("Hello, UDP server!");
	client.send("Another message");
	client.send("Final message");

	setTimeout(() => {
		client.close();
	}, 1000);
}

sendMessages();