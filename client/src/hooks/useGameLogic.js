import { useState, useEffect } from "react";
import Bubble from "../bubbles/Bubble";

export const useGameLogic = ({
	qty = 50,
	width = 800,
	height = 600,
} = {}) => {
	const [ bubbles, setBubbles ] = useState([]);

	useEffect(() => {
		// Initialize bubbles
		const newBubbles = Array.from({ length: qty }).map(() => new Bubble({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 2,
			vy: (Math.random() - 0.5) * 2,
			r: Math.random() * 20 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`
		}));

		setBubbles(newBubbles);

		// Animation Loop
		let lastTime = 0;
		const animate = (currentTime) => {
			requestAnimationFrame(animate);
			const delta = (currentTime - lastTime) * 0.01;
			lastTime = currentTime;

			setBubbles(bubbles => bubbles.map(bubble => {
				bubble.update({ dt: delta });
				return bubble;
			}));
		};

		requestAnimationFrame(animate);

		// Cleanup function to stop the animation loop
		return () => {
			lastTime = 0;
		};
	}, [ qty, width, height ]);

	return bubbles;
};

export default useGameLogic;