/** biome-ignore-all lint/correctness/useParseIntRadix: <explanation> */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
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
	constructor(x, y, temp, width, height) {
		this.x = x;
		this.y = y;
		this.temp = temp;
		this.width = width;
		this.height = height;
	}
	draw(renderer) {
		renderer.drawCell(
			this.x * this.width,
			this.y * this.height,
			this.width,
			this.height,
			"red",
		); // mudar red pelo resultado de getColor
	}
	getColor() {}
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
	}
	update() {
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
		return !(maxDifference < precision);
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
