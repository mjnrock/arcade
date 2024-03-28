// useGameLogic.js
import { useState, useEffect, useCallback, useRef } from "react";
import Bubble from "../bubbles/Bubble";

export const useGameLogic = ({
	qty = 50,
	width = 800,
	height = 600,
} = {}) => {
	const [ bubbles, setBubbles ] = useState([]);
	const requestRef = useRef();

	// Function to add a bubble at a specific position
	const addBubbleAtPosition = useCallback(({ x, y }) => {
		const newBubble = new Bubble({
			x,
			y,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			r: Math.random() * 20 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		});
		setBubbles(bubbles => [ ...bubbles, newBubble ]);
	}, []);

	// Animation Loop
	let lastTime = 0;
	const animate = useCallback((currentTime) => {
		requestRef.current = requestAnimationFrame(animate);
		const delta = (currentTime - lastTime) * 0.01;
		lastTime = currentTime;

		setBubbles(bubbles => bubbles.map(bubble => {
			bubble.update({ dt: delta });
			return bubble;
		}));
	}, []);

	useEffect(() => {
		setBubbles(Array.from({ length: qty }).map(() => new Bubble({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			r: Math.random() * 20 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		})));

		requestRef.current = requestAnimationFrame(animate);

		// Cleanup function to stop the animation loop
		return () => {
			cancelAnimationFrame(requestRef.current);
		};
	}, [ qty, width, height, animate ]);

	return { bubbles, addBubbleAtPosition };
};

export default useGameLogic;