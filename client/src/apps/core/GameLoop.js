import { v4 as uuid } from 'uuid';

export class GameLoop {
	constructor ({ onTick, onDraw, fps = 60 } = {}) {
		this.id = uuid();

		this.onTick = onTick;
		this.onDraw = onDraw;
		this.fps = fps;
		this.updateInterval = 1000 / fps;
		this.accumulatedTime = 0;
		this.lastTime = 0;
		this.animationFrameRequest = null;

		this.ticks = 0;
		this.draws = 0;
	}

	start() {
		this.lastTime = performance.now();
		this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
	}

	stop() {
		cancelAnimationFrame(this.animationFrameRequest);
	}

	loop(currentTime) {
		const deltaTime = currentTime - this.lastTime;
		this.lastTime = currentTime;
		this.accumulatedTime += deltaTime;

		while(this.accumulatedTime >= this.updateInterval) {
			this.onTick(this.updateInterval);
			this.accumulatedTime -= this.updateInterval;
			this.ticks++;
		}

		this.onDraw(deltaTime, this.accumulatedTime / this.updateInterval);	// Pass the accumulated time ratio to the draw , this.gamefunction
		this.draws++;
		this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
	}
};

export default GameLoop;