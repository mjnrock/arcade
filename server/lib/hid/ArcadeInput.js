import HID from "node-hid";

export const defaultJoystickMapping = {
	UP: buffer => buffer[ 1 ] === 0xff,
	DOWN: buffer => buffer[ 1 ] === 0x00,
	LEFT: buffer => buffer[ 0 ] === 0xff,
	RIGHT: buffer => buffer[ 0 ] === 0x00,
};

export const defaultButtonMapping = {
	K1: buffer => (buffer[ 5 ] & 0x10) !== 0,
	K2: buffer => (buffer[ 5 ] & 0x20) !== 0,
	K3: buffer => (buffer[ 5 ] & 0x40) !== 0,
	K4: buffer => (buffer[ 5 ] & 0x80) !== 0,
	SE: buffer => (buffer[ 6 ] & 0x10) !== 0,
	ST: buffer => (buffer[ 6 ] & 0x20) !== 0,
	K11: buffer => (buffer[ 6 ] & 0x40) !== 0,
	K12: buffer => (buffer[ 6 ] & 0x80) !== 0,
};

export class ArcadeInput {
	constructor ({ vid, pid, joystick = defaultJoystickMapping, buttons = defaultButtonMapping } = {}) {
		this.vid = vid;
		this.pid = pid;

		this.maps = {
			joystick: joystick,
			buttons: buttons,
		};

		this.state = null;
		this.listeners = [];

		this.device = null;
		this.initDevice();
	}

	hasJoystick(dir) {
		return this.state.joystick[ dir.toUpperCase() ];
	}
	hasButton(dir) {
		return this.state.buttons[ dir.toUpperCase() ];
	}

	initDevice() {
		const devices = HID.devices();
		const deviceInfo = devices.find(d => d.vendorId === this.vid && d.productId === this.pid);

		if(!deviceInfo) {
			console.log("Device not found");
			return;
		}

		this.device = new HID.HID(deviceInfo.path);
		this.device.on("data", this.handleData.bind(this));
		this.device.on("error", console.error);
	}

	handleData(buffer) {
		const parsed = this.parseBuffer(buffer);
		if(this.hasStateChanged(parsed)) {
			this.state = parsed;
			this.listeners.forEach(listener => listener({ state: this.state, self: this }));
		}
	}

	parseBuffer(buffer) {
		const joystick = Object.entries(this.maps.joystick).reduce((acc, [ key, func ]) => {
			acc[ key ] = func(buffer);
			return acc;
		}, {});

		const buttons = Object.entries(this.maps.buttons).reduce((acc, [ key, func ]) => {
			acc[ key ] = func(buffer);
			return acc;
		}, {});

		return { joystick, buttons };
	}

	hasStateChanged(newState) {
		return JSON.stringify(newState) !== JSON.stringify(this.state);
	}

	addListener(listener) {
		this.listeners.push(listener);
	}

	removeListener(listener) {
		const index = this.listeners.indexOf(listener);
		if(index > -1) {
			this.listeners.splice(index, 1);
		}
	}
};

export default ArcadeInput;