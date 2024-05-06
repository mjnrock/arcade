import { useGame } from "../../modules/core/react/hooks/useGame";

import { main } from "./main";

export const Viewport = () => {
	const { game, viewport } = useGame(main, {
		start: true,
		settings: {
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