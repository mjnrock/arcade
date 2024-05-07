export const EnumFacing = {
	NORTH: 0,
	EAST: 90,
	SOUTH: 180,
	WEST: 270,
	NORTH_EAST: 45,
	SOUTH_EAST: 135,
	SOUTH_WEST: 225,
	NORTH_WEST: 315,
};

export const FacingMatrix = {
	[ EnumFacing.NORTH ]: [ 0, -1 ],
	[ EnumFacing.EAST ]: [ 1, 0 ],
	[ EnumFacing.SOUTH ]: [ 0, 1 ],
	[ EnumFacing.WEST ]: [ -1, 0 ],
	[ EnumFacing.NORTH_EAST ]: [ 1, -1 ],
	[ EnumFacing.NORTH_WEST ]: [ -1, -1 ],
	[ EnumFacing.SOUTH_EAST ]: [ 1, 1 ],
	[ EnumFacing.SOUTH_WEST ]: [ -1, 1 ]
};

/* Clockwise-rotation matrix from North */
/* NOTE: It does not follow the same order as EnumFacing */
export const FacingMatrixNormal = [
	[ 0, -1 ],
	[ 1, -1 ],
	[ 1, 0 ],
	[ 1, 1 ],
	[ 0, 1 ],
	[ -1, 1 ],
	[ -1, 0 ],
	[ -1, -1 ]
];


export default EnumFacing;