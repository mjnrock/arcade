export const isWithinTolerance = (a, b, tolerance = 0.025) => {
	return Math.abs(a - b) <= tolerance;
};

export default {
	isWithinTolerance,
};