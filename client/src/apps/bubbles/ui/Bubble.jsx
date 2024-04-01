import React, { useEffect, useRef } from "react";

import main from "../main";

export const Bubble = () => {
	const pixiContainer = useRef(null);

	useEffect(() => {
		const { game } = main({
			viewport: pixiContainer.current,
		})

		return () => {
			game.stop();
		};
	}, []);


	return <div ref={ pixiContainer } style={ { width: "100%", height: "100%" } }></div>;
};

export default Bubble;