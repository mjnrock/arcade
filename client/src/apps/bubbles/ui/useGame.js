import React, { useEffect, useRef } from "react";
import main from "../main";

export const useGame = (containerRef, mainArgs = {}) => {
	const gameInstance = useRef(null);

	useEffect(() => {
		const startGame = async () => {
			if(!containerRef.current) return;
			const { game } = await main({
				...mainArgs,
				viewport: containerRef.current,
			});

			gameInstance.current = game;
		};

		startGame();

		return () => {
			gameInstance.current?.stop();
		};
	}, [ containerRef ]);

	return gameInstance;
};

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useGame(pixiContainer);

	return <div ref={ pixiContainer } style={ { width: "100%", height: "100%" } }></div>;
};

export default Bubble;