# Minesweeper JS

Implementación interactiva del clásico Buscaminas desarrollada con **Vanilla JavaScript**, enfocada en la manipulación dinámica del DOM, gestión de estados sin dependencias externas y algoritmos de recursividad para el revelado de celdas vacías.

---

## Características

* **Generación modular del tablero**: Selección personalizada de dimensiones (ancho × alto) y número de minas mediante CSS Grid reactivo.
* **Control de eventos completo**:
  * Clic izquierdo: Revelado de casillas y cálculo de minas adyacentes.
  * Clic derecho (`contextmenu`): Bloqueo de menú contextual para colocar y retirar banderas.
* **Algoritmo de revelado automático (Flood Fill)**: Implementación recursiva que destapa celdas vacías adyacentes hasta delimitar con casillas numéricas.
* **Marcadores en tiempo real**: Contador dinámico de minas restantes y temporizador de partida.
* **Persistencia local (`localStorage`)**: Almacenamiento y actualización automática del mejor tiempo según la configuración del tablero.

---

## Estructura del Proyecto

```text
├── index.html       # Estructura semántica, controles y contenedor de la cuadrícula
├── style.css        # Layout en CSS Grid, diseño retro/moderno y estados visuales
└── script.js        # Lógica de juego, temporizador, recursión y gestión del DOM
