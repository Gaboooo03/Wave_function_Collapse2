const celdas = [];
const RETICULA = 10;
let ancho;
let alto;

const azulejos = [];
const numA = 19; // número de azulejos

const reglas = [
  // Reglas de los bordes de cada azulejo
  { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },
  { UP: 0, RIGHT: 3, DOWN: 2, LEFT: 1 },
  { UP: 0, RIGHT: 0, DOWN: 2, LEFT: 3 },
  { UP: 0, RIGHT: 0, DOWN: 4, LEFT: 0 },
  //{ UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },
  { UP: 0, RIGHT: 3, DOWN: 2, LEFT: 1 },
  { UP: 2, RIGHT: 0, DOWN: 2, LEFT: 3 },
  { UP: 2, RIGHT: 0, DOWN: 4, LEFT: 0 },
  { UP: 4, RIGHT: 5, DOWN: 0, LEFT: 0 },
  { UP: 0, RIGHT: 5, DOWN: 0, LEFT: 5 },
  { UP: 2, RIGHT: 0, DOWN: 0, LEFT: 5 },
  { UP: 2, RIGHT: 0, DOWN: 2, LEFT: 0 },
  { UP: 4, RIGHT: 0, DOWN: 4, LEFT: 0 },
  { UP: 0, RIGHT: 0, DOWN: 4, LEFT: 0 },
  { UP: 0, RIGHT: 6, DOWN: 2, LEFT: 0 },
  { UP: 0, RIGHT: 6, DOWN: 0, LEFT: 6 },
  { UP: 2, RIGHT: 0, DOWN: 0, LEFT: 6 },
  { UP: 4, RIGHT: 0, DOWN: 0, LEFT: 0 },
  { UP: 4, RIGHT: 5, DOWN: 0, LEFT: 0 },
  { UP: 2, RIGHT: 0, DOWN: 0, LEFT: 5 },
];

function preload() {
  for (let i = 0; i < numA; i++) {
    azulejos[i] = loadImage("newTiles/tile" + i + ".png");
  }
}

function setup() {
  createCanvas(1080, 1080);

  ancho = width / RETICULA;
  alto = height / RETICULA;

  iniciarCeldas();
}

function draw() {
  const celdaDis = celdas.filter((celda) => !celda.colapsada);

  if (celdaDis.length > 0) {
    celdaDis.sort((a, b) => a.opciones.length - b.opciones.length);
    const celdasXColapsar = celdaDis.filter(
      (celda) => celda.opciones.length == celdaDis[0].opciones.length
    );

    const celdaSelec = random(celdasXColapsar);
    celdaSelec.colapsada = true;

    const opcionSelec = random(celdaSelec.opciones);
    celdaSelec.opciones = [opcionSelec];

    for (let x = 0; x < RETICULA; x++) {
      for (let y = 0; y < RETICULA; y++) {
        const celdaIndex = x + y * RETICULA;
        const celdaActual = celdas[celdaIndex];
        if (celdaActual.colapsada) {
          const indiceAzulejo = celdaActual.opciones[0];
          image(azulejos[indiceAzulejo], x * ancho, y * alto, ancho, alto);
        } else {
          strokeWeight(1);
          fill(240);
          rect(x * ancho, y * alto, ancho, alto);
        }
      }
    }

    actualizarVecinos();
  } else {
    // Reiniciar el proceso
    iniciarCeldas();
  }
}

function iniciarCeldas() {
  let opcionesInit = [];
  for (let i = 0; i < azulejos.length; i++) {
    opcionesInit.push(i);
  }

  for (let i = 0; i < RETICULA * RETICULA; i++) {
    celdas[i] = {
      colapsada: false,
      opciones: [...opcionesInit],
    };
  }
}

function actualizarVecinos() {
  for (let x = 0; x < RETICULA; x++) {
    for (let y = 0; y < RETICULA; y++) {
      const celdaIndex = x + y * RETICULA;
      const celdaActual = celdas[celdaIndex];

      if (celdaActual.colapsada) {
        const indiceAzulejo = celdaActual.opciones[0];
        const reglasActuales = reglas[indiceAzulejo];

        // Monitorear UP
        if (y > 0) {
          const indiceUP = x + (y - 1) * RETICULA;
          const celdaUp = celdas[indiceUP];
          if (!celdaUp.colapsada) {
            cambiarDireccion(celdaUp, reglasActuales["UP"], "DOWN");
          }
        }

        // Monitorear RIGHT
        if (x < RETICULA - 1) {
          const indiceRight = x + 1 + y * RETICULA;
          const celdaRight = celdas[indiceRight];
          if (!celdaRight.colapsada) {
            cambiarDireccion(celdaRight, reglasActuales["RIGHT"], "LEFT");
          }
        }

        // Monitorear DOWN
        if (y < RETICULA - 1) {
          const indiceDown = x + (y + 1) * RETICULA;
          const celdaDown = celdas[indiceDown];
          if (!celdaDown.colapsada) {
            cambiarDireccion(celdaDown, reglasActuales["DOWN"], "UP");
          }
        }

        // Monitorear LEFT
        if (x > 0) {
          const indiceLeft = x - 1 + y * RETICULA;
          const celdaLeft = celdas[indiceLeft];
          if (!celdaLeft.colapsada) {
            cambiarDireccion(celdaLeft, reglasActuales["LEFT"], "RIGHT");
          }
        }
      }
    }
  }
}

function cambiarDireccion(_celda, _regla, _opuesto) {
  const nuevasOpciones = [];
  for (let i = 0; i < _celda.opciones.length; i++) {
    if (_regla == reglas[_celda.opciones[i]][_opuesto]) {
      nuevasOpciones.push(_celda.opciones[i]);
    }
  }
  _celda.opciones = nuevasOpciones;
}
