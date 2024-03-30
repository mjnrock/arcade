import { useState, useEffect } from "react";
import { Stage, Graphics } from "@pixi/react";
import { throttle } from "lodash";

import useGameLogic from "../hooks/useGameLogic";
import { keyEventToGridMiddleware } from "../util/keyboardToGrid";

export const Bubbles = () => {
	const { bubbles, initAudioAndLoadSound, addBubbleAtPosition, checkForCollision } = useGameLogic({
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

		const throttledHandleKeyPress = throttle((event) => {
			event.preventDefault();
			event.stopPropagation();

			const gridCoordinates = keyEventToGridMiddleware(event);
			if(gridCoordinates) {
				const x = (dimensions.width / 16) * (gridCoordinates[ 1 ] + 0.5);
				const y = (dimensions.height / 7) * (gridCoordinates[ 0 ] + 0.5);
				addBubbleAtPosition({ x, y });
			}
		}, 50);

		const handleKeyPress = (event) => {
			throttledHandleKeyPress(event);
		};

		window.addEventListener("keydown", handleKeyPress);

		const throttledAddBubble = throttle((e) => {
			addBubbleAtPosition({ x: e.clientX, y: e.clientY });
		}, 50);

		const paintBubble = (e) => {
			if(e.buttons === 1) {
				throttledAddBubble(e);
			} else if(e.buttons === 2) {
				checkForCollision({ x: e.clientX, y: e.clientY });
			}
		};

		const disableKeyboard = (e) => {
			e.preventDefault();
		};

		window.addEventListener("keydown", disableKeyboard, true);
		window.addEventListener("keypress", disableKeyboard, true);
		const handleContextMenu = (e) => e.preventDefault();

		window.addEventListener("contextmenu", handleContextMenu);
		window.addEventListener("mousedown", paintBubble);
		window.addEventListener("mousemove", paintBubble);

		return () => {
			window.removeEventListener("contextmenu", handleContextMenu);
			window.removeEventListener("resize", handleResize);
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("mousedown", paintBubble);
			window.removeEventListener("mousemove", paintBubble);

			window.removeEventListener("keydown", disableKeyboard, true);
			window.removeEventListener("keypress", disableKeyboard, true);
		};
	}, [ dimensions, addBubbleAtPosition ]);

	return (
		<>
			<button onClick={ initAudioAndLoadSound }>Start Game</button>
			<Stage width={ dimensions.width } height={ dimensions.height } options={ { background: 0x1099bb } }>
				{ bubbles.map((bubble, index) => (
					<Graphics key={ index } draw={ (g) => bubble.render({ g }) } />
				)) }
			</Stage>
		</>
	);
};

export default Bubbles;