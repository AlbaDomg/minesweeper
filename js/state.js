/* ==========================================================================
   MODELO DE DATOS Y ESTADO DEL JUEGO (State Management)
   ========================================================================== */

/**
 * Objeto central que almacena todo el estado reactivo de la partida activa.
 * Mantener el estado desacoplado del DOM permite consultar y actualizar datos
 * sin depender de la estructura o lectura del HTML.
 */
const gameState = {
    difficultyKey: 'medium',
    rows: 16,
    cols: 16,
    totalMines: 40,
    flagsCount: 0,
    revealedCount: 0,
    status: 'idle', // Posibles estados: 'idle', 'playing', 'won', 'lost'
    isFirstClick: true,
    secondsElapsed: 0,
    timerId: null,
    matrix: [] // Matriz bidimensional 2D que almacenará los objetos de cada celda
};

/**
 * Crea la estructura inicial de la matriz 2D con objetos vacíos para cada celda.
 * @param {string} difficultyKey - Clave de dificultad ('easy', 'medium', 'expert')
 */
function createEmptyMatrix(difficultyKey = 'medium') {
    const config = DIFFICULTY_CONFIG[difficultyKey] || DIFFICULTY_CONFIG.medium;
    
    // Actualizar propiedades globales de estado
    gameState.difficultyKey = difficultyKey;
    gameState.rows = config.rows;
    gameState.cols = config.cols;
    gameState.totalMines = config.mines;
    gameState.flagsCount = 0;
    gameState.revealedCount = 0;
    gameState.status = 'idle';
    gameState.isFirstClick = true;
    gameState.secondsElapsed = 0;
    
    if (gameState.timerId) {
        clearInterval(gameState.timerId);
        gameState.timerId = null;
    }

    // Inicializar matriz 2D de objetos Celda
    gameState.matrix = [];
    for (let r = 0; r < gameState.rows; r++) {
        const rowArray = [];
        for (let c = 0; c < gameState.cols; c++) {
            rowArray.push({
                row: r,
                col: c,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }
        gameState.matrix.push(rowArray);
    }
}
