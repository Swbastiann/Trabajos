type Opcion = "piedra" | "papel" | "tijera" | "lagarto" | "spock";

const reglas: Record<Opcion, Opcion[]> = {
    piedra: ["tijera", "lagarto"],
    papel: ["piedra", "spock"],
    tijera: ["papel", "lagarto"],
    lagarto: ["papel", "spock"],
    spock: ["tijera", "piedra"]
};

function estaEnArray(arr: Opcion[], valor: Opcion): boolean {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === valor) {
            return true;
        }
    }
    return false;
}

let victoriasJugador = 0;
let victoriasPC = 0;

function play(eleccionJugador: Opcion): void {
    const opciones: Opcion[] = ["piedra", "papel", "tijera", "lagarto", "spock"];
    const eleccionPC: Opcion = opciones[Math.floor(Math.random() * 5)];

    let resultado = "";

    if (eleccionJugador === eleccionPC) {
        resultado = `Empate`;
    } else if (estaEnArray(reglas[eleccionJugador], eleccionPC)) {
        resultado = `¡Ganaste!`;
        victoriasJugador++;
    } else {
        resultado = `Perdiste`;
        victoriasPC++;
    }

    const divResultado = document.getElementById("resultado");
    (document.getElementById("jugador")!).textContent = eleccionJugador;
    (document.getElementById("pc")!).textContent = eleccionPC;
    (document.getElementById("resultado")!).textContent = resultado;
    (document.getElementById("victoriasJugador")!).textContent = victoriasJugador.toString();
    (document.getElementById("victoriasPC")!).textContent = victoriasPC.toString();
    if (divResultado) {
        divResultado.textContent = resultado;
    }
}


