export const keyboardGridMapping = {
	// Function keys row
	"Escape": [ 0, 0 ], "F1": [ 0, 1 ], "F2": [ 0, 2 ], "F3": [ 0, 3 ], "F4": [ 0, 4 ], "F5": [ 0, 5 ], "F6": [ 0, 6 ], "F7": [ 0, 7 ], "F8": [ 0, 8 ], "F9": [ 0, 9 ], "F10": [ 0, 10 ], "F11": [ 0, 11 ], "F12": [ 0, 12 ], "PrintScreen": [ 0, 13 ], "ScrollLock": [ 0, 14 ], "Pause": [ 0, 15 ],
	// Main keys section row 1 (numbers)
	"`": [ 1, 0 ], "1": [ 1, 1 ], "2": [ 1, 2 ], "3": [ 1, 3 ], "4": [ 1, 4 ], "5": [ 1, 5 ], "6": [ 1, 6 ], "7": [ 1, 7 ], "8": [ 1, 8 ], "9": [ 1, 9 ], "0": [ 1, 10 ], "-": [ 1, 11 ], "=": [ 1, 12 ], "Backspace": [ 1, 13 ],
	// Main keys section row 2
	"Tab": [ 2, 0 ], "Q": [ 2, 1 ], "W": [ 2, 2 ], "E": [ 2, 3 ], "R": [ 2, 4 ], "T": [ 2, 5 ], "Y": [ 2, 6 ], "U": [ 2, 7 ], "I": [ 2, 8 ], "O": [ 2, 9 ], "P": [ 2, 10 ], "[": [ 2, 11 ], "]": [ 2, 12 ], "\\": [ 2, 13 ],
	// Main keys section row 3
	"CapsLock": [ 3, 0 ], "A": [ 3, 1 ], "S": [ 3, 2 ], "D": [ 3, 3 ], "F": [ 3, 4 ], "G": [ 3, 5 ], "H": [ 3, 6 ], "J": [ 3, 7 ], "K": [ 3, 8 ], "L": [ 3, 9 ], ";": [ 3, 10 ], "'": [ 3, 11 ], "Enter": [ 3, 12 ],
	// Main keys section row 4
	"Shift": [ 4, 0 ], "Z": [ 4, 1 ], "X": [ 4, 2 ], "C": [ 4, 3 ], "V": [ 4, 4 ], "B": [ 4, 5 ], "N": [ 4, 6 ], "M": [ 4, 7 ], ",": [ 4, 8 ], ".": [ 4, 9 ], "/": [ 4, 10 ], "ShiftRight": [ 4, 11 ],
	// Main keys section row 5 (space row)
	"Control": [ 5, 0 ], "Meta": [ 5, 1 ], "Alt": [ 5, 2 ], "Space": [ 5, 3, 4, 5, 6 ], "AltRight": [ 5, 7 ], "ContextMenu": [ 5, 8 ], "ControlRight": [ 5, 9 ],
	// Arrow keys
	"ArrowLeft": [ 6, 0 ], "ArrowUp": [ 6, 1 ], "ArrowDown": [ 6, 2 ], "ArrowRight": [ 6, 3 ],
	// Numeric keypad
	"NumLock": [ 1, 16 ], "NumpadDivide": [ 1, 17 ], "NumpadMultiply": [ 1, 18 ], "NumpadSubtract": [ 1, 19 ], "Numpad7": [ 2, 16 ], "Numpad8": [ 2, 17 ], "Numpad9": [ 2, 18 ], "NumpadAdd": [ 2, 19 ], "Numpad4": [ 3, 16 ], "Numpad5": [ 3, 17 ], "Numpad6": [ 3, 18 ], "Numpad1": [ 4, 16 ], "Numpad2": [ 4, 17 ], "Numpad3": [ 4, 18 ], "NumpadEnter": [ 4, 19 ], "Numpad0": [ 5, 16 ], "NumpadDecimal": [ 5, 17 ],
	// Additional navigational and control keys
	"Insert": [ 1, 14 ], "Home": [ 1, 15 ], "PageUp": [ 2, 14 ], "Delete": [ 2, 15 ], "End": [ 3, 14 ], "PageDown": [ 3, 15 ]
};

/**
 * Register this as a key event handler
 */
export function keyEventToGridMiddleware(event) {
	const key = event.key;
	const gridCoordinates = getGridCoordinates(key) ?? null;

	return gridCoordinates;
};

export function getGridCoordinates(key) {	
	let gridCoordinates = keyboardGridMapping[ key ] ?? null;
	if(!gridCoordinates) {
		gridCoordinates = keyboardGridMapping[ key.toLowerCase() ] ?? keyboardGridMapping[ key.toUpperCase() ];
	}

	return gridCoordinates;
};


export default {
	keyboardGridMapping,
	keyEventToGridMiddleware,
	getGridCoordinates,
};