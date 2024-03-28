import { useState, useEffect, useCallback, useRef } from "react";
import Bubble from "../bubbles/Bubble";

export const useGameLogic = ({
	qty = 50,
	width = 800,
	height = 600,
} = {}) => {
	const [ bubbles, setBubbles ] = useState([]);
	const bubblesRef = useRef(bubbles);
	const requestRef = useRef();

	useEffect(() => {
		bubblesRef.current = bubbles;
	}, [ bubbles ]);

	const addBubbleAtPosition = useCallback(({ x, y }) => {
		const newBubble = new Bubble({
			x,
			y,
			vx: (Math.random() - 0.5) * 4,
			vy: (Math.random() - 0.5) * 4,
			r: Math.random() * 50 + 5,
			color: `#${ Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0") }`,
		});
		setBubbles(bubbles => [ ...bubbles, newBubble ]);
	}, []);

	const checkForCollision = useCallback(({ x, y } = {}) => {
		const currentBubbles = bubblesRef.current;
		const collisionIndex = currentBubbles.findIndex(bubble => {
			const dx = x - bubble.x;
			const dy = y - bubble.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			return distance <= bubble.r;
		});

		if(collisionIndex >= 0) {
			// Remove the collided bubble
			setBubbles(bubbles => bubbles.filter((_, index) => index !== collisionIndex));
			return true;
		}
		return false;
	}, []);

	let lastTime = 0;
	const animate = useCallback((currentTime) => {
		requestRef.current = requestAnimationFrame(animate);
		const delta = (currentTime - lastTime) * 0.01;
		lastTime = currentTime;

		const now = Date.now();
		setBubbles(bubbles => bubbles.reduce((acc, bubble) => {
			if(now <= bubble.meta.ts + bubble.meta.ttl) {
				bubble.update({ dt: delta });
				acc.push(bubble);
			}
			return acc;
		}, []));
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

		return () => {
			cancelAnimationFrame(requestRef.current);
		};
	}, [ qty, width, height, animate ]);

	return { bubbles, addBubbleAtPosition, checkForCollision };
};

export default useGameLogic;