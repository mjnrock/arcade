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
	constructor ({ game, map, target = window }) {
		this.game = game;
		this.map = map;
		this.mask = 0;
		this.target = target;

		this.bindEvents();
	}

	bindEvents() {
		/* .mask facilitation logic */
		this.target.addEventListener("mousedown", this.handleMouseDown.bind(this));
		this.target.addEventListener("mouseup", this.handleMouseUp.bind(this));
		this.target.addEventListener("contextmenu", this.handleContextMenu.bind(this));

		Object.entries(this.map).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.addEventListener(eventName, handler.bind(this));
			});
		});
	}

	detachListeners() {
		/* .mask facilitation logic */
		this.target.removeEventListener("mousedown", this.handleMouseDown.bind(this));
		this.target.removeEventListener("mouseup", this.handleMouseUp.bind(this));
		this.target.removeEventListener("contextmenu", this.handleContextMenu.bind(this));

		Object.entries(this.map).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.removeEventListener(eventName, handler.bind(this));
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
		if(this.mask & MouseButtons.RIGHT) {
			event.preventDefault();
		}
	}

	isButtonDown(button) {
		return (this.mask & MouseButtons[ button ]) !== 0;
	}
};

export default Mouse;