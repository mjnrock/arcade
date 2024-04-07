import System from "../../core/lib/message/System";

import BubbleComponent from "../components/Bubble";
import BubbleEntity from "../entities/Bubble";

export class EntitySystem extends System {
	constructor({ game } = {}) {
		super({ game });
	}

	update({ game, dt } = {}) {
		for (const entity of game.currentWorld?.entityManager) {
			if (entity.isDead && (Math.random() < 0.25)) {
				// Generate a random number between 1 and 3 for the audio file selection
				const randomNum = Math.floor(Math.random() * 3) + 1;

				// Generate a random volume between 25% (0.25) and 100% (1.0)
				const randomVolume = Math.random() * 0.75 + 0.25;

				/* Relative path will resolve to /public/...` without further modification */
				const filePath = `./assets/audio/pop${randomNum}.mp3`;

				const audio = new Audio(filePath);
				audio.volume = randomVolume;
				audio
					.play()
					.catch(console.error);
			}
		}
	}
}

export default EntitySystem;
