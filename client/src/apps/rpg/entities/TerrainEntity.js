import LivingEntity from "./LivingEntity";

export class TerrainEntity extends LivingEntity {
	constructor ({ x, y, tw, th, color, ...props } = {}) {
		super({
			...props,
			physics: {
				x,
				y,
				vx: 0,
				vy: 0,

				model: {
					type: "rect",
					w: tw,
					h: th,
				},
				...(props.physics ?? {}),
			},
			animus: {
				color,
				...(props.animus ?? {}),
			},
		});
	}
};

export default LivingEntity;