import { v4 as uuid } from 'uuid';

export class GameLoop {
	constructor (updateCallback, renderCallback, fps = 60) {
		this.id = uuid();

		this.updateCallback = updateCallback;
		this.renderCallback = renderCallback;
		this.fps = fps;
		this.updateInterval = 1000 / fps;
		this.accumulatedTime = 0;
		this.lastTime = 0;
		this.animationFrameRequest = null;
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
			this.updateCallback(this.updateInterval);
			this.accumulatedTime -= this.updateInterval;
		}

		this.renderCallback();
		this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
	}
};

export default GameLoop;