import { Graphics } from "@pixi/react";

export const BubbleGraphics = ({ bubble }) => {
	// const draw = (g) => {
	// 	g.clear();
	// 	g.beginFill(bubble.color, 1);
	// 	g.drawCircle(bubble.x, bubble.y, bubble.r);
	// 	g.endFill();
	// };

	return <Graphics draw={ g => bubble.render({ g }) } />;
};

export default BubbleGraphics;