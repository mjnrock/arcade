import { Stage } from "@pixi/react";

import BubbleGraphics from "./BubbleGraphics.jsx";
import useGameLogic from "./useGameLogic.js";

export const App = () => {
	const bubbles = useGameLogic();

	return (
		<Stage width={ 800 } height={ 600 } options={ { background: 0x1099bb } }>
			{ bubbles.map((bubble, index) => (
				<BubbleGraphics key={ index } bubble={ bubble } />
			)) }
		</Stage>
	);
};

export default App;