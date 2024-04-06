import React, { useEffect, useRef } from "react";
import main from "../../../bubbles/main";

export const useGame = ({ ...args } = {}) => {
	const gameInstance = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		const startGame = async () => {
			if(!containerRef.current) return;
			const { game } = await main({ ...args });

			gameInstance.current = game;
		};

		startGame();

		if(gameInstance.current && gameInstance.appendChild) {
			gameInstance.current?.appendChild(gameInstance.current?.pixi?.view);
		}

		return () => {
			gameInstance.current?.stop();
		};
	}, [ containerRef ]);

	return {
		game: gameInstance.current,
		viewport: (<div ref={ containerRef } style={ { width: "100%", height: "100%", overflow: "hidden" } } />),
	};
};

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useGame(pixiContainer);

	return <div ref={ pixiContainer } style={ { width: "100%", height: "100%" } }></div>;
};

export default Bubble;