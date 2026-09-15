/* ==========================================================================
   LÓGICA DEL JUEGO: COLOCACIÓN DE MINAS Y DELEGACIÓN DE EVENTOS
   ========================================================================== */

/**
 * Coloca aleatoriamente las minas en la matriz garantizando un primer clic seguro.
 * @param {number} safeRow - Fila del primer clic del usuario
 * @param {number} safeCol - Columna del primer clic del usuario
 */
function placeMinesRandomly(safeRow, safeCol) {
    let minesPlaced = 0;
    
    while (minesPlaced < gameState.totalMines) {
        const r = Math.floor(Math.random() * gameState.rows);
        const c = Math.floor(Math.random() * gameState.cols);

        // Comprobar que no haya mina y que no sea la celda inicial ni sus adyacentes inmediatas
        const isSafeZone = Math.abs(r - safeRow) <= 1 && Math.abs(c - safeCol) <= 1;

        if (!gameState.matrix[r][c].isMine && !isSafeZone) {
            gameState.matrix[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calcular minas adyacentes para cada celda de la matriz
    calculateAllNeighborMines();
}

/**
 * Calcula la cantidad de minas vecinas (0 a 8) para cada celda del tablero.
 */
function calculateAllNeighborMines() {
    for (let r = 0; r < gameState.rows; r++) {
        for (let c = 0; c < gameState.cols; c++) {
            if (gameState.matrix[r][c].isMine) continue;

            let count = 0;
            // Recorrer los 8 vecinos inmediatos con desplazamientos (-1, 0, 1)
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    
                    const nr = r + dr;
                    const nc = c + dc;

                    // Verificar límites de la matriz
                    if (nr >= 0 && nr < gameState.rows && nc >= 0 && nc < gameState.cols) {
                        if (gameState.matrix[nr][nc].isMine) {
                            count++;
                        }
                    }
                }
            }
            gameState.matrix[r][c].neighborMines = count;
        }
    }
}

/**
 * Inicializa los escuchadores de eventos usando DELEGACIÓN DE EVENTOS en el tablero.
 */
function setupGameEventListeners() {
    const boardElement = document.getElementById('board');
    if (!boardElement) return;

    // Eliminar listeners previos para evitar duplicaciones al reiniciar
    boardElement.replaceWith(boardElement.cloneNode(true));
    const newBoardElement = document.getElementById('board');

    // 1. Evento Clic Izquierdo (Revelar celda)
    newBoardElement.addEventListener('click', (e) => {
        const cellDOM = e.target.closest('.cell');
        if (!cellDOM) return;

        const row = parseInt(cellDOM.dataset.row, 10);
        const col = parseInt(cellDOM.dataset.col, 10);
        
        handleLeftClick(row, col, cellDOM);
    });

    // 2. Evento Clic Derecho (Colocar/Quitar Bandera)
    newBoardElement.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // ¡CRUCIAL! Anula el menú contextual nativo del navegador

        const cellDOM = e.target.closest('.cell');
        if (!cellDOM) return;

        const row = parseInt(cellDOM.dataset.row, 10);
        const col = parseInt(cellDOM.dataset.col, 10);

        handleRightClick(row, col, cellDOM);
    });
}

/**
 * Maneja la lógica de un clic izquierdo en una celda.
 */
function handleLeftClick(r, c, cellDOM) {
    if (gameState.status === 'won' || gameState.status === 'lost') return;

    const cellData = gameState.matrix[r][c];

    // Si la celda está revelada o tiene bandera, no se hace nada
    if (cellData.isRevealed || cellData.isFlagged) return;

    // Primer Clic Seguro: colocar minas e iniciar el temporizador
    if (gameState.isFirstClick) {
        gameState.isFirstClick = false;
        gameState.status = 'playing';
        placeMinesRandomly(r, c);
        
        if (typeof startTimer === 'function') {
            startTimer();
        }
    }

    // Si hace clic en mina -> Game Over
    if (cellData.isMine) {
        triggerGameOver(r, c);
        return;
    }

    // Revelar celda
    revealSingleCell(r, c, cellDOM);

    // Si no tiene minas vecinas (0), expandir (se completará con la recursión en la Fase 4)
    if (cellData.neighborMines === 0 && typeof expandEmptyCells === 'function') {
        expandEmptyCells(r, c);
    }

    // Verificar victoria tras revelar
    if (typeof checkWinCondition === 'function') {
        checkWinCondition();
    }
}

/**
 * Maneja la lógica de un clic derecho para poner/quitar banderas.
 */
function handleRightClick(r, c, cellDOM) {
    if (gameState.status === 'won' || gameState.status === 'lost') return;

    const cellData = gameState.matrix[r][c];

    // No se pueden poner banderas en celdas ya reveladas
    if (cellData.isRevealed) return;

    // Alternar estado de bandera
    cellData.isFlagged = !cellData.isFlagged;

    if (cellData.isFlagged) {
        cellDOM.classList.add('flagged');
        gameState.flagsCount++;
    } else {
        cellDOM.classList.remove('flagged');
        gameState.flagsCount--;
    }

    // Actualizar el marcador en pantalla
    updateMineCounterDisplay();
}

/**
 * Revela una celda individual en el DOM y en la matriz de estado.
 */
function revealSingleCell(r, c, cellDOM) {
    const cellData = gameState.matrix[r][c];
    if (cellData.isRevealed) return;

    cellData.isRevealed = true;
    gameState.revealedCount++;

    if (!cellDOM) {
        cellDOM = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    }

    if (cellDOM) {
        cellDOM.classList.add('revealed');
        cellDOM.classList.remove('flagged');

        // Si tiene minas alrededor, mostrar el número con su color
        if (cellData.neighborMines > 0) {
            cellDOM.textContent = cellData.neighborMines;
            cellDOM.classList.add(`val-${cellData.neighborMines}`);
        }
    }
}

/**
 * Algoritmo recursivo Flood Fill para expandir áreas vacías (neighborMines === 0).
 * Recorre las 8 celdas adyacentes y se llama a sí misma recursivamente si el vecino también es vacío.
 * @param {number} r - Fila de la celda de origen
 * @param {number} c - Columna de la celda de origen
 */
function expandEmptyCells(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;

            const nr = r + dr;
            const nc = c + dc;

            // 1. Caso Base / Validación de Límites del Tablero
            if (nr < 0 || nr >= gameState.rows || nc < 0 || nc >= gameState.cols) continue;

            const neighbor = gameState.matrix[nr][nc];

            // 2. Caso Base: Si la celda ya fue revelada, tiene bandera o es una mina, SE DETIENE LA RECURSIÓN
            if (neighbor.isRevealed || neighbor.isFlagged || neighbor.isMine) continue;

            // 3. Acción: Revelar la celda vecina
            revealSingleCell(nr, nc);

            // 4. Paso Recursivo: Si la celda recién desvelada tampoco tiene minas vecinas (0), expandir más allá
            if (neighbor.neighborMines === 0) {
                expandEmptyCells(nr, nc);
            }
        }
    }
}

/**
 * Lógica al perder la partida (Game Over).
 */
function triggerGameOver(hitRow, hitCol) {
    gameState.status = 'lost';
    
    if (typeof stopTimer === 'function') {
        stopTimer();
    }

    // Revelar todas las minas del tablero
    for (let r = 0; r < gameState.rows; r++) {
        for (let c = 0; c < gameState.cols; c++) {
            const cell = gameState.matrix[r][c];
            if (cell.isMine) {
                const cellDOM = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                if (cellDOM) {
                    cellDOM.classList.add('revealed', 'mine');
                    if (r === hitRow && c === hitCol) {
                        cellDOM.classList.add('exploded');
                    }
                }
            }
        }
    }

    // Mostrar modal de Game Over
    showGameModal('Game Over', 'Has detonado una mina. ¡Inténtalo de nuevo!');
}

/**
 * Comprueba si el jugador ha ganado la partida (revelado todas las celdas sin mina).
 */
function checkWinCondition() {
    const totalCells = gameState.rows * gameState.cols;
    const totalSafeCells = totalCells - gameState.totalMines;

    if (gameState.revealedCount === totalSafeCells) {
        gameState.status = 'won';

        // 1. Detener el cronómetro
        if (typeof stopTimer === 'function') {
            stopTimer();
        }

        // 2. Marcar automáticamente todas las minas restantes con banderas
        for (let r = 0; r < gameState.rows; r++) {
            for (let c = 0; c < gameState.cols; c++) {
                const cell = gameState.matrix[r][c];
                if (cell.isMine && !cell.isFlagged) {
                    cell.isFlagged = true;
                    const cellDOM = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
                    if (cellDOM) cellDOM.classList.add('flagged');
                }
            }
        }
        gameState.flagsCount = gameState.totalMines;
        updateMineCounterDisplay();

        // 3. Persistir mejor tiempo en localStorage
        let isRecord = false;
        if (typeof saveBestTime === 'function') {
            isRecord = saveBestTime(gameState.difficultyKey, gameState.secondsElapsed);
            updateBestTimeDisplay(gameState.difficultyKey);
        }

        // 4. Mostrar modal de Victoria
        const timeFormatted = typeof formatTimeMMSS === 'function' 
            ? formatTimeMMSS(gameState.secondsElapsed) 
            : `${gameState.secondsElapsed} seg`;

        const recordMsg = isRecord ? ' ¡Nuevo récord personal!' : '';
        showGameModal('¡Victoria!', `¡Has desvelado todas las minas en ${timeFormatted}!${recordMsg}`);
    }
}

/**
 * Muestra el modal de mensaje final.
 */
function showGameModal(title, message) {
    const modal = document.getElementById('game-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');

    if (modal && modalTitle && modalMessage) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }
}
