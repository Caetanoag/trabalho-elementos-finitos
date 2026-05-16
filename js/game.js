// gameLogic.js
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
let grid;

function initSimulation(
	gridW,
	gridH,
	tAmb,
	cellWidth,
	cellHeight,
	renderer,
	polygonsInfo,
) {
	grid = new Grid(
		gridW,
		gridH,
		cellWidth,
		cellHeight,
		tAmb,
		renderer,
		{
			x: cellWidth,
			y: cellHeight,
		},
		polygonsInfo,
	);
	grid.setup();
}

function stepSimulation(before) {
	grid.update();
	grid.draw();
	return grid.needsToStop(before, grid.grid, 0.01);
}

function getGridSnapshot() {
	return grid.grid.map((row) => row.map((c) => ({ temp: c.temp })));
}
