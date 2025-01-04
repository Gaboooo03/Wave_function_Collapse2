let slider;
const celdas = [];
let RETICULAx = 8;
let RETICULAy;
let ancho, alto;

const azulejos = [];
const numA = 30; // Número de azulejos

const reglas = [
  { UP: 0, RIGHT: 1, DOWN: 5, LEFT: 0 }, //tile0
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, //tile1
  { UP: 0, RIGHT: 7, DOWN: 5, LEFT: 0 }, //tile2
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 7 }, //tile3
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, //tile4
  { UP: 5, RIGHT: 7, DOWN: 0, LEFT: 0 }, //tile5
  { UP: 0, RIGHT: 0, DOWN: 6, LEFT: 7 }, //tile6
  { UP: 5, RIGHT: 7, DOWN: 0, LEFT: 0 }, //tile7
  { UP: 0, RIGHT: 4, DOWN: 0, LEFT: 7 }, //tile8
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 4 }, //tile9
  { UP: 0, RIGHT: 7, DOWN: 5, LEFT: 0 }, //tile10
  { UP: 6, RIGHT: 0, DOWN: 0, LEFT: 7 }, //tile11
  { UP: 0, RIGHT: 2, DOWN: 0, LEFT: 0 }, //tile12
  { UP: 0, RIGHT: 4, DOWN: 0, LEFT: 2 }, //tile13
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 4 }, //tile14
  { UP: 5, RIGHT: 4, DOWN: 0, LEFT: 0 }, //tile15
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 4 }, //tile16
  { UP: 0, RIGHT: 3, DOWN: 0, LEFT: 0 }, //tile17
  { UP: 0, RIGHT: 1, DOWN: 0, LEFT: 3 }, //tile18
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, //tile19
  { UP: 0, RIGHT: 2, DOWN: 0, LEFT: 0 }, //tile20
  { UP: 0, RIGHT: 7, DOWN: 0, LEFT: 2 }, //tile21
  { UP: 0, RIGHT: 0, DOWN: 6, LEFT: 7 }, //tile22
  { UP: 0, RIGHT: 1, DOWN: 5, LEFT: 0 }, //tile23
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 1 }, //tile24
  { UP: 0, RIGHT: 3, DOWN: 0, LEFT: 0 }, //tile25
  { UP: 0, RIGHT: 7, DOWN: 0, LEFT: 3 }, //tile26
  { UP: 6, RIGHT: 0, DOWN: 0, LEFT: 7 }, //tile27
  { UP: 5, RIGHT: 4, DOWN: 0, LEFT: 0 }, //tile28
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 4 }, //tile29
];

function preload() {
  for (let i = 0; i < numA; i++) {
    azulejos[i] = loadImage(`newTiles/tile${i}.png`);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const sliderElement = select("#cellSize");
  sliderElement.input(() => {
    RETICULAx = sliderElement.value();
    actualizarDimensiones();
    iniciarCeldas();
  });

  actualizarDimensiones();
  iniciarCeldas();

  const resetButton = select("#resetButton");
  resetButton.mousePressed(() => {
    iniciarCeldas();
    console.log("Estado reiniciado");
  });
}

function draw() {
  background(255, 255, 0);

  renderizarAzulejos();
  const celdaDisponible = celdas.filter((celda) => !celda.colapsada);

  if (celdaDisponible.length > 0) {
    procesarCeldas(celdaDisponible);
  } else {
    console.log("Todas las celdas están colapsadas.");
  }
}

function actualizarDimensiones() {
  ancho = width / RETICULAx;
  alto = ancho;
  RETICULAy = Math.floor(height / ancho);
}

function iniciarCeldas() {
  const opcionesIniciales = Array.from(
    { length: azulejos.length },
    (_, i) => i
  );

  celdas.length = 0; // Limpiar el array
  for (let i = 0; i < RETICULAx * RETICULAx; i++) {
    celdas.push({
      colapsada: false,
      opciones: [...opcionesIniciales],
    });
  }
}

function procesarCeldas(celdaDisponible) {
  celdaDisponible.sort((a, b) => a.opciones.length - b.opciones.length);
  const celdasConMenosOpciones = celdaDisponible.filter(
    (celda) => celda.opciones.length === celdaDisponible[0].opciones.length
  );

  const celdaSeleccionada = random(celdasConMenosOpciones);
  celdaSeleccionada.colapsada = true;
  celdaSeleccionada.opciones = [random(celdaSeleccionada.opciones)];

  actualizarVecinos();
}

function renderizarAzulejos() {
  for (let x = 0; x < RETICULAx; x++) {
    for (let y = 0; y < RETICULAy; y++) {
      const index = x + y * RETICULAx;
      const celda = celdas[index];

      if (celda.colapsada) {
        const indiceAzulejo = celda.opciones[0];
        image(azulejos[indiceAzulejo], x * ancho, y * alto, ancho, alto);
      } else {
        rect(x * ancho, y * alto, ancho, alto);
      }
    }
  }
}

function actualizarVecinos() {
  for (let x = 0; x < RETICULAx; x++) {
    for (let y = 0; y < RETICULAy; y++) {
      const index = x + y * RETICULAx;
      const celda = celdas[index];

      if (celda.colapsada) {
        const indiceAzulejo = celda.opciones[0];
        const reglasActuales = reglas[indiceAzulejo];

        actualizarCeldaVecina(x, y - 1, reglasActuales.UP, "DOWN");
        actualizarCeldaVecina(x + 1, y, reglasActuales.RIGHT, "LEFT");
        actualizarCeldaVecina(x, y + 1, reglasActuales.DOWN, "UP");
        actualizarCeldaVecina(x - 1, y, reglasActuales.LEFT, "RIGHT");
      }
    }
  }
}

function actualizarCeldaVecina(x, y, regla, opuesto) {
  if (x >= 0 && x < RETICULAx && y >= 0 && y < RETICULAy) {
    const index = x + y * RETICULAx;
    const celda = celdas[index];

    if (!celda.colapsada) {
      const nuevasOpciones = celda.opciones.filter(
        (opcion) => regla === reglas[opcion][opuesto]
      );

      if (nuevasOpciones.length === 0) {
        console.warn(
          "Inconsistencia detectada. Opciones agotadas para una celda."
        );
      } else {
        celda.opciones = nuevasOpciones;
      }
    }
  }
}
