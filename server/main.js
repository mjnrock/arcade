import WebSocketServer from "./lib/ws/WebSocketServer.js";
import Router from "./lib/message/Router.js";
import ArcadeInput from "./lib/hid/ArcadeInput.js";

import ArcadeInputSystem from "./ArcadeInputSystem.js";

const game = {
	router: null,
	systems: {
		ArcadeInputSystem: null,
	},

	input: {
		arcade: new ArcadeInput({
			vid: 121,
			pid: 6,
		}),
	},
};

game.router = new Router({
	game,
	network: null,
});
game.router.network = new WebSocketServer({
	port: 8080,
	router: game.router.receive.bind(game.router),
});

game.systems.ArcadeInputSystem = new ArcadeInputSystem({ game });