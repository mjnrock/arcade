export const CollisionHelper = {
	collisionFunctions: {
		"Line:Line": (...args) => CollisionHelper.lineToLine(...args),
		"Circle:Line": (...args) => CollisionHelper.lineToCircle(...args),
		"Circle:Circle": (...args) => CollisionHelper.circleToCircle(...args),
		"Circle:Rectangle": (...args) => CollisionHelper.rectangleToCircle(...args),
		"Rectangle:Line": (...args) => CollisionHelper.lineToRectangle(...args),
		"Rectangle:Rectangle": (...args) => CollisionHelper.rectangleToRectangle(...args),
		"Polygon:Line": (...args) => CollisionHelper.lineToPolygon(...args),
		"Polygon:Polygon": (...args) => CollisionHelper.polygonToPolygon(...args),
		"Triangle:Line": (...args) => CollisionHelper.lineToTriangle(...args),
		"Triangle:Triangle": (...args) => CollisionHelper.polygonToPolygon(...args),
		"Triangle:Polygon": (...args) => CollisionHelper.polygonToPolygon(...args),
	},

	collide(shape1, shape2) {
		const key1 = `${ shape1.constructor.name }:${ shape2.constructor.name }`;
		const key2 = `${ shape2.constructor.name }:${ shape1.constructor.name }`;

		const func = CollisionHelper.collisionFunctions[ key1 ] ?? CollisionHelper.collisionFunctions[ key2 ];
		if(func) {
			return func(shape1, shape2);
		}

		throw new Error(`Collision detection not supported for ${ shape1.constructor.name } and ${ shape2.constructor.name }`);
	},

	lineToLine(line1, line2) {
		const { x, y, x2, y2 } = line1;
		const { x: x3, y: y3, x2: x4, y2: y4 } = line2;

		const denominator = (y4 - y3) * (x2 - x) - (x4 - x3) * (y2 - y);
		if(denominator === 0) {
			return false;
		}

		let a = y - y3;
		let b = x - x3;
		const numerator1 = (x4 - x3) * a - (y4 - y3) * b;
		const numerator2 = (x2 - x) * a - (y2 - y) * b;
		a = numerator1 / denominator;
		b = numerator2 / denominator;

		return a > 0 && a < 1 && b > 0 && b < 1;
	},
	lineToRectangle(line, rect) {
		const { x, y, x2, y2 } = line;
		const { x: rx, y: ry, width, height } = rect;

		// Check if the line intersects any of the rectangle's sides
		const left = CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: rx, y: ry, x2: rx, y2: ry + height });
		const right = CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: rx + width, y: ry, x2: rx + width, y2: ry + height });
		const top = CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: rx, y: ry, x2: rx + width, y2: ry });
		const bottom = CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: rx, y: ry + height, x2: rx + width, y2: ry + height });

		return left || right || top || bottom;
	},
	lineToCircle(line, circle) {
		const { x, y, x2, y2 } = line;
		const { x: cx, y: cy, radius } = circle;

		const dx = x2 - x;
		const dy = y2 - y;
		const fx = x - cx;
		const fy = y - cy;

		const a = dx * dx + dy * dy;
		const b = 2 * (fx * dx + fy * dy);
		const c = fx * fx + fy * fy - radius * radius;

		const discriminant = b * b - 4 * a * c;
		if(discriminant < 0) {
			return false;
		}

		const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
		const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

		return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
	},
	lineToTriangle(line, triangle) {
		const { x, y, x2, y2 } = line;
		const { vertices } = triangle;

		for(let i = 0; i < vertices.length; i++) {
			const next = (i + 1) % vertices.length;
			if(CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: vertices[ i ].x, y: vertices[ i ].y, x2: vertices[ next ].x, y2: vertices[ next ].y })) {
				return true;
			}
		}

		return false;
	},
	lineToPolygon(line, polygon) {
		const { x, y, x2, y2 } = line;
		const { vertices } = polygon;

		for(let i = 0; i < vertices.length; i++) {
			const next = (i + 1) % vertices.length;
			if(CollisionHelper.lineToLine({ x, y, x2, y2 }, { x: vertices[ i ].x, y: vertices[ i ].y, x2: vertices[ next ].x, y2: vertices[ next ].y })) {
				return true;
			}
		}

		return false;
	},

	rectangleToRectangle(rect1, rect2) {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y
		);
	},

	circleToCircle(circle1, circle2) {
		const dx = circle1.x - circle2.x;
		const dy = circle1.y - circle2.y;
		const distance = Math.sqrt(dx * dx + dy * dy);
		return distance < (circle1.radius + circle2.radius);
	},

	rectangleToCircle(rect, circle) {
		const distX = Math.abs(circle.x - rect.x - rect.width / 2);
		const distY = Math.abs(circle.y - rect.y - rect.height / 2);

		if(distX > (rect.width / 2 + circle.radius)) { return false; }
		if(distY > (rect.height / 2 + circle.radius)) { return false; }

		if(distX <= (rect.width / 2)) { return true; }
		if(distY <= (rect.height / 2)) { return true; }

		const dx = distX - rect.width / 2;
		const dy = distY - rect.height / 2;
		return (dx * dx + dy * dy <= (circle.radius * circle.radius));
	},

	polygonToPolygon(poly1, poly2) {
		return this._SAT(poly1.vertices, poly2.vertices);
	},

	/* Separating Axis Theorem (SAT) for polygons */
	_SAT(vertices1, vertices2) {
		const normals = [ ...this._getNormals(vertices1), ...this._getNormals(vertices2) ];
		for(const normal of normals) {
			const proj1 = this._project(vertices1, normal);
			const proj2 = this._project(vertices2, normal);
			if(proj1[ 1 ] < proj2[ 0 ] || proj2[ 1 ] < proj1[ 0 ]) {
				return false; // There is no overlap
			}
		}
		return true; // All projections overlap
	},

	_getNormals(vertices) {
		const normals = [];
		for(let i = 0; i < vertices.length; i++) {
			const next = (i + 1) % vertices.length;
			const edge = { x: vertices[ next ].x - vertices[ i ].x, y: vertices[ next ].y - vertices[ i ].y };
			const normal = { x: edge.y, y: -edge.x };
			normals.push(normal);
		}
		return normals;
	},

	_project(vertices, axis) {
		let min = Infinity;
		let max = -Infinity;
		for(const vertex of vertices) {
			const projection = vertex.x * axis.x + vertex.y * axis.y;
			min = Math.min(min, projection);
			max = Math.max(max, projection);
		}
		return [ min, max ];
	}
};

export default CollisionHelper;