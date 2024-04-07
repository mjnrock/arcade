import System from "../../core/lib/message/System";

export class EntitySystem extends System {
	constructor({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		for (const entity of game.currentWorld?.entityManager) {
			if (entity.isDead) {
				// Generate a random number between 1 and 3 for the audio file selection
				const randomNum = Math.floor(Math.random() * 3) + 1;
				/* Relative path will resolve to /public/...` without further modification */
				const filePath = `./assets/audio/pop${randomNum}.mp3`;

				let randomVolume = Math.random().toFixed(2);
				if (Math.random() < 0.6) {
					randomVolume = 0.05;
				}

				const audio = new Audio(filePath);
				audio.volume = randomVolume;
				audio.play().catch(console.error);
			}
		}
	}
}

export default EntitySystem;
