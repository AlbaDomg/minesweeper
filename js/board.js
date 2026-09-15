/* ==========================================================================
   GENERACIÓN DINÁMICA DEL TABLERO EN EL DOM
   ========================================================================== */

/**
 * Renderiza dinámicamente la cuadrícula de celdas en el DOM a partir de gameState.
 * Utiliza DocumentFragment para minimizar los reflujos (reflows) y repintados del navegador.
 */
function renderBoardDOM() {
    const boardElement = document.getElementById('board');
    if (!boardElement) return;

    // 1. Limpiar el contenido anterior del tablero
    boardElement.innerHTML = '';

    // 2. Actualizar variables CSS en el elemento para ajustar la grilla dinámicamente
    boardElement.style.setProperty('--grid-rows', gameState.rows);
    boardElement.style.setProperty('--grid-cols', gameState.cols);

    // 3. Crear un DocumentFragment para acumular las celdas fuera del DOM activo
    const fragment = document.createDocumentFragment();

    for (let r = 0; r < gameState.rows; r++) {
        for (let c = 0; c < gameState.cols; c++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            
            // Atributos de datos (dataset) para vinculación rápida con el modelo de datos
            cellElement.dataset.row = r;
            cellElement.dataset.col = c;

            fragment.appendChild(cellElement);
        }
    }

    // 4. Inserción única e inyección en el DOM en un solo paso
    boardElement.appendChild(fragment);

    // 5. Actualizar interfaz de marcadores
    updateMineCounterDisplay();
}

/**
 * Formatea y actualiza la pantalla del contador de minas restantes (formato digital 3 dígitos: ej. "040" o "-05").
 */
function updateMineCounterDisplay() {
    const mineCountDisplay = document.getElementById('mine-count');
    if (!mineCountDisplay) return;

    const remainingMines = gameState.totalMines - gameState.flagsCount;
    
    // Formatear con ceros a la izquierda para apariencia de marcador LCD
    let formattedNumber;
    if (remainingMines >= 0) {
        formattedNumber = String(remainingMines).padStart(3, '0');
    } else {
        // En caso de colocar más banderas que minas
        formattedNumber = '-' + String(Math.abs(remainingMines)).padStart(2, '0');
    }

    mineCountDisplay.textContent = formattedNumber;
}
