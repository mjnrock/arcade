import DuplexUDP from "./DuplexUDP.js";

function logReceivedMessage(instanceName) {
	return message => {
		console.log(`${ instanceName } received message: ${ message }`);
	};
}

async function initializeServers(ports) {
	const servers = [];
	for(let i = 0; i < ports.length; i++) {
		const duplex = new DuplexUDP();
		const serverConfig = {
			port: ports[ i ],
			router: logReceivedMessage(`Instance${ i + 1 }`),
		};
		duplex.start(serverConfig);
		servers.push(duplex);
		// Wait for the server to be up
		await new Promise(resolve => setTimeout(resolve, 100));
	}
	return servers;
}

async function establishConnections(servers, ports) {
	for(let i = 0; i < servers.length; i++) {
		// Connect to other instances, excluding own port
		const targetPorts = ports.filter((_, index) => index !== i);
		for(const targetPort of targetPorts) {
			servers[ i ].connect({ host: "localhost", port: targetPort });
			await new Promise(resolve => setTimeout(resolve, 100)); // Ensure connections are established properly
		}
	}
}

async function sendMessageBetweenInstances(servers) {
	for(let i = 0; i < servers.length; i++) {
		const clientIDs = Array.from(servers[ i ].clients.keys());
		for(const clientID of clientIDs) {
			servers[ i ].send(clientID, `Hello from Instance${ i + 1 }`);
		}
	}
	// Wait for messages to be sent and logged
	await new Promise(resolve => setTimeout(resolve, 1000));
}

async function shutdownServers(servers) {
	servers.forEach(server => server.shutdown());
}

async function testMultipleDuplexUDP() {
	const ports = [ 12345, 12346, 12347 ];

	const servers = await initializeServers(ports);
	await establishConnections(servers, ports);
	await sendMessageBetweenInstances(servers);
	shutdownServers(servers);

	console.log("Test completed.");
}

testMultipleDuplexUDP()
	.catch(err => console.error("Test failed:", err));