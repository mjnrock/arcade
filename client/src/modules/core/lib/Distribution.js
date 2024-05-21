export const Distribution = {
	/* Normal (Gaussian) distribution */
	normal: ({ mean = 0, sigma = 1 } = {}) => {
		let u = 0, v = 0;
		while(u === 0) u = Math.random();
		while(v === 0) v = Math.random();
		let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
		return num * sigma + mean;
	},

	/* Exponential distribution */
	exponential: ({ lambda = 1 } = {}) => {
		return -Math.log(1.0 - Math.random()) / lambda;
	},

	/* Poisson distribution */
	poisson: ({ lambda = 1 } = {}) => {
		let l = Math.exp(-lambda);
		let k = 0;
		let p = 1;
		do {
			k++;
			p *= Math.random();
		} while(p > l);
		return k - 1;
	},

	/* Binomial distribution */
	binomial: ({ n = 1, p = 0.5 } = {}) => {
		let count = 0;
		for(let i = 0; i < n; i++) {
			if(Math.random() < p) {
				count++;
			}
		}
		return count;
	},

	/* Geometric distribution */
	geometric: ({ p = 0.5 } = {}) => {
		return Math.floor(Math.log(Math.random()) / Math.log(1 - p));
	},

	/* Uniform distribution */
	uniform: ({ min = 0, max = 1 } = {}) => {
		return Math.random() * (max - min) + min;
	},

	/* Shuffle - Fisher-Yates (Knuth) shuffle */
	shuffle: ({ array } = {}) => {
		array = array.slice();
		for(let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[ array[ i ], array[ j ] ] = [ array[ j ], array[ i ] ];
		}
		return array;
	}
};

export default Distribution;  