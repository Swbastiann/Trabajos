var reglas = {
    piedra: ["tijera", "lagarto"],
    papel: ["piedra", "spock"],
    tijera: ["papel", "lagarto"],
    lagarto: ["papel", "spock"],
    spock: ["tijera", "piedra"]
};
function estaEnArray(arr, valor) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === valor) {
            return true;
        }
    }
    return false;
}
function play(eleccionJugador) {
    var opciones = ["piedra", "papel", "tijera", "lagarto", "spock"];
    var eleccionPC = opciones[Math.floor(Math.random() * 5)];
    var resultado = "";
    if (eleccionJugador === eleccionPC) {
        resultado = "Empate";
    }
    else if (estaEnArray(reglas[eleccionJugador], eleccionPC)) {
        resultado = "\u00A1Ganaste!";
    }
    else {
        resultado = "Perdiste";
    }
    var divResultado = document.getElementById("resultado");
    if (divResultado) {
        divResultado.textContent = resultado;
    }
}
