import { useState, useEffect } from "react";
import { Stage, Graphics } from "@pixi/react";

import useGameLogic from "./hooks/useGameLogic";

export const App = () => {
	const bubbles = useGameLogic({
		qty: 100,
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [ dimensions, setDimensions ] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		const handleResize = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<Stage width={ dimensions.width } height={ dimensions.height } options={ { background: 0x1099bb } }>
			{ bubbles.map((bubble, index) => (
				<Graphics key={ index } draw={ g => bubble.render({ g }) } />
			)) }
		</Stage>
	);
};

export default App;