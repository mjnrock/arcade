import CoreGame from "../core/Game";

export class RPG extends CoreGame {
	constructor ({ config = {}, ...args } = {}) {
		super({
			...args,
		});
	}
};

export default RPG;