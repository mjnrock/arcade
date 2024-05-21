export const MouseButtons = {
	LEFT: 1 << 0,   // 1
	MIDDLE: 1 << 1, // 2
	RIGHT: 1 << 2,  // 4
};

export const ButtonMaskMap = {
	0: MouseButtons.LEFT,
	1: MouseButtons.MIDDLE,
	2: MouseButtons.RIGHT,
};

export class Mouse {
	constructor ({ game, events = {}, target = window }) {
		this.game = game;
		this.events = events;
		this.mask = 0;
		this.target = target;

		this.x = null;
		this.y = null;

		this.bindEvents(true);
	}

	bindEvents(bindAll = false, map = {}) {
		if(bindAll) {
			/* .mask facilitation logic */
			this.target.addEventListener("mousedown", this.handleMouseDown.bind(this));
			this.target.addEventListener("mouseup", this.handleMouseUp.bind(this));
			this.target.addEventListener("contextmenu", this.handleContextMenu.bind(this));
			this.target.addEventListener("mousemove", this.handleMouseMove.bind(this));
		}

		if(Object.keys(map).length) {
			this.events = {
				...this.events,
				...map,
			};
		}

		Object.entries(this.events).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.addEventListener(eventName, handler);
			});
		});
	}

	detachListeners() {
		/* .mask facilitation logic */
		this.target.removeEventListener("mousedown", this.handleMouseDown.bind(this));
		this.target.removeEventListener("mouseup", this.handleMouseUp.bind(this));
		this.target.removeEventListener("contextmenu", this.handleContextMenu.bind(this));
		this.target.removeEventListener("mousemove", this.handleMouseMove.bind(this));

		Object.entries(this.events).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.removeEventListener(eventName, handler);
			});
		});
	}

	handleMouseMove(event) {
		this.x = event.clientX;
		this.y = event.clientY;
	}
	handleMouseDown(event) {
		const maskButton = ButtonMaskMap[ event.button ];
		if(maskButton) {
			this.mask |= maskButton;
			this.x = event.clientX;
			this.y = event.clientY;
		}
	}

	handleMouseUp(event) {
		const maskButton = ButtonMaskMap[ event.button ];
		if(maskButton) {
			this.mask &= ~maskButton;
			this.x = null;
			this.y = null;
		}
	}

	handleContextMenu(event) {
		event.preventDefault();
	}

	isButtonDown(button) {
		return (this.mask & MouseButtons[ button ]) !== 0;
	}

	get pos() {
		return { x: this.x, y: this.y };
	}

	has(button) {
		return (this.mask & MouseButtons[ button ]) !== 0;
	}
	hasFlag(button) {
		return (this.mask & MouseButtons[ button ]) !== 0;
	}
};

export default Mouse;