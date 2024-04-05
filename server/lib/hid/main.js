// import HID from "node-hid";

// console.log("==============================");
// console.log("           New Context        ");
// console.log("==============================");

// const parseBuffer = (buffer) => {
// 	const joystick = {
// 		UP: buffer[ 1 ] === 0xff,
// 		DOWN: buffer[ 1 ] === 0x00,
// 		LEFT: buffer[ 0 ] === 0xff,
// 		RIGHT: buffer[ 0 ] === 0x00,
// 	};

// 	const buttons = {
// 		K1: (buffer[ 5 ] & 0x10) !== 0,
// 		K2: (buffer[ 5 ] & 0x20) !== 0,
// 		K3: (buffer[ 5 ] & 0x40) !== 0,
// 		K4: (buffer[ 5 ] & 0x80) !== 0,
// 		SE: (buffer[ 6 ] & 0x10) !== 0,
// 		ST: (buffer[ 6 ] & 0x20) !== 0,
// 		K11: (buffer[ 6 ] & 0x40) !== 0,
// 		K12: (buffer[ 6 ] & 0x80) !== 0,
// 	};

// 	return { joystick, buttons };
// };

// const main = async () => {
// 	const devices = HID.devices();
// 	devices.forEach(({ vendorId, productId, manufacturer, product }) => {
// 		console.log({ vendorId, productId, manufacturer, product });
// 	});

// 	const vendorId = 121;
// 	const productId = 6;

// 	const deviceInfo = devices.find(d => d.vendorId === vendorId && d.productId === productId);

// 	if(!deviceInfo) {
// 		console.log("Device not found");
// 		return;
// 	}

// 	const device = new HID.HID(deviceInfo.path);

// 	device.on("data", (buffer) => {
// 		const parsed = parseBuffer(buffer);
// 		console.clear();
// 		console.log(buffer);
// 		console.log(parsed);
// 	});

// 	device.on("error", console.error);
// };

// main().catch(console.error);