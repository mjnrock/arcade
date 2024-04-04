import WebSocketServer from "./WebSocketServer.js";
import WebSocketClient from "./WebSocketClient.js";

const port = 8080;

// Define router function for server message handling
const serverRouter = (msg) => console.log(`Server received: ${ msg }`);

// Initialize WebSocket Server
const server = new WebSocketServer({ port, router: serverRouter });

// Client message handler
const clientRouter = (msg) => console.log(`Client received: ${ msg }`);

// Function to simulate a client connecting and sending a message
const simulateClient = () => {
	const client = new WebSocketClient({
		url: `ws://localhost:${ port }`,
		router: clientRouter,
	});

	setTimeout(() => {
		client.send("Hello from client!");
		// Close client connection after sending a message for simplicity
		// In real scenarios, you might want to keep the connection open or handle it differently
		client.ws.close();
	}, 1000);
};

simulateClient();

// Example of broadcasting a message to all clients from the server
setTimeout(() => {
	server.broadcast("Hello from server to all clients!");
}, 2000);

// Add additional logic for teardown as needed, depending on your test environment