# Tecnológico de Software
## Materia: Fundamentos de álgebra
## Alumno: Michelle Cámara González
## Actividad 21. Cifrado Hill


--- 
# Indice de contenidos
- [Objetivo](#objetivo)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Descripción del proyecto](#descripción-del-proyecto)
- [Instrucciones de uso](#instrucciones-de-uso)
- [Detalles sobre las matemáticas del cifrado Hill](#detalles-sobre-las-matemáticas-del-cifrado-hill)
- [Interfaz de usuario](#interfaz-de-usuario)
    - [Presentación visual](#presentación-visual)
        - [Paleta (coffee / pastel)](#paleta-coffee--pastel)
        - [Tipografías (Google Fonts)](#tipografías-google-fonts)
        - [Iconografía y títulos](#iconografía-y-títulos)
        - [Caja de resultado (clases y estados)](#caja-de-resultado-clases-y-estados)
        - [Layout](#layout)
- [Demostración en línea](#demostración-en-línea)
- [Control de versiones](#control-de-versiones)

---
# Objetivo

Realizar un programa que implemente el cifrado Hill mediante el uso de matrices.

---

# Estructura del proyecto

```
EncriptacionHill/
├── README.md       # Documentación del proyecto
├── index.html      # Interfaz principal
├── style.css       # Estilos y diseño
└── script.js       # ⭐ Lógica de encriptación y desencriptación
```

---
# Descripción del proyecto

Este proyecto implementa el cifrado Hill, un método de cifrado por bloques que utiliza álgebra lineal y matrices para transformar mensajes. El programa permite a los usuarios ingresar texto plano y una clave en forma de matriz, y luego realiza la encriptación o desencriptación del mensaje según la clave proporcionada.

---

# Instrucciones de uso

1. **Abrir la aplicación**: Abre el archivo `index.html` en tu navegador web o despliega la interfaz en la Demo en línea.

2. **Ingresar el mensaje**:
* Escribe el texto que deseas encriptar o desencriptar en el área designada. 
* Solo se consideran letras A-Z. 
* Los espacios y caracteres especiales serán eliminados automáticamente.
* El contadoer muestra ```caracteres_usados/30```.

3. **Revisar la matriz clave**: 
* Debajo se muestra la matriz del mensaje en forma de pares, por ejemplo: ``[[19, 4] [18,19]]`` para el mensaje "TEST".

4. **Ingresa la matriz clave (2x2)**:
* Llena los campos:
    - a --> fila 1, columna 1
    - b --> fila 1, columna 2
    - c --> fila 2, columna 1
    - d --> fila 2, columna 2
* Ejemplo de clave válida: 
    - a = 6
    - b = 24
    - c = 1
    - d = 13

5. **Encriptar**:
* Haz clic en el botón "Encriptar" para transformar el mensaje usando la matriz clave.
* El resultado aparecerá en el recuadro "Resultado".
* Si el mensaje tiene longitud impar, se agrega automáticamente una 'X' al final.

6. **Desencriptar**:
* Pega el texto cifrado en el área de mensaje.
* Introduce la misma matriz clave utilizada para encriptar.
* Haz clic en el botón "Desencriptar" para recuperar el mensaje original.
* El resultado aparecerá en el recuadro "Resultado".

7. **Manejo de errores**:
* Si la matriz clave no es válida (no invertible), aparecerá un mensaje de error.
  - ```Error: La matriz clave no es invertible. Por favor, ingresa una clave válida.```
* Si el mensaje está vacío, se indica que se debe ingresar un mensaje.

---

# Detalles sobre las matemáticas del cifrado Hill

1. **Algebra lineal**: El cifrado Hill utiliza matrices para transformar bloques de texto plano en texto cifrado mediante multiplicación matricial.

2. **Alfabeto y representación numérica**: Cada letra del alfabeto se representa como un número ```(A=0, B=1, ..., Z=25)```.

3. **Matriz clave (2x2)**: La matriz clave debe ser invertible módulo 26 para que el cifrado y descifrado funcionen correctamente.

```
K = [ a  b ]
    [ c  d ]
```
Para que la matriz pueda usarse como clave, debe cumplir que el determinante ```(ad - bc)``` sea coprimo con 26. Y se requiere que el determinante tenga un inverso multiplicativo módulo 26:  ```gcd(det(K) mod 26, 26) = 1```.

Si esto no se cumple, la matriz no tiene inversa módulo 26, y no se puede usar para el cifrado Hill.

4. **Encriptación**: El mensaje se divide en bloques de tamaño igual a la dimensión de la matriz clave (2 en este caso). Cada bloque se multiplica por la matriz clave y se toma el resultado módulo 26 para obtener el texto cifrado.
```
P = [ p1 ]
    [ p2 ]

C = K * P mod 26
```

5. **Desencriptación**: Para recuperar el mensaje original, se calcula la inversa de la matriz clave módulo 26 y se multiplica por el bloque de texto cifrado.
```
det(K) = ad - bc

(det(K) * det⁻¹) mod 26 = 1

K = [  d  -b ]
    [ -c   a ]

K⁻¹ = det⁻¹ · [  d  -b ]
              [ -c   a ]   (todo calculado mod 26)

P = K⁻¹ · C mod 26
```
---

# Interfaz de usuario

## Presentación visual

Pequeña guía de estilo para la interfaz: paleta, tipografías, iconografía y estilos de la caja de resultado.

### Paleta (coffee / pastel)
Colores usados en style.css:

- Base / fondo página: ```#fdfcf9```
- Fondo tarjeta principal (.container): ``#fffaf5``
- Texto principal y bordes: ``#6f4e37``
- Bordes/acento tarjeta: ``#d8b99b``
- Sombras y acentos café:```#b08968```, ```#a47551```
- Errores: fondo ```#ffebee```, borde ```#f0a0a0```, texto ```#f19e9e```

La intención es un estilo cálido tipo cafetería, con una tarjeta clara en el centro y acentos en tonos café.

### Tipografías (Google Fonts)
- **Lexend Deca**: texto general y UI.
- **Playwrite GB J**: título principal.

Ejemplo de import:
```html
<link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Playwrite+GB+J&display=swap" rel="stylesheet">
```

### Iconografía y títulos
Usar emojis temáticos en los encabezados para darle identidad:
- 🍰 Mensaje
- 🍵 Matriz del mensaje
- 🥛 Matriz clave
- 🧋 Resultado

### Caja de resultado (clases y estados)
En el CSS, la caja de resultado está definida así:

- ```.resultado-box```: caja principal donde se muestra el texto cifrado / descifrado.
- ```.error```: estilo aplicado sobre la misma caja cuando hay un mensaje de error.


Ejemplos CSS básicos:
```css
.resultado-box {
    background: #f9f4f4;
    padding: 20px;
    border-radius: 4px;
    border: 2px solid #6f4e37;
    min-height: 60px;
    font-family: 'Lexend Deca', sans-serif;
    color: #333;
    word-wrap: break-word;
}

.error {
    color: #f19e9e;
    background: #ffebee;
    border-color: #f0a0a0;
}
```

### Layout
Diseño centrado tipo tarjeta con márgenes generosos y sombras suaves para destacar el contenido principal:
```css
body {
    font-family: "Lexend Deca", sans-serif, Tahoma, Geneva, Verdana, sans-serif;
    background: #fdfcf9;
    color: #6f4e37;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background-color: #fffaf5;
    border: 3px solid #d8b99b;
    max-width: 600px;
    width: 100%;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 10px 40px #b08968;
}
```

Esta personalización busca que la aplicación sea funcional y tenga una identidad visual coherente y agradable.

---

# Demostración en línea
Puedes probar la aplicación en línea aquí:  
👉 [Encriptación Hill – Demo](https://bylev.github.io/EncriptacionHill/)

--- 

# Control de versiones

El proyecto está versionado con Git, con commits que reflejan:

- Creación de estructura base (HTML/CSS).
- Implementación del cifrado Hill.
- Agregado de desencriptación con matriz inversa módulo 26.
- Validaciones y manejo de errores.
- Ajustes visuales y despliegue en Netlify.

---

