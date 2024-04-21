import PhysicsComponent from "../../core/components/Physics";

export class Player extends PhysicsComponent {
	constructor ({ id, x, y, vx, vy, r } = {}) {
		super({ id, x, y, vx, vy, r });
	}
}

export default Player;
