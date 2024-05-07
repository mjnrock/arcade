export const CollisionHelper = {
	collisionFunctions: {
		"Circle:Circle": (...args) => this.circleToCircle(...args),
		"Circle:Rectangle": (...args) => this.rectangleToCircle(...args),
		"Rectangle:Rectangle": (...args) => this.rectangleToRectangle(...args),
		"Polygon:Polygon": (...args) => this.polygonToPolygon(...args),
		"Triangle:Triangle": (...args) => this.polygonToPolygon(...args), // Assuming Triangle is a Polygon
		"Triangle:Polygon": (...args) => this.polygonToPolygon(...args),
		"Polygon:Triangle": (...args) => this.polygonToPolygon(...args)
	},

	collide(shape1, shape2) {
		const key1 = `${ shape1.constructor.name }:${ shape2.constructor.name }`;
		const key2 = `${ shape2.constructor.name }:${ shape1.constructor.name }`;

		const func = this.collisionFunctions[ key1 ] ?? this.collisionFunctions[ key2 ];
		if(func) {
			return func(shape1, shape2);
		}

		throw new Error(`Collision detection not supported for ${ shape1.constructor.name } and ${ shape2.constructor.name }`);
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
		// Using Separating Axis Theorem (SAT) for polygons
		return this._SAT(poly1.vertices, poly2.vertices);
	},

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