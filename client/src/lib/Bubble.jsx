import React, { useEffect, useRef } from "react";
import BubbleGame from "./Game";
import BubbleEntity from "./entities/Bubble";
import World from "./World";

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useEffect(() => {
		const game = new BubbleGame();
		const ent1 = new BubbleEntity();
		const world = new World({
			game,
			entities: [ ent1 ],
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