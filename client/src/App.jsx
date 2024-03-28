// App.jsx
import React, { useState, useEffect } from "react";
import { Stage, Graphics } from "@pixi/react";
import useGameLogic from "./hooks/useGameLogic";
import { keyEventToGridMiddleware } from "./util/keyboardToGrid";

export const App = () => {
	const { bubbles, addBubbleAtPosition } = useGameLogic({
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

		// Keyboard event listener
		const handleKeyPress = (event) => {
			event.preventDefault();
			event.stopPropagation();

			const gridCoordinates = keyEventToGridMiddleware(event);
			if(gridCoordinates) {
				// Calculate screen position based on grid coordinates and screen size
				const x = (dimensions.width / 16) * (gridCoordinates[ 1 ] + 0.5); // 16 columns
				const y = (dimensions.height / 7) * (gridCoordinates[ 0 ] + 0.5); // 7 rows
				addBubbleAtPosition({ x, y });
			}
		};

		window.addEventListener("keydown", handleKeyPress);

		return () => {
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("keydown", handleKeyPress);
		};
	}, [ dimensions, addBubbleAtPosition ]);

	return (
		<Stage width={ dimensions.width } height={ dimensions.height } options={ { background: 0x1099bb } }>
			{ bubbles.map((bubble, index) => (
				<Graphics key={ index } draw={ (g) => bubble.render({ g }) } />
			)) }
		</Stage>
	);
};

export default App;