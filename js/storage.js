/* ==========================================================================
   PERSISTENCIA DE RÉCORDS CON LOCALSTORAGE (Storage System)
   ========================================================================== */

const STORAGE_PREFIX = 'buscaminas_best_time_';

/**
 * Obtiene el mejor tiempo guardado (en segundos) para la dificultad dada.
 * @param {string} difficultyKey - 'easy', 'medium', 'expert'
 * @returns {number|null}
 */
function getBestTime(difficultyKey) {
    try {
        const saved = localStorage.getItem(STORAGE_PREFIX + difficultyKey);
        return saved !== null ? parseInt(saved, 10) : null;
    } catch (e) {
        console.warn('localStorage no disponible:', e);
        return null;
    }
}

/**
 * Intenta guardar una nueva marca de tiempo. Si es menor que la anterior (o primera vez), actualiza.
 * @param {string} difficultyKey
 * @param {number} newSeconds
 * @returns {boolean} True si se ha superado un nuevo récord personal.
 */
function saveBestTime(difficultyKey, newSeconds) {
    try {
        const currentBest = getBestTime(difficultyKey);
        
        if (currentBest === null || newSeconds < currentBest) {
            localStorage.setItem(STORAGE_PREFIX + difficultyKey, newSeconds.toString());
            return true; // Es nuevo récord
        }
    } catch (e) {
        console.warn('Error al guardar en localStorage:', e);
    }
    return false;
}

/**
 * Actualiza el texto del banner de récord personal en el HTML según la dificultad activa.
 * @param {string} difficultyKey
 */
function updateBestTimeDisplay(difficultyKey) {
    const bestTimeDisplay = document.getElementById('best-time-display');
    const diffLabel = document.getElementById('current-diff-label');
    
    if (diffLabel && DIFFICULTY_CONFIG[difficultyKey]) {
        diffLabel.textContent = DIFFICULTY_CONFIG[difficultyKey].name;
    }

    if (!bestTimeDisplay) return;

    const bestSeconds = getBestTime(difficultyKey);
    if (bestSeconds !== null && typeof formatTimeMMSS === 'function') {
        bestTimeDisplay.textContent = formatTimeMMSS(bestSeconds);
    } else {
        bestTimeDisplay.textContent = '--:--';
    }
}
