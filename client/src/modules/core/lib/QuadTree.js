import EnumComponentType from "../components/EnumComponentType";

/* Enhanced QuadTree implementation for large-scale entity management */
export class QuadTree {
	constructor (level, bounds, maxObjects = 100, maxLevels = 500) {
		this.level = level;
		this.bounds = bounds;
		this.objects = [];
		this.nodes = Array(4).fill(null);
		this.MAX_OBJECTS = maxObjects;
		this.MAX_LEVELS = maxLevels;
	}

	clear() {
		this.objects = [];
		this.nodes.forEach(node => node?.clear());
		this.nodes.fill(null);
	}

	split() {
		const { x, y, width, height } = this.bounds;
		const subWidth = width / 2;
		const subHeight = height / 2;

		this.nodes[ 0 ] = new QuadTree(this.level + 1, { x: x + subWidth, y, width: subWidth, height: subHeight });
		this.nodes[ 1 ] = new QuadTree(this.level + 1, { x, y, width: subWidth, height: subHeight });
		this.nodes[ 2 ] = new QuadTree(this.level + 1, { x, y: y + subHeight, width: subWidth, height: subHeight });
		this.nodes[ 3 ] = new QuadTree(this.level + 1, { x: x + subWidth, y: y + subHeight, width: subWidth, height: subHeight });
	}

	getIndex({ x, y, width, height } = {}) {
		const verticalMidpoint = this.bounds.x + (this.bounds.width / 2);
		const horizontalMidpoint = this.bounds.y + (this.bounds.height / 2);
		const topQuadrant = y < horizontalMidpoint && (y + height) < horizontalMidpoint;
		const bottomQuadrant = y > horizontalMidpoint;

		if(x < verticalMidpoint && (x + width) < verticalMidpoint) {
			return topQuadrant ? 1 : (bottomQuadrant ? 2 : -1);
		} else if(x > verticalMidpoint) {
			return topQuadrant ? 0 : (bottomQuadrant ? 3 : -1);
		}
		return -1;
	}

	insert(entity) {
		const model = entity.getComponent(EnumComponentType.Physics).model;
		if(this.nodes[ 0 ]) {
			const index = this.getIndex(model);
			if(index !== -1) {
				this.nodes[ index ].insert(entity);
				return;
			}
		}

		this.objects.push(entity);

		if(this.objects.length > this.MAX_OBJECTS && this.level < this.MAX_LEVELS) {
			if(!this.nodes[ 0 ]) this.split();

			let i = 0;
			while(i < this.objects.length) {
				const index = this.getIndex(this.objects[ i ].getComponent(EnumComponentType.Physics).model);
				if(index !== -1) {
					const [ removedEntity ] = this.objects.splice(i, 1);
					this.nodes[ index ].insert(removedEntity);
				} else {
					i++;
				}
			}
		}
	}

	retrieve(returnObjects, entity) {
		const model = entity.getComponent(EnumComponentType.Physics).model;
		const index = this.getIndex(model);
		if(index !== -1 && this.nodes[ 0 ]) {
			this.nodes[ index ].retrieve(returnObjects, entity);
		}
		returnObjects.push(...this.objects);
	}
}

export default QuadTree;