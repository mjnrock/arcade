const MouseButtons = {
	LEFT: 1 << 0,   // 1
	MIDDLE: 1 << 1, // 2
	RIGHT: 1 << 2,  // 4
};

const ButtonMaskMap = {
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

		this.bindEvents(true);
	}

	bindEvents(bindAll = false, map = {}) {
		if(bindAll) {
			/* .mask facilitation logic */
			this.target.addEventListener("mousedown", this.handleMouseDown.bind(this));
			this.target.addEventListener("mouseup", this.handleMouseUp.bind(this));
			this.target.addEventListener("contextmenu", this.handleContextMenu.bind(this));
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

		Object.entries(this.events).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.removeEventListener(eventName, handler);
			});
		});
	}

	handleMouseDown(event) {
		const maskButton = ButtonMaskMap[ event.button ];
		if(maskButton) {
			this.mask |= maskButton;
		}
	}

	handleMouseUp(event) {
		const maskButton = ButtonMaskMap[ event.button ];
		if(maskButton) {
			this.mask &= ~maskButton;
		}
	}

	handleContextMenu(event) {
		event.preventDefault();
	}

	isButtonDown(button) {
		return (this.mask & MouseButtons[ button ]) !== 0;
	}
};

export default Mouse;