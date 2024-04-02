import React, { useEffect, useRef } from "react";
import main from "../main";

import BubbleComponent from "../components/Bubble";
import BubbleEntity from "../entities/Bubble";

export const useGame = (containerRef, mainArgs = {}) => {
	const gameInstance = useRef(null);

	useEffect(() => {
		const startGame = async () => {
			if(!containerRef.current) return;
			const { game } = await main({
				...mainArgs,
				viewport: containerRef.current,
			});

			game.input.mouse.bindEvents(false, {
				mousemove: [
					event => {
						if(event.buttons !== 1) return;

						const bubbles = BubbleEntity.Factory(1, () => ({
							meta: {
								ttl: 1000 * (Math.random() * 1 + 1),
							},
							components: [
								new BubbleComponent({
									x: event.clientX,
									y: event.clientY,
									vx: (Math.random() - 0.5) * 200,
									vy: (Math.random() - 0.5) * 200,
									r: Math.random() * 30 + 5,
									color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
								}),
							],
						}));

						gameInstance.current.currentWorld?.addEntity(...bubbles);
					},
				],
			});

			gameInstance.current = game;
		};

		startGame();

		return () => {
			gameInstance.current?.stop();
		};
	}, [ containerRef ]);

	return {
		game: gameInstance.current,
	};
};

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useGame(pixiContainer);

	return <div ref={ pixiContainer } style={ { width: "100%", height: "100%" } }></div>;
};

export default Bubble;