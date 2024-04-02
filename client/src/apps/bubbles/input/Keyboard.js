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
	constructor ({ game, map, target = window }) {
		this.game = game;
		this.map = map;
		this.mask = 0;
		this.target = target;

		this.bindEvents();
	}

	bindEvents() {
		/* .mask facilitation logic */
		this.target.addEventListener("keydown", this.handleKeyDown.bind(this));
		this.target.addEventListener("keyup", this.handleKeyUp.bind(this));

		Object.entries(this.map).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.addEventListener(eventName, handler.bind(this));
			});
		});
	}

	detachListeners() {
		/* .mask facilitation logic */
		this.target.removeEventListener("keydown", this.handleKeyDown.bind(this));
		this.target.removeEventListener("keyup", this.handleKeyUp.bind(this));

		Object.entries(this.map).forEach(([ eventName, handlers ]) => {
			const normalizedHandlers = Array.isArray(handlers) ? handlers : [ handlers ];
			normalizedHandlers.forEach(handler => {
				this.target.removeEventListener(eventName, handler.bind(this));
			});
		});
	}

	handleKeyDown(event) {
		const maskKey = KeyMaskMap[ event.code ];
		if(maskKey) {
			this.mask |= maskKey;
		}
	}

	handleKeyUp(event) {
		const maskKey = KeyMaskMap[ event.code ];
		if(maskKey) {
			this.mask &= ~maskKey;
		}
	}

	isKeyDown(key) {
		return (this.mask & MaskKeys[ key ]) !== 0;
	}
};

export default Keyboard;