// frontend.js
let renderer;
let gameLoop;

const setupPanel = document.getElementById("setup-panel");
const startSimulationBtn = document.getElementById("start-simulation-btn");

startSimulationBtn.addEventListener("click", (e) => {
	e.preventDefault();
	setupPanel.style.display = "none";
	_canvasSetup();
});

document
	.getElementById("draw-polygon-cards-btn")
	.addEventListener("click", (e) => {
		e.preventDefault();
		const polygonsNumber = Math.min(
			20,
			parseInt(document.getElementById("polygons").value, 10),
		);
		_drawPolygonCards(polygonsNumber);
	});

function _canvasSetup() {
	const gridW = parseInt(document.getElementById("gridW").value, 10);
	const gridH = parseInt(document.getElementById("gridH").value, 10);
	const tAmb = parseFloat(document.getElementById("tAmb").value);
	const polygons = Math.min(
		20,
		parseInt(document.getElementById("polygons").value, 10),
	);
	const canvas = document.getElementById("canvas");
	canvas.style.display = "block";
	canvas.width = 1000;
	canvas.height = 1000;

	const cellWidth = canvas.width / gridW;
	const cellHeight = canvas.height / gridH;

	const fields = [
		"centroX",
		"centroY",
		"raio",
		"angulo",
		"lados",
		"temperatura",
	];

	const polygonData = Array.from({ length: polygons }, (_, i) =>
		Object.fromEntries(
			fields.map((field) => [
				field,
				parseFloat(document.getElementById(`${field}-${i}`).value),
			]),
		),
	);
	const polygonInfo = { count: polygons, polygons: polygonData };
	renderer = new Renderer(canvas);
	initSimulation(
		gridW,
		gridH,
		tAmb,
		cellWidth,
		cellHeight,
		renderer,
		polygonInfo,
	);

	cancelAnimationFrame(gameLoop);
	gameLoop = requestAnimationFrame(loop);
}
function _drawPolygonCards(polyNum) {
	const container = document.getElementById("polygon-cards-container");
	container.innerHTML = "";

	const fields = [
		{ name: "centroX", label: "Centro X", min: 0, value: 0, max: 1000 },
		{ name: "centroY", label: "Centro Y", min: 0, value: 0, max: 1000 },
		{ name: "raio", label: "Raio", min: 0, value: 25, max: 600 },
		{ name: "angulo", label: "Ângulo", min: 0, value: 0, max: 360 },
		{ name: "lados", label: "Lados", min: 3, value: 3, max: 16 },
		{ name: "temperatura", label: "Temperatura", min: 0, value: 0, max: 100 },
	];

	for (let i = 0; i < polyNum; i++) {
		const card = document.createElement("div");
		card.classList.add("polygon-card");

		const title = document.createElement("h3");
		title.textContent = `Poligono ${i + 1}`;
		card.appendChild(title);

		for (const field of fields) {
			const id = `${field.name}-${i}`;

			const group = document.createElement("div");
			group.classList.add("field-group");

			const label = document.createElement("label");
			label.htmlFor = id;
			label.textContent = field.label;

			const input = document.createElement("input");
			input.type = "number";
			input.name = field.name;
			input.id = id;
			input.min = field.min;
			input.max = field.max;
			input.value = field.value;

			group.appendChild(label);
			group.appendChild(input);
			card.appendChild(group);
		}

		container.appendChild(card);
	}
}
function loop() {
	const before = getGridSnapshot();
	if (stepSimulation(before)) {
		console.log("Parou");
		return;
	}
	gameLoop = requestAnimationFrame(loop);
}
