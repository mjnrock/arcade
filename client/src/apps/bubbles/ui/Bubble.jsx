import React, { useRef } from "react";
import { useGame } from "./useGame";

export const Bubble = () => {
	const pixiContainer = useRef(null);
	const instance = useGame(pixiContainer, {
		start: true,
		config: {
			fps: 60,
			width: window.innerWidth,
			height: window.innerHeight,
		},
	});

	return <div ref={ pixiContainer } style={ { width: "100%", height: "100%", overflow: "hidden" } }></div>;
};

export default Bubble;