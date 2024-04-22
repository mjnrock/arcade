const MaskKeys = {
	LEFT: 1 << 1,	// 2
	RIGHT: 1 << 2,  // 4
	UP: 1 << 3,     // 8
	DOWN: 1 << 4,   // 16
	CTRL: 1 << 5,   // 32
	SHIFT: 1 << 6,  // 64
	ALT: 1 << 7,    // 128
	SPACE: 1 << 8,  // 256
};

const KeyMaskMap = {
	ArrowLeft: MaskKeys.LEFT,
	ArrowRight: MaskKeys.RIGHT,
	ArrowUp: MaskKeys.UP,
	ArrowDown: MaskKeys.DOWN,
	KeyA: MaskKeys.LEFT,
	KeyD: MaskKeys.RIGHT,
	KeyW: MaskKeys.UP,
	KeyS: MaskKeys.DOWN,
	ControlLeft: MaskKeys.CTRL,
	ControlRight: MaskKeys.CTRL,
	Control: MaskKeys.CTRL,
	ShiftLeft: MaskKeys.SHIFT,
	ShiftRight: MaskKeys.SHIFT,
	Shift: MaskKeys.SHIFT,
	AltLeft: MaskKeys.ALT,
	AltRight: MaskKeys.ALT,
	Alt: MaskKeys.ALT,
	Space: MaskKeys.SPACE,
};

export class Keyboard {
	constructor ({ game, events = {}, target = window }) {
		this.game = game;
		this.events = events;
		this.mask = 0;
		this.target = target;
		this.state = {};

		this.bindEvents(true);
	}

	bindEvents(bindAll = false, map = {}) {
		if(bindAll) {
			this.target.addEventListener("keydown", this.handleKeyDown.bind(this));
			this.target.addEventListener("keyup", this.handleKeyUp.bind(this));
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
		this.target.removeEventListener("keydown", this.handleKeyDown.bind(this));
		this.target.removeEventListener("keyup", this.handleKeyUp.bind(this));

		Object.entries(this.events).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.removeEventListener(eventName, handler);
			});
		});
	}

	handleKeyDown(event) {
		const maskKey = KeyMaskMap[ event.code ];
		if(maskKey) {
			this.mask |= maskKey;
		}

		this.state[ event.code ] = true;
	}

	handleKeyUp(event) {
		const maskKey = KeyMaskMap[ event.code ];
		if(maskKey) {
			this.mask &= ~maskKey;
		}

		this.state[ event.code ] = false;
	}

	has(keyCode) {
		return !!this.state[ keyCode ];
	}
	hasFlag(key) {
		return (this.mask & MaskKeys[ key ]) !== 0;
	}
};

export default Keyboard;