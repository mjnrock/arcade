import { v4 as uuid } from 'uuid';

export class GameLoop {
	constructor ({ onTick, onDraw, fps = 60 } = {}) {
		this.id = uuid();

		this.onTick = onTick;
		this.onDraw = onDraw;
		this.fps = fps;
		this.accumulatedTime = 0;
		this.lastTime = 0;
		this.animationFrameRequest = null;

		this.isRunning = false;

		this.ticks = 0;
		this.draws = 0;
	}

	get spf() {
		return 1000 / this.fps;
	}

	start() {
		this.lastTime = performance.now();
		this.isRunning = true;
		this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
	}

	stop() {
		this.isRunning = false;
		cancelAnimationFrame(this.animationFrameRequest);
	}

	pause() {
		this.isRunning = false;
	}

	resume() {
		if(!this.isRunning) {
			this.isRunning = true;
			this.lastTime = performance.now(); // Update lastTime to avoid time jump
			this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
		}
	}

	loop(currentTime) {
		if(!this.isRunning) {
			return; // Stop the loop from running when the game is paused
		}

		const deltaTime = currentTime - this.lastTime;
		this.lastTime = currentTime;
		this.accumulatedTime += deltaTime;

		if(this.accumulatedTime >= this.spf) {
			this.onTick(this.spf);
			/* Drop all extra time to prevent rapid catch-ups */
			this.accumulatedTime = 0;
			this.ticks++;
		}

		/* This tells you how far between the last tick and the next tick you are, between 0 and 1 */
		const frameInterpolation = this.accumulatedTime / this.spf;
		this.onDraw(deltaTime, frameInterpolation);
		this.draws++;

		this.animationFrameRequest = requestAnimationFrame(this.loop.bind(this));
	}
};

export default GameLoop;