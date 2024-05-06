import { useGame } from "../core/react/hooks/useGame";

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
			config: {
				world: {
					viewport: {
						txr: 5,
						tyr: 5,
					},
				},
			}
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