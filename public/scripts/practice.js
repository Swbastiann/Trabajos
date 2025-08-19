"use strict";
const reglas = {
    piedra: ["tijera", "lagarto"],
    papel: ["piedra", "spock"],
    tijera: ["papel", "lagarto"],
    lagarto: ["papel", "spock"],
    spock: ["tijera", "piedra"]
};
function estaEnArray(arr, valor) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === valor) {
            return true;
        }
    }
    return false;
}
let victoriasJugador = 0;
let victoriasPC = 0;
function play(eleccionJugador) {
    const opciones = ["piedra", "papel", "tijera", "lagarto", "spock"];
    const eleccionPC = opciones[Math.floor(Math.random() * 5)];
    let resultado = "";
    if (eleccionJugador === eleccionPC) {
        resultado = `Empate`;
    }
    else if (estaEnArray(reglas[eleccionJugador], eleccionPC)) {
        resultado = `¡Ganaste!`;
        victoriasJugador++;
    }
    else {
        resultado = `Perdiste`;
        victoriasPC++;
    }
    const divResultado = document.getElementById("resultado");
    (document.getElementById("jugador")).textContent = eleccionJugador;
    (document.getElementById("pc")).textContent = eleccionPC;
    (document.getElementById("resultado")).textContent = resultado;
    (document.getElementById("victoriasJugador")).textContent = victoriasJugador.toString();
    (document.getElementById("victoriasPC")).textContent = victoriasPC.toString();
    if (divResultado) {
        divResultado.textContent = resultado;
    }
}
