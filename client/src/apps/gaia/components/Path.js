import Geometry from "../../../modules/core/lib/geometry/Geometry";

export class Path {
	constructor ({ index = 0, points = [] } = {}) {
		this.points = points;
		this.index = index;

		this.addPoint(...arguments);
	}

	get current() {
		return this.points[ this.index ];

	}
	setIndex(index) {
		this.index = index % this.points.length;

		return this;
	}
	resetIndex() {
		this.index = 0;

		return this;
	}

	addPoint(...points) {
		for(const point of points) {
			if(point instanceof Geometry) {
				this.points.push(point);
			}
		}

		return this;
	}
	removePoint(point) {
		const index = this.points.indexOf(point);

		if(index > -1) {
			this.points.splice(index, 1);
		}

		return this;
	}
	clearPoints() {
		this.points = [];

		return this;
	}
};

export default Path;