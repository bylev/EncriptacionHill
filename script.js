const mensaje = document.getElementById('mensaje');
const charCount = document.querySelector('.char-count');
const matrizMensaje = document.getElementById('matrizMensaje');
const k11 = document.getElementById('k11');
const k12 = document.getElementById('k12');
const k21 = document.getElementById('k21');
const k22 = document.getElementById('k22');
const btnEncriptar = document.getElementById('encriptar');
const btnDesencriptar = document.getElementById('desencriptar'); // NUEVO
const resultado = document.getElementById('resultado');

// Actualizar contador de caracteres
mensaje.addEventListener('input', () => {
    const len = mensaje.value.length;
    charCount.textContent = `${len}/30`;
    mostrarMatrizMensaje();
});

// Mostrar matriz del mensaje
function mostrarMatrizMensaje() {
    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        matrizMensaje.textContent = 'Escribe un mensaje primero...';
        return;
    }
    
    const valores = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agrupar en pares
    let matriz = '[';
    for (let i = 0; i < valores.length; i += 2) {
        if (i > 0) matriz += ' ';
        matriz += '[' + valores[i];
        if (i + 1 < valores.length) {
            matriz += ', ' + valores[i + 1];
        } else {
            matriz += ', 23'; // Padding con 'X'
        }
        matriz += ']';
    }
    matriz += ']';
    
    matrizMensaje.textContent = matriz;
}

/* ===================== UTILIDADES MATEMÁTICAS ===================== */

// módulo positivo
function mod(n, m) {
    return ((n % m) + m) % m;
}

// máximo común divisor
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// inversa modular de det (mod 26)
function modInverse(det, m = 26) {
    det = mod(det, m);
    for (let x = 1; x < m; x++) {
        if ((det * x) % m === 1) {
            return x;
        }
    }
    return null; // no tiene inversa
}

// obtener matriz clave
function getKeyMatrix() {
    return [
        [parseInt(k11.value) || 0, parseInt(k12.value) || 0],
        [parseInt(k21.value) || 0, parseInt(k22.value) || 0]
    ];
}

// validar clave e indicar si es invertible módulo 26
function validarClave(key) {
    if (
        key[0][0] === 0 && key[0][1] === 0 &&
        key[1][0] === 0 && key[1][1] === 0
    ) {
        resultado.textContent = 'Error: Ingresa una matriz clave válida';
        resultado.classList.add('error');
        return null;
    }

    const det = key[0][0] * key[1][1] - key[0][1] * key[1][0];
    const detMod = mod(det, 26);

    if (detMod === 0 || gcd(detMod, 26) !== 1) {
        resultado.textContent =
            'Error: La matriz no es invertible módulo 26 (determinante inválido)';
        resultado.classList.add('error');
        return null;
    }

    return det;
}

/* ===================== ENCRIPTAR ===================== */

btnEncriptar.addEventListener('click', () => {
    const key = getKeyMatrix();
    const det = validarClave(key);
    if (det === null) return;

    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        resultado.textContent = 'Error: Ingresa un mensaje';
        resultado.classList.add('error');
        return;
    }
    
    // Convertir texto a números
    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);
    
    // Agregar padding si es impar
    if (numeros.length % 2 !== 0) {
        numeros.push(23); // 'X'
    }
    
    // Encriptar
    let encriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const v1 = numeros[i];
        const v2 = numeros[i + 1];
        
        const c1 = mod(key[0][0] * v1 + key[0][1] * v2, 26);
        const c2 = mod(key[1][0] * v1 + key[1][1] * v2, 26);
        
        encriptado += String.fromCharCode(65 + c1);
        encriptado += String.fromCharCode(65 + c2);
    }
    
    resultado.classList.remove('error');
    resultado.textContent = encriptado;
});

/* ===================== DESENCRIPTAR ===================== */

btnDesencriptar?.addEventListener('click', () => {
    const key = getKeyMatrix();
    const det = validarClave(key);
    if (det === null) return;

    const detMod = mod(det, 26);
    const invDet = modInverse(detMod, 26);

    if (invDet === null) {
        resultado.textContent = 'Error: No se pudo calcular la inversa de la matriz';
        resultado.classList.add('error');
        return;
    }

    // Matriz inversa mod 26:
    // (1/det) * [ d  -b
    //            -c  a ]
    const invKey = [
        [
            mod(invDet * key[1][1], 26),
            mod(invDet * -key[0][1], 26)
        ],
        [
            mod(invDet * -key[1][0], 26),
            mod(invDet * key[0][0], 26)
        ]
    ];

    const texto = mensaje.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (texto.length === 0) {
        resultado.textContent = 'Error: Ingresa el texto cifrado en el cuadro de mensaje';
        resultado.classList.add('error');
        return;
    }

    let numeros = texto.split('').map(char => char.charCodeAt(0) - 65);

    if (numeros.length % 2 !== 0) {
        resultado.textContent = 'Error: El texto cifrado debe tener longitud par';
        resultado.classList.add('error');
        return;
    }

    // Desencriptar
    let desencriptado = '';
    for (let i = 0; i < numeros.length; i += 2) {
        const c1 = numeros[i];
        const c2 = numeros[i + 1];

        const v1 = mod(invKey[0][0] * c1 + invKey[0][1] * c2, 26);
        const v2 = mod(invKey[1][0] * c1 + invKey[1][1] * c2, 26);

        desencriptado += String.fromCharCode(65 + v1);
        desencriptado += String.fromCharCode(65 + v2);
    }

    resultado.classList.remove('error');
    resultado.textContent = desencriptado;
});
