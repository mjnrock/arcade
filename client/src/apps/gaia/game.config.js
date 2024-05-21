import EnumResourceType from "./components/EnumResourceType";

export const UIConfig = {
	[ EnumResourceType.Health ]: {
		showBar: true,
		thresholds: [
			[ 0.8, "#306630" ],
			[ 0.65, "#339933" ],
			[ 0.35, "#FFCC33" ],
			[ 0.15, "#FF9933" ],
			[ 0, "#FF5555" ],
		],
		ox: 0,
		oy: -5,
		width: 24,
		height: 6,
	},
	[ EnumResourceType.Mana ]: {
		showBar: true,
		thresholds: [
			[ 0.75, "#333366" ],
			[ 0.5, "#555588" ],
			[ 0.25, "#9999CC" ],
			[ 0, "#CCCCFF" ],
		],
		ox: 0,
		oy: -2,
		width: 20,
		height: 3,
	},
};

export const WorldConfig = {
	tileWidth: 32,
	tileHeight: 32,
	zoom: 4,
	viewport: {
		tx: 0,
		ty: 0,
		txr: 25,
		tyr: 25,
	},
};

export const Config = {
	settings: {
		/* If enabled, locks facing to the joystick direction */
		arcadeMode: false,
		/* Difficulty level, as a scaling factor */
		difficulty: 1,
	},

	/* UI configuration for resources */
	ui: {
		...UIConfig,
	},

	/* World tile configuration */
	world: {
		...WorldConfig,
	},
};

export default Config;