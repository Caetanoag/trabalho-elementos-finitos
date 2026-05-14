/** biome-ignore-all lint/correctness/useParseIntRadix: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
class Color {
	constructor(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	getString() {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}
	static sumColors(color1, color2) {
		return new Color(
			Math.min(color1.r + color2.r, 255),
			Math.min(color1.g + color2.g, 255),
			Math.min(color1.b + color2.b, 255),
		);
	}
}
class Polygon {
	constructor(centerX, centerY, radius, angle, sides, temp) {
		this.centerX = centerX;
		this.centerY = centerY;
		this.radius = radius;
		this.angle = angle;
		this.sides = sides;
		this.temp = temp;
	}
}
class Cell {
	constructor(x, y, temp, width, height, minTemp, maxTemp) {
		this.x = x;
		this.y = y;
		this.oldTemp = temp;
		this.temp = temp;
		this.width = width;
		this.height = height;
		this.minTemp = minTemp;
		this.maxTemp = maxTemp;
		this.isInsidePolygon = false;
		this.color = new Color(0, 0, 0);
	}
	draw(renderer) {
		renderer.drawCell(
			this.x * this.width,
			this.y * this.height,
			this.width,
			this.height,
			this.getColor(),
		);
	}
	getColor() {
		if (this.isInsidePolygon) return this.color.getString();

		const t = (this.temp - this.minTemp) / (this.maxTemp - this.minTemp);
		if (t < 0.01) return "black";

		if (this.temp < this.maxTemp / 3) {
			this.color = Color.sumColors(this.color, new Color(8, 0, 0));
		} else if (this.temp < (this.maxTemp * 2) / 3) {
			this.color = Color.sumColors(this.color, new Color(0, 8, 0));
		} else {
			this.color = Color.sumColors(this.color, new Color(8, 8, 8));
		}
		return this.color.getString();
	}
}
class Grid {
	constructor(width, height, cellWidth, cellHeight, tAmb, renderer) {
		this.width = width;
		this.height = height;
		this.cellWidth = cellWidth;
		this.cellHeight = cellHeight;
		this.tAmb = tAmb;
		this.renderer = renderer;

		this.grid = [];
		this.polygons = [];
	}
	setup() {
		this.grid = Array.from({ length: this.height }, (_, i) =>
			Array.from({ length: this.width }, (_, j) => {
				return new Cell(i, j, this.tAmb, this.cellWidth, this.cellHeight);
			}),
		);
		const polygonSize = parseInt(prompt("Diga a quantidade de poligonos"));

		for (let i = 0; i < polygonSize; i++) {
			this.polygons.push(
				new Polygon(
					parseInt(prompt("Diga o centroX do poligono")),
					parseInt(prompt("Diga o centroY do poligono")),
					parseInt(prompt("Diga o raio do poligono")),
					parseFloat(prompt("Diga o angulo do poligono")),
					parseInt(prompt("Diga a quantidade de lados do poligono")),
					parseFloat(prompt("Diga a temperatura do poligono")),
				),
			);
		}
		const maxTemp = Math.max(...this.polygons.map((p) => p.temp));

		this.grid = Array.from({ length: this.height }, (_, i) =>
			Array.from(
				{ length: this.width },
				(_, j) =>
					new Cell(
						i,
						j,
						this.tAmb,
						this.cellWidth,
						this.cellHeight,
						this.tAmb,
						maxTemp,
					),
			),
		);
		for (const polygon of this.polygons) {
			for (const row of this.grid) {
				for (const cell of row) {
					if (this.isCellInside(cell, polygon)) {
						cell.temp = polygon.temp;
						cell.oldTemp = polygon.temp;
						cell.isInsidePolygon = true;
						if (polygon.temp >= (maxTemp * 2) / 3) {
							cell.color = new Color(255, 255, 255);
						} else if (polygon.temp >= maxTemp / 3) {
							cell.color = new Color(0, 255, 0);
						} else {
							cell.color = new Color(255, 0, 0);
						}
					}
				}
			}
		}
	}
	update() {
		const temps = [];
		for (const row of this.grid) {
			for (const cell of row) {
				temps.push(cell.isInsidePolygon ? cell.temp : this.getNextTemp(cell));
			}
		}
		for (let i = 0; i < this.grid.length; i++) {
			for (let j = 0; j < this.grid[0].length; j++) {
				this.grid[i][j].oldTemp = this.grid[i][j].temp;
				this.grid[i][j].temp = temps[i * this.width + j];
			}
		}
	}
	draw() {
		for (const row of this.grid) {
			for (const cell of row) {
				cell.draw(this.renderer);
			}
		}
	}
	needsToStop(beforeArr, afterArr, precision) {
		let maxDifference = -Infinity;
		for (let i = 0; i < beforeArr.length; i++) {
			for (let j = 0; j < beforeArr[0].length; j++) {
				if (afterArr[i][j].temp - beforeArr[i][j].temp > maxDifference) {
					maxDifference = afterArr[i][j].temp - beforeArr[i][j].temp;
				}
			}
		}
		return maxDifference < precision;
	}
	getNextTemp(cell) {
		const x = cell.x;
		const y = cell.y;

		return (
			(this.grid[x + 1 * (x < this.grid.length - 1)][y].temp +
				this.grid[x - 1 * (x > 0)][y].temp +
				this.grid[x][y + 1 * (y < this.grid[0].length - 1)].temp +
				this.grid[x][y - 1 * (y > 0)].temp) /
			4
		);
	}
	isCellInside(cell, polygon) {
		const { centerX, centerY, radius, sides, angle } = polygon;
		const vertices = [];
		const px = cell.x * cell.width + cell.width / 2;
		const py = cell.y * cell.height + cell.height / 2;
		for (let i = 0; i < sides; i++) {
			const a = angle + (Math.PI * 2 * i) / sides;
			vertices.push({
				x: centerX + Math.cos(a) * radius,
				y: centerY + Math.sin(a) * radius,
			});
		}
		let dentro = false;
		for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
			const xi = vertices[i].x;
			const yi = vertices[i].y;
			const xj = vertices[j].x;
			const yj = vertices[j].y;
			const cruza =
				yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
			if (cruza) dentro = !dentro;
		}
		return dentro;
	}
}
class Renderer {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
	}
	drawCell(x, y, width, height, color) {
		this.context.fillStyle = color;
		this.context.fillRect(x, y, width, height);
	}
	drawPolygon(_polygon) {}
}
