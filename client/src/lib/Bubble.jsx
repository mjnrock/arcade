import React, { useEffect, useRef } from "react";

import BubbleGame from "./Game";
import World from "./World";

import BubbleComponent from "./components/Bubble";
import BubbleEntity from "./entities/Bubble";

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useEffect(() => {
		const game = new BubbleGame();
		const world = new World({
			game,
			entities: Array(100).fill().map(() => new BubbleEntity({
				components: [
					[ BubbleComponent, {
						x: Math.random() * window.innerWidth,
						y: Math.random() * window.innerHeight,
						vx: (Math.random() - 0.5) * 200,
						vy: (Math.random() - 0.5) * 200,
						r: Math.random() * 20 + 5,
						color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
					} ],
				]
			})),
		});

		game.addWorld(world);
		game.start();

		if(pixiContainer.current) {
			pixiContainer.current.appendChild(game.pixi.view);
		}

		return () => {
			game.stop();
		};
	}, []);


	return <div ref={ pixiContainer } style={ { width: '100%', height: '100%' } }></div>;
};

export default Bubble;