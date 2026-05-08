class Polygon{
    constructor(centerX, centerY, radius, angle, sides, temp){
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.angle = angle;
        this.sides = sides;
        this.temp = temp;
    }
}

function needsToStop(beforeArr, afterArr, precision){
    const maxCellTemp = {
        maxDiference: -Infinity,
        i: 0,
        j: 0
    }
    for(let i = 0; i < beforeArr.length; i++){
        for(let j = 0; j < beforeArr[0].length; j++){
            if((afterArr[i][j].temp - beforeArr[i][j].temp) > maxDiference){
                maxCellTemp.maxDiference = afterArr[i][j].temp - beforeArr[i][j].temp;
                maxCellTemp.i = i;
                maxCellTemp.j = j;
            }
        }
    }
    return !(maxCellTemp.maxDiference < precision);
}
const gridW = parseInt(prompt("Defina a largura da matriz"));
const gridH = parseInt(prompt("Defina a altura da matriz"));
const tAmb = parseFloat(prompt("Defina a temperatura ambiente"));
const polygonSize = parseInt(prompt("Diga a quantidade de poligonos"));
const matriz = Array.from({length: gridH}).fill(Array.from({length: gridW}).fill(0))
const polygons = [];

for(let i = 0; i < polygonSize; i++){
    polygons.push(
        new Polygon(
            parseInt(prompt("Diga o centroX do poligono")),
            parseInt(prompt("Diga o centroY do poligono")),
            parseInt(prompt("Diga o raio do poligono")),
            parseFloat(prompt("Diga o angulo do poligono")),
            parseInt(prompt("Diga a quantidade de lados do poligono")),
            parseFloat(prompt("Diga a temperatura do poligono"))
        )
    )
}


/**
 * Renderizar uma simulação de temperatura
 * 
 * Renderização             Calculo
 *     Degrade de cores          
 *     Grade de temperatura
 * 
 */