import { UDPServer } from "./UDPServer.js";
import { UDPClient } from "./UDPClient.js";

const server = new UDPServer({ port: 41234 });
server.start();

const client = new UDPClient({ host: "localhost", port: 41234 });

function sendMessages() {
	client.sendMessage("Hello, UDP server!");
	client.sendMessage("Another message");
	client.sendMessage("Final message");

	setTimeout(() => {
		client.close();
	}, 1000);
}

sendMessages();