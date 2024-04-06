import { useGame } from "../core/react/hooks/useGame";

export const Viewport = () => {
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

export default Viewport;