/* ==========================================================================
   PUNTO DE ENTRADA E INICIALIZACIÓN DE LA APLICACIÓN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNewGame('medium');
    setupUIListeners();
});

/**
 * Arranca o reinicia una nueva partida con la dificultad especificada.
 * @param {string} difficultyKey - 'easy', 'medium', 'expert'
 */
function initNewGame(difficultyKey = 'medium') {
    // 1. Ocultar modal si estuviera abierto
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.add('hidden');

    // 2. Inicializar la matriz de datos en estado
    createEmptyMatrix(difficultyKey);

    // 3. Detener y reiniciar temporizador
    if (typeof resetTimer === 'function') {
        resetTimer();
    }

    // 4. Mostrar mejor tiempo almacenado para esta dificultad
    if (typeof updateBestTimeDisplay === 'function') {
        updateBestTimeDisplay(difficultyKey);
    }

    // 5. Renderizar las celdas dinámicamente en el DOM
    renderBoardDOM();

    // 6. Configurar escuchadores de eventos en el tablero
    setupGameEventListeners();
}

/**
 * Configura los eventos de la interfaz de usuario (dificultad, botón de reinicio, modal).
 */
function setupUIListeners() {
    const difficultySelect = document.getElementById('difficulty');
    const resetBtn = document.getElementById('reset-btn');
    const modalPlayAgainBtn = document.getElementById('modal-play-again');

    if (difficultySelect) {
        difficultySelect.addEventListener('change', (e) => {
            initNewGame(e.target.value);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const currentDiff = difficultySelect ? difficultySelect.value : 'medium';
            initNewGame(currentDiff);
        });
    }

    if (modalPlayAgainBtn) {
        modalPlayAgainBtn.addEventListener('click', () => {
            const currentDiff = difficultySelect ? difficultySelect.value : 'medium';
            initNewGame(currentDiff);
        });
    }
}
