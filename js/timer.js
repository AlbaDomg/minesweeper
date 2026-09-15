/* ==========================================================================
   LÓGICA DEL TEMPORIZADOR DE JUEGO (Timer System)
   ========================================================================== */

/**
 * Inicia el cronómetro de la partida al realizar el primer clic.
 */
function startTimer() {
    // Si ya había un temporizador activo, limpiarlo
    stopTimer();

    gameState.secondsElapsed = 0;
    updateTimerDisplay();

    gameState.timerId = setInterval(() => {
        // Límite estándar del temporizador LCD de Buscaminas (999 segundos)
        if (gameState.secondsElapsed < 999) {
            gameState.secondsElapsed++;
            updateTimerDisplay();
        } else {
            stopTimer();
        }
    }, 1000);
}

/**
 * Detiene el cronómetro actual.
 */
function stopTimer() {
    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }
}

/**
 * Resetea el temporizador a 0 y detiene la cuenta.
 */
function resetTimer() {
    stopTimer();
    gameState.secondsElapsed = 0;
    updateTimerDisplay();
}

/**
 * Actualiza la pantalla digital del temporizador (#timer) en el DOM.
 */
function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer');
    if (!timerDisplay) return;

    // Formatear a 3 dígitos (ej: "005", "042", "120")
    timerDisplay.textContent = String(gameState.secondsElapsed).padStart(3, '0');
}

/**
 * Convierte segundos a formato legible MM:SS (ej: 75 -> "01:15").
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTimeMMSS(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds === null) return '--:--';
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
