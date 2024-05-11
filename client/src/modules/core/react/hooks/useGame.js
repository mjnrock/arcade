import React, { useEffect, useRef, useState } from "react";

export const useGame = (main, { ...args } = {}) => {
	const [ forceRender, setForceRender ] = useState(0);
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

		setForceRender(forceRender + 1);

		return () => {
			gameInstance.current?.stop();
		};
	}, [ containerRef ]);

	return {
		game: gameInstance.current,
		viewport: (<div ref={ containerRef } style={ { width: "100%", height: "100%", overflow: "hidden" } } />),
	};
};

export default useGame;