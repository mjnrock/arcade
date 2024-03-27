export class Bubble {
	constructor ({ x, y, radius, color } = {}) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
	}

	update({ dt, vx = 0.0, vy = 0.0 } = {}) {
		this.x += vx * dt;
		this.y += vy * dt;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
	}
};

export default Bubble;