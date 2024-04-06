import { useGame } from "./useGame";

export const Bubble = () => {
	const { game, viewport } = useGame({
		start: true,
		config: {
			width: window.innerWidth,
			height: window.innerHeight,
			loop: {
				fps: 60,
			},
		},
	});

	return (
		<>
			{
				viewport
			}
		</>
	)
};

export default Bubble;